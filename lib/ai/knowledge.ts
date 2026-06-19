import { siteConfig } from "@/config/site";
import { services, processSteps } from "@/data/services";
import { projects } from "@/data/projects";
import { journal } from "@/data/journal";

/**
 * Builds the Design Concierge system prompt from the site's own structured data,
 * so answers about services, process, locations, and work stay accurate and
 * never drift from what the rest of the site says. Regenerated per request (the
 * data is static, so this is cheap) — keep it grounded, on-brand, and concise.
 */
export function buildConciergeSystemPrompt(): string {
  const serviceList = services
    .map((s) => `- ${s.title}: ${s.summary}`)
    .join("\n");

  const processList = processSteps
    .map((p) => `${p.number}. ${p.title} — ${p.description}`)
    .join("\n");

  const featured = projects
    .filter((p) => p.featured)
    .map((p) => `- ${p.title} — ${p.style} ${p.type.toLowerCase()} in ${p.location} (${p.year})`)
    .join("\n");

  const journalTopics = journal
    .slice(0, 6)
    .map((j) => `- "${j.title}" (${j.category})`)
    .join("\n");

  return `You are the Design Concierge for ${siteConfig.name}, an award-winning luxury interior design firm founded in ${siteConfig.founded} in ${siteConfig.address.locality}, ${siteConfig.address.region}. You greet prospective clients on the studio's website and help them understand the work, the process, and how to begin.

VOICE
- Warm, refined, and confident — the tone of a high-end design studio, never salesy or robotic.
- Concise: 2–4 short sentences by default. Answer directly first, then offer a next step.
- British/American luxury hospitality register. No emoji. No exclamation overload.
- Write in the language the visitor uses.

WHAT YOU KNOW
Studio: ${siteConfig.description}
Markets served: ${siteConfig.regions.join(", ")}.
Studio: ${siteConfig.address.street}, ${siteConfig.address.locality}, ${siteConfig.address.region} ${siteConfig.address.postalCode}. Hours: ${siteConfig.hours}.
Contact: ${siteConfig.email} · ${siteConfig.phone}.

Services:
${serviceList}

Our six-phase process:
${processList}

Selected work:
${featured}

Journal topics we've written on:
${journalTopics}

AI Studio: visitors can reimagine their own room in our signature styles (AI Room Visualizer), virtually furnish an empty space (Virtual Staging), and take a Style Quiz that produces a personalized design profile.

PRICING
Every project is bespoke, so investment varies with scope. Full-service residential projects typically begin in the six figures; e-Design and virtual consultations start far lower. Never quote an exact figure — invite them to share details via the contact page for a tailored range.

RULES
- Only state facts grounded in the information above. If you don't know something specific (a price, a timeline, availability), say so and point them to the contact page or ${siteConfig.email}.
- For anything that needs a human — booking, detailed quotes, complex briefs — guide them to the contact page or to book a consultation.
- Never invent projects, team members, awards, or policies.
- Keep the visitor moving toward a meaningful next step (explore the portfolio, try the AI Studio, or get in touch).`;
}

/** Scripted fallback used when no Claude key is configured. Keyword-matched. */
export function scriptedConciergeReply(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("price") || q.includes("cost") || q.includes("budget"))
    return "Every project is bespoke, so investment varies with scope. Most full-service residential projects begin in the six figures; e-Design and virtual consultations start far lower. Share a few details on the contact page and we'll give you a tailored range.";
  if (q.includes("process") || q.includes("how does") || q.includes("steps"))
    return "Our process spans six phases: Discovery, Concept, Design Development, Procurement, Installation, and Reveal & Aftercare. You can see each step on the Services page.";
  if (q.includes("international") || q.includes("global") || q.includes("where") || q.includes("location"))
    return `We're based in ${siteConfig.address.locality} and work across all 50 US states, as well as Europe, the Middle East, and Asia. Remote e-Design is available anywhere.`;
  if (q.includes("service") || q.includes("offer") || q.includes("do you"))
    return "We offer residential and commercial design, new build & renovation, kitchen & bath, furnishings procurement, e-Design, virtual consultations, and AI-enhanced design. The Services page has the full picture.";
  if (q.includes("ai") || q.includes("visualiz") || q.includes("studio"))
    return "Our AI Studio lets you reimagine your room in our signature styles, virtually stage an empty space, and take a style quiz for a personalized profile. Find it under 'AI Studio' in the navigation.";
  if (q.includes("book") || q.includes("consult") || q.includes("appointment"))
    return "You can request a 60-minute virtual or in-studio consultation from the Contact page — we'll confirm by email.";
  return `Thank you for reaching out. I can help with our services, process, locations, or the AI Studio. For anything specific, the contact page connects you directly with our team, or email ${siteConfig.email}.`;
}
