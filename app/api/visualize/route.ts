import { NextRequest } from "next/server";
import { handleImageGeneration } from "@/lib/ai/image-route";
import { REPLICATE_VISUALIZE_MODEL } from "@/lib/ai/env";
import { visualizePrompt } from "@/lib/ai/styles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** AI Room Visualizer — restyle an uploaded room photo into a signature style. */
export function POST(req: NextRequest) {
  return handleImageGeneration(req, {
    bucket: "visualize",
    model: REPLICATE_VISUALIZE_MODEL,
    prompts: visualizePrompt,
  });
}
