import { NextRequest } from "next/server";
import { handleImageGeneration } from "@/lib/ai/image-route";
import { REPLICATE_STAGE_MODEL } from "@/lib/ai/env";
import { stagePrompt } from "@/lib/ai/styles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** AI Virtual Staging — furnish an uploaded empty room in a signature style. */
export function POST(req: NextRequest) {
  return handleImageGeneration(req, {
    bucket: "stage",
    model: REPLICATE_STAGE_MODEL,
    prompts: stagePrompt,
  });
}
