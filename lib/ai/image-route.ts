import { NextRequest } from "next/server";
import { runImageModel } from "./replicate";
import { hasReplicate, AI_LIMITS } from "./env";
import { getStyle, styleIds } from "./styles";
import { checkRateLimit, tooManyRequests } from "./rate-limit";

interface ImageBody {
  image?: string;
  styleId?: string;
}

interface ImageRouteOptions {
  /** Rate-limit bucket name. */
  bucket: string;
  /** Full `owner/name:version` Replicate model reference. */
  model: string;
  /** Builds the prompt + negative prompt for the chosen style. */
  prompts: (styleId: string) => { prompt: string; negative_prompt: string };
}

/** Roughly estimate decoded byte size of a base64 data URL. */
function dataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(",");
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  return Math.floor((b64.length * 3) / 4);
}

/**
 * Shared handler for the Room Visualizer and Virtual Staging endpoints. Both
 * take a client-downscaled room photo (data URL) + a style id, run a Replicate
 * image model, and return `{ image }`. When no Replicate token is configured
 * they return the curated reference image for the style with `demo: true`, so
 * the tool still demonstrates the experience.
 */
export async function handleImageGeneration(
  req: NextRequest,
  opts: ImageRouteOptions,
): Promise<Response> {
  const limit = checkRateLimit(req, opts.bucket, 8, 60_000);
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  let body: ImageBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const styleId = typeof body.styleId === "string" ? body.styleId : "";
  if (!styleIds.includes(styleId)) {
    return Response.json({ error: "Unknown style." }, { status: 400 });
  }

  const image = typeof body.image === "string" ? body.image : "";
  if (!image.startsWith("data:image/")) {
    return Response.json({ error: "A valid image is required." }, { status: 400 });
  }
  if (dataUrlBytes(image) > AI_LIMITS.maxImageBytes) {
    return Response.json(
      { error: "Image is too large. Please use a smaller photo." },
      { status: 413 },
    );
  }

  const style = getStyle(styleId);

  // Graceful fallback: curated reference image when generation isn't configured.
  if (!hasReplicate()) {
    return Response.json({ image: style.preview, demo: true });
  }

  try {
    const { prompt, negative_prompt } = opts.prompts(styleId);
    const url = await runImageModel(opts.model, {
      image,
      prompt,
      negative_prompt,
      num_inference_steps: 30,
      guidance_scale: 15,
      prompt_strength: 0.8,
    });
    return Response.json({ image: url, demo: false });
  } catch (err) {
    console.error(`[/api/${opts.bucket}] generation error:`, err);
    // Never break the experience — fall back to the curated reference.
    return Response.json({ image: style.preview, demo: true });
  }
}
