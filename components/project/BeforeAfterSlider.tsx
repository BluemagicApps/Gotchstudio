"use client";

import { useRef, useState, useCallback } from "react";
import { SmartImage } from "@/components/shared/SmartImage";
import type { ProjectImage } from "@/data/projects";
import { MoveHorizontal } from "lucide-react";

/** Draggable before/after comparison slider. */
export function BeforeAfterSlider({
  before,
  after,
}: {
  before: ProjectImage;
  after: ProjectImage;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden"
      onMouseDown={(e) => {
        dragging.current = true;
        update(e.clientX);
      }}
      onMouseMove={(e) => dragging.current && update(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => update(e.touches[0].clientX)}
      onTouchMove={(e) => update(e.touches[0].clientX)}
    >
      {/* After (full) */}
      <SmartImage
        src={after.url}
        alt={after.alt}
        fill
        sizes="100vw"
        className="object-cover"
        wrapperClassName="absolute inset-0 h-full w-full"
      />
      {/* Before (clipped) */}
      <div
        className="absolute inset-0 h-full overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <SmartImage
          src={before.url}
          alt={before.alt}
          fill
          sizes="100vw"
          className="object-cover"
          wrapperClassName="h-full w-[100vw] max-w-none"
        />
        <span className="absolute left-4 top-4 rounded-full bg-charcoal/70 px-3 py-1 text-xs uppercase tracking-wide text-ivory">
          Before
        </span>
      </div>
      <span className="absolute right-4 top-4 rounded-full bg-charcoal/70 px-3 py-1 text-xs uppercase tracking-wide text-ivory">
        After
      </span>

      {/* Handle */}
      <div
        className="absolute inset-y-0 flex w-px items-center justify-center bg-ivory"
        style={{ left: `${pos}%` }}
      >
        <span className="flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-ivory text-charcoal shadow-lg">
          <MoveHorizontal className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}
