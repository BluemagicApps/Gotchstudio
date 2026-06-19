import { NextRequest } from "next/server";
import { getAnthropic } from "@/lib/ai/anthropic";
import { AI_MODEL, hasAnthropic } from "@/lib/ai/env";
import { getStyle, styleIds } from "@/lib/ai/styles";
import { checkRateLimit, tooManyRequests } from "@/lib/ai/rate-limit";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface StyleProfile {
  title: string;
  tagline: string;
  summary: string;
  palette: { name: string; hex: string }[];
  materials: string[];
  rooms: { room: string; idea: string }[];
  nextStep: string;
}

/** On-brand static profile used when Claude isn't configured or generation fails. */
function fallbackProfile(styleId: string): StyleProfile {
  const style = getStyle(styleId);
  return {
    title: style.name,
    tagline: "Your design profile",
    summary: style.description,
    palette: [
      { name: "Ivory", hex: "#F4EFE6" },
      { name: "Warm Taupe", hex: "#B9A98F" },
      { name: "Charcoal", hex: "#211E1B" },
      { name: "Brass", hex: "#B08D57" },
    ],
    materials: ["Natural oak", "Linen", "Honed stone", "Aged brass"],
    rooms: [
      {
        room: "Living room",
        idea: "Anchor the space with a low, tactile sofa and a single sculptural light.",
      },
      {
        room: "Bedroom",
        idea: "Layer soft neutrals and natural fibers for a calm, restorative retreat.",
      },
    ],
    nextStep: `Bring this direction to life with our team — start on the contact page or email ${siteConfig.email}.`,
  };
}

function clampStr(v: unknown, max: number): string {
  return typeof v === "string" ? v.slice(0, max) : "";
}

/** Coerce arbitrary model JSON into a safe, fully-populated StyleProfile. */
function normalizeProfile(data: unknown, styleId: string): StyleProfile {
  const base = fallbackProfile(styleId);
  if (!data || typeof data !== "object") return base;
  const d = data as Record<string, unknown>;

  const palette = Array.isArray(d.palette)
    ? d.palette
        .map((p) => {
          const o = (p ?? {}) as Record<string, unknown>;
          return { name: clampStr(o.name, 40), hex: clampStr(o.hex, 9) };
        })
        .filter((p) => /^#[0-9a-fA-F]{3,8}$/.test(p.hex))
        .slice(0, 6)
    : [];

  const materials = Array.isArray(d.materials)
    ? d.materials.map((m) => clampStr(m, 60)).filter(Boolean).slice(0, 8)
    : [];

  const rooms = Array.isArray(d.rooms)
    ? d.rooms
        .map((r) => {
          const o = (r ?? {}) as Record<string, unknown>;
          return { room: clampStr(o.room, 40), idea: clampStr(o.idea, 240) };
        })
        .filter((r) => r.room && r.idea)
        .slice(0, 4)
    : [];

  return {
    title: clampStr(d.title, 60) || base.title,
    tagline: clampStr(d.tagline, 80) || base.tagline,
    summary: clampStr(d.summary, 600) || base.summary,
    palette: palette.length ? palette : base.palette,
    materials: materials.length ? materials : base.materials,
    rooms: rooms.length ? rooms : base.rooms,
    nextStep: clampStr(d.nextStep, 240) || base.nextStep,
  };
}

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, "style-profile", 15, 60_000);
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  let body: { styleId?: string; answers?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const styleId =
    typeof body.styleId === "string" && styleIds.includes(body.styleId)
      ? body.styleId
      : styleIds[0];

  if (!hasAnthropic()) {
    return Response.json({ profile: fallbackProfile(styleId), demo: true });
  }

  const style = getStyle(styleId);
  // Quiz answer labels (strings), if provided, sharpen the personalization.
  const answers = Array.isArray(body.answers)
    ? body.answers
        .map((a) => (typeof a === "string" ? a.slice(0, 80) : ""))
        .filter(Boolean)
        .slice(0, 8)
    : [];

  const system = `You are the lead designer at ${siteConfig.name}, a luxury interior design studio. A visitor has taken a style quiz. Write them a warm, sophisticated, personalized design profile. Be specific and tasteful; never generic. Respond with ONLY a JSON object — no prose, no markdown fences — exactly this shape:
{
  "title": "the style name",
  "tagline": "a short evocative phrase (max ~8 words)",
  "summary": "2-3 sentences describing their aesthetic and why it suits them",
  "palette": [{"name": "color name", "hex": "#RRGGBB"}, ... 4-5 colors],
  "materials": ["material", ... 4-6 items],
  "rooms": [{"room": "room name", "idea": "one concrete styling idea"}, ... 2-3 items],
  "nextStep": "one inviting sentence pointing them to work with the studio"
}`;

  const user = `Their dominant style is "${style.name}": ${style.description}.${
    answers.length ? ` Quiz answers they chose: ${answers.join(", ")}.` : ""
  } Write their profile JSON now.`;

  try {
    const message = await getAnthropic().messages.create({
      model: AI_MODEL,
      max_tokens: 1024,
      output_config: { effort: "medium" },
      system,
      messages: [{ role: "user", content: user }],
    });

    const text = message.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();

    // Tolerate stray prose: extract the first JSON object if present.
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : null;
    return Response.json({
      profile: normalizeProfile(parsed, styleId),
      demo: false,
    });
  } catch (err) {
    console.error("[/api/style-profile] error:", err);
    return Response.json({ profile: fallbackProfile(styleId), demo: true });
  }
}
