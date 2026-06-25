import { randomBytes } from "crypto";

/**
 * Generate an ID consisting of a given 2‑char prefix + N random chars.
 * @param prefix Two‑character document code, e.g. "QT"
 * @param totalLength Total length of the ID, e.g. 14
 */
export function randomStringGenerator(
  prefix: string = "",
  totalLength = 12
): string {
  const randomLen = totalLength - prefix.length;
  const bytes = Math.ceil(randomLen / 2);
  const rand = randomBytes(bytes).toString("hex").slice(0, randomLen);
  return (prefix + rand).toUpperCase();
}
