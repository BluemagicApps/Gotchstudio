"use client";

import { useRef, useState, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";

/**
 * Draggable before/after comparison that works with arbitrary image URLs —
 * including data: URLs (the user's upload) and remote AI-output URLs. Uses plain
 * <img> elements rather than next/image so it handles both uniformly without
 * remote-pattern config or data-URL optimization caveats.
 */
export function ImageCompare({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
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
      className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden rounded-md"
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
      {/* After (full width, underneath) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="absolute right-4 top-4 z-10 rounded-full bg-charcoal/70 px-3 py-1 text-xs uppercase tracking-wide text-ivory">
        {afterLabel}
      </span>

      {/* Before — full-size layer revealed from the left via clip-path (no squish) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={before}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute left-4 top-4 rounded-full bg-charcoal/70 px-3 py-1 text-xs uppercase tracking-wide text-ivory">
          {beforeLabel}
        </span>
      </div>

      {/* Handle */}
      <div
        className="absolute inset-y-0 z-10 flex w-px items-center justify-center bg-ivory"
        style={{ left: `${pos}%` }}
      >
        <span className="flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-ivory text-charcoal shadow-lg">
          <MoveHorizontal className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}
