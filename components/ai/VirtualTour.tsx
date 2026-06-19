"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { useTranslations } from "next-intl";
import {
  Play,
  Pause,
  Maximize2,
  AlertCircle,
  Compass,
  Loader2,
} from "lucide-react";
import { tourScenes, tourCategories } from "@/data/tours";
import { cn } from "@/lib/utils";

/**
 * 360° Virtual Walkthrough.
 *
 * Renders an equirectangular panorama on an inverted sphere viewed from its
 * center, with drag-to-look, wheel/pinch zoom, autorotate, fullscreen, and
 * scene switching. Uses vanilla Three.js with a manual camera-rotation control
 * (the canonical, most robust technique for panoramas) and a WebGL renderer for
 * maximum browser compatibility. Three.js is dynamically imported inside the
 * mount effect so it never runs during SSR and only ships when this tool opens.
 */

const SPHERE_RADIUS = 500;

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

interface Engine {
  THREE: typeof THREE;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  material: THREE.MeshBasicMaterial;
  loader: THREE.TextureLoader;
  /** Active <video> element when the current scene is a 360° video. */
  video: HTMLVideoElement | null;
  raf: number;
  // view state
  lon: number;
  lat: number;
  fov: number;
  autoRotate: boolean;
  dragging: boolean;
  downX: number;
  downY: number;
  downLon: number;
  downLat: number;
}

export function VirtualTour() {
  const t = useTranslations("ai.tour");
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);

  const [supported, setSupported] = useState(true);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // ── Mount: build the scene, attach handlers, run the render loop ──────────
  useEffect(() => {
    if (!webglAvailable()) {
      setSupported(false);
      return;
    }
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let cleanup = () => {};

    // Respect reduced-motion: don't autorotate by default.
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) setAutoRotate(false);

    (async () => {
      const THREE_NS = await import("three");
      if (disposed) return;

      const width = container.clientWidth || 800;
      const height = container.clientHeight || 450;

      const scene = new THREE_NS.Scene();
      const camera = new THREE_NS.PerspectiveCamera(75, width / height, 1, 1100);

      const geometry = new THREE_NS.SphereGeometry(SPHERE_RADIUS, 60, 40);
      // Flip the sphere inside-out so the texture faces the centered camera.
      geometry.scale(-1, 1, 1);
      const material = new THREE_NS.MeshBasicMaterial();
      const mesh = new THREE_NS.Mesh(geometry, material);
      scene.add(mesh);

      const renderer = new THREE_NS.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);
      renderer.domElement.style.touchAction = "none";
      renderer.domElement.style.cursor = "grab";

      const engine: Engine = {
        THREE: THREE_NS,
        renderer,
        scene,
        camera,
        material,
        loader: new THREE_NS.TextureLoader(),
        video: null,
        raf: 0,
        lon: 0,
        lat: 0,
        fov: 75,
        autoRotate: !prefersReduced,
        dragging: false,
        downX: 0,
        downY: 0,
        downLon: 0,
        downLat: 0,
      };
      engineRef.current = engine;

      // ── Pointer look controls ──────────────────────────────────────────
      const el = renderer.domElement;
      const onDown = (e: PointerEvent) => {
        engine.dragging = true;
        engine.downX = e.clientX;
        engine.downY = e.clientY;
        engine.downLon = engine.lon;
        engine.downLat = engine.lat;
        el.style.cursor = "grabbing";
        el.setPointerCapture?.(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!engine.dragging) return;
        engine.lon = (engine.downX - e.clientX) * 0.1 + engine.downLon;
        engine.lat = (e.clientY - engine.downY) * 0.1 + engine.downLat;
      };
      const onUp = (e: PointerEvent) => {
        engine.dragging = false;
        el.style.cursor = "grab";
        el.releasePointerCapture?.(e.pointerId);
      };
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        engine.fov = Math.max(35, Math.min(90, engine.fov + e.deltaY * 0.05));
        camera.fov = engine.fov;
        camera.updateProjectionMatrix();
      };
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
      el.addEventListener("pointerleave", onUp);
      el.addEventListener("wheel", onWheel, { passive: false });

      // ── Resize ─────────────────────────────────────────────────────────
      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      const ro = new ResizeObserver(resize);
      ro.observe(container);
      document.addEventListener("fullscreenchange", resize);

      // ── Render loop ──────────────────────────────────────────────────────
      const target = new THREE_NS.Vector3();
      const animate = () => {
        engine.raf = requestAnimationFrame(animate);
        if (engine.autoRotate && !engine.dragging) engine.lon += 0.04;
        engine.lat = Math.max(-85, Math.min(85, engine.lat));
        const phi = THREE_NS.MathUtils.degToRad(90 - engine.lat);
        const theta = THREE_NS.MathUtils.degToRad(engine.lon);
        target.set(
          SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta),
          SPHERE_RADIUS * Math.cos(phi),
          SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta),
        );
        camera.lookAt(target);
        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(engine.raf);
        ro.disconnect();
        document.removeEventListener("fullscreenchange", resize);
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
        el.removeEventListener("pointerleave", onUp);
        el.removeEventListener("wheel", onWheel);
        if (engine.video) {
          engine.video.pause();
          engine.video.removeAttribute("src");
          engine.video.load();
          engine.video = null;
        }
        material.map?.dispose();
        material.dispose();
        geometry.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        if (el.parentNode) el.parentNode.removeChild(el);
        engineRef.current = null;
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  // ── Load the panorama whenever the active scene changes ───────────────────
  useEffect(() => {
    let cancelled = false;
    setError(false);
    setLoading(true);

    // The engine may still be initializing on first mount; poll briefly.
    let tries = 0;
    const tryLoad = () => {
      const engine = engineRef.current;
      if (cancelled) return;
      if (!engine) {
        if (tries++ < 50) setTimeout(tryLoad, 60);
        return;
      }

      const scene = tourScenes[active];

      // Stop any video from a previous scene before swapping.
      const stopVideo = () => {
        if (engine.video) {
          engine.video.pause();
          engine.video.removeAttribute("src");
          engine.video.load();
          engine.video = null;
        }
      };

      const swapMap = (texture: THREE.Texture) => {
        texture.colorSpace = engine.THREE.SRGBColorSpace;
        const old = engine.material.map;
        engine.material.map = texture;
        engine.material.needsUpdate = true;
        if (old) old.dispose();
      };

      if (scene.video) {
        // 360° video scene: equirectangular video on the sphere.
        stopVideo();
        const video = document.createElement("video");
        video.src = scene.video;
        video.crossOrigin = "anonymous";
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        const onReady = () => {
          if (cancelled) return;
          swapMap(new engine.THREE.VideoTexture(video));
          engine.video = video;
          video.play().catch(() => {});
          setLoading(false);
        };
        video.addEventListener("loadeddata", onReady, { once: true });
        video.addEventListener(
          "error",
          () => {
            if (!cancelled) {
              setError(true);
              setLoading(false);
            }
          },
          { once: true },
        );
        video.load();
      } else {
        // Still equirectangular image scene.
        engine.loader.load(
          scene.src,
          (texture) => {
            if (cancelled) {
              texture.dispose();
              return;
            }
            stopVideo();
            swapMap(texture);
            setLoading(false);
          },
          undefined,
          () => {
            if (!cancelled) {
              setError(true);
              setLoading(false);
            }
          },
        );
      }
    };
    tryLoad();

    return () => {
      cancelled = true;
    };
  }, [active]);

  // Keep the engine's autorotate flag in sync with UI state.
  useEffect(() => {
    if (engineRef.current) engineRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  function goFullscreen() {
    containerRef.current?.requestFullscreen?.();
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 sm:p-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-light">{t("title")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("intro")}</p>
        </div>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs text-accent sm:inline-flex">
          <Compass className="h-3.5 w-3.5" /> 360°
        </span>
      </div>

      {!supported ? (
        <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-4 rounded-md bg-muted text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground" strokeWidth={1.25} />
          <p className="max-w-sm text-sm text-muted-foreground">{t("unsupported")}</p>
        </div>
      ) : (
        <>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-charcoal">
            <div ref={containerRef} className="absolute inset-0 h-full w-full" />

            {/* Loading / error overlays */}
            {loading && !error && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-charcoal/40">
                <Loader2 className="h-8 w-8 animate-spin text-ivory/80" />
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-charcoal/60 text-center text-ivory">
                <AlertCircle className="h-7 w-7" strokeWidth={1.25} />
                <p className="text-sm">{t("error")}</p>
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                type="button"
                onClick={() => setAutoRotate((a) => !a)}
                aria-label={autoRotate ? t("pause") : t("play")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-charcoal/70 text-ivory backdrop-blur transition-colors hover:bg-charcoal"
              >
                {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={goFullscreen}
                aria-label={t("fullscreen")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-charcoal/70 text-ivory backdrop-blur transition-colors hover:bg-charcoal"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>

            {/* Drag hint + attribution */}
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-charcoal/60 px-3 py-1 text-[11px] uppercase tracking-wide text-ivory/90 backdrop-blur">
              {t("dragHint")}
            </span>
            <span className="pointer-events-none absolute bottom-3 left-3 rounded bg-charcoal/55 px-2 py-1 text-[10px] text-ivory/70 backdrop-blur">
              {tourScenes[active].credit}
            </span>
          </div>

          {/* Scene switcher, grouped by space type */}
          <div className="mt-6 space-y-4">
            {tourCategories.map((cat) => {
              const scenes = tourScenes
                .map((s, i) => ({ s, i }))
                .filter(({ s }) => s.category === cat);
              if (scenes.length === 0) return null;
              return (
                <div key={cat}>
                  <p className="eyebrow mb-2">{cat}</p>
                  <div className="flex flex-wrap gap-2">
                    {scenes.map(({ s, i }) => (
                      <button
                        key={s.id}
                        onClick={() => setActive(i)}
                        className={cn(
                          "rounded-full border px-4 py-1.5 text-sm transition-colors",
                          i === active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
                        )}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-5 text-xs text-muted-foreground">{t("note")}</p>
        </>
      )}
    </div>
  );
}
