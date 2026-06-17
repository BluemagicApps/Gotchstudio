"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Image wrapper with a shimmer skeleton + graceful fade-in. Works with static
 * export (next.config sets images.unoptimized). Always pass meaningful `alt`.
 */
export function SmartImage({
  className,
  wrapperClassName,
  alt,
  priority,
  loading,
  ...props
}: ImageProps & { wrapperClassName?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {!loaded && <div className="absolute inset-0 skeleton" aria-hidden />}
      <Image
        alt={alt}
        priority={priority}
        // `priority` and `loading` are mutually exclusive in next/image; only
        // default to lazy when the caller hasn't marked the image as priority.
        loading={loading ?? (priority ? undefined : "lazy")}
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-opacity duration-700",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        {...props}
      />
    </div>
  );
}
