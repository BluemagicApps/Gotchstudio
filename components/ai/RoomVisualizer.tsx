"use client";

import { useTranslations } from "next-intl";
import { ImageStudioTool } from "./ImageStudioTool";

/**
 * AI Room Visualizer — restyle an uploaded room into a signature aesthetic.
 * Thin wrapper over the shared ImageStudioTool, pointed at /api/visualize.
 */
export function RoomVisualizer() {
  const t = useTranslations("ai.visualizer");
  return (
    <ImageStudioTool
      endpoint="/api/visualize"
      namespace="ai.visualizer"
      beforeLabel={t("before")}
      afterLabel={t("after")}
    />
  );
}
