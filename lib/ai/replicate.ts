import Replicate from "replicate";

/**
 * Lazily-instantiated Replicate client. `useFileOutput: false` makes
 * `replicate.run()` resolve to plain URL strings (rather than FileOutput
 * streams), which is what we hand back to the browser to render.
 */
let client: Replicate | null = null;

function getReplicate(): Replicate {
  if (!client) {
    client = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
      useFileOutput: false,
    });
  }
  return client;
}

/** Normalize whatever `replicate.run` returns into a single image URL string. */
function firstUrl(output: unknown): string | null {
  const value = Array.isArray(output) ? output[0] : output;
  if (!value) return null;
  if (typeof value === "string") return value;
  // Defensive: handle FileOutput-like objects if useFileOutput is ever true.
  const maybe = value as { url?: unknown };
  if (typeof maybe.url === "function") return String((maybe.url as () => unknown)());
  if (typeof maybe.url === "string") return maybe.url;
  return String(value);
}

/**
 * Run an image model and return the first output URL.
 * `model` must be a full `owner/name:version` reference.
 */
export async function runImageModel(
  model: string,
  input: Record<string, unknown>,
): Promise<string> {
  const output = await getReplicate().run(model as `${string}/${string}`, {
    input,
  });
  const url = firstUrl(output);
  if (!url) throw new Error("Replicate returned no image output");
  return url;
}
