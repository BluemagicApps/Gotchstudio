"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RoomVisualizer } from "./RoomVisualizer";
import { VirtualStaging } from "./VirtualStaging";
import { VirtualTour } from "./VirtualTour";
import { StyleQuiz } from "./StyleQuiz";
import { ConciergePanel } from "./ConciergePanel";

const VALUES = ["visualizer", "staging", "tour", "quiz", "concierge"] as const;
type TabValue = (typeof VALUES)[number];

/**
 * AI Studio tabs with URL-hash deep-linking, so the header's "AI Studio" hover
 * dropdown (e.g. /ai-studio#concierge) opens the matching tool. The active tab
 * syncs both ways: hash → tab on load and hashchange, tab → hash on click.
 */
export function StudioTabs() {
  const t = useTranslations("ai");
  const [value, setValue] = useState<TabValue>("visualizer");

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace("#", "");
      if ((VALUES as readonly string[]).includes(h)) setValue(h as TabValue);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  function onValueChange(v: string) {
    setValue(v as TabValue);
    // Update the hash without scrolling the page.
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${v}`);
    }
  }

  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="w-full justify-start sm:justify-center">
        <TabsTrigger value="visualizer">{t("visualizer.title")}</TabsTrigger>
        <TabsTrigger value="staging">{t("staging.title")}</TabsTrigger>
        <TabsTrigger value="tour">{t("tour.title")}</TabsTrigger>
        <TabsTrigger value="quiz">{t("quiz.title")}</TabsTrigger>
        <TabsTrigger value="concierge">{t("concierge.title")}</TabsTrigger>
      </TabsList>
      <TabsContent value="visualizer">
        <RoomVisualizer />
      </TabsContent>
      <TabsContent value="staging">
        <VirtualStaging />
      </TabsContent>
      <TabsContent value="tour">
        <VirtualTour />
      </TabsContent>
      <TabsContent value="quiz">
        <StyleQuiz />
      </TabsContent>
      <TabsContent value="concierge">
        <ConciergePanel />
      </TabsContent>
    </Tabs>
  );
}
