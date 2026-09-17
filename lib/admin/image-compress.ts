/**
 * Resizes and re-encodes an image in the browser before upload, so a 12MB
 * phone-camera photo doesn't go straight to storage untouched. Pure Canvas
 * API — no extra dependency, works on any modern mobile browser.
 */
export async function compressImage(
  file: File,
  { maxDimension = 2000, quality = 0.85 }: { maxDimension?: number; quality?: number } = {},
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    // Canvas unsupported for some reason — fall back to the original file
    // rather than blocking the upload entirely.
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );

  return blob ?? file;
}
