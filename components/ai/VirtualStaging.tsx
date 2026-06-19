"use client";

import { useTranslations } from "next-intl";
import { ImageStudioTool } from "./ImageStudioTool";

/**
 * AI Virtual Staging — furnish an uploaded empty room in a signature aesthetic.
 * Thin wrapper over the shared ImageStudioTool, pointed at /api/stage.
 */
export function VirtualStaging() {
  const t = useTranslations("ai.staging");
  return (
    <ImageStudioTool
      endpoint="/api/stage"
      namespace="ai.staging"
      beforeLabel={t("before")}
      afterLabel={t("after")}
    />
  );
}
