/**
 * Client-side image preprocessing. Downscales a user-selected photo to a sane
 * maximum dimension and re-encodes as JPEG before it's sent to the AI routes —
 * this keeps request payloads small and image-model cost/latency down without
 * the user noticing any quality loss for redesign purposes.
 */
export async function fileToDownscaledDataUrl(
  file: File,
  maxDim = 1280,
  quality = 0.82,
): Promise<string> {
  // Prefer createImageBitmap (fast, off-main-thread decode) with a graceful
  // fallback to an <img> + object URL for older browsers.
  const bitmap = await loadBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap as CanvasImageSource, 0, 0, w, h);
  if ("close" in bitmap && typeof bitmap.close === "function") bitmap.close();

  return canvas.toDataURL("image/jpeg", quality);
}

async function loadBitmap(
  file: File,
): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      /* fall through */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Could not read image"));
      img.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}
