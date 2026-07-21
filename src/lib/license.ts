import { randomBytes } from "crypto";

// Generates a key like KYRON-AB3F-9XZQ-P2KD
// Avoids ambiguous chars (0/O, 1/I/L) to reduce support tickets from
// users misreading their own key.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function randomSegment(length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export function generateLicenseKey(): string {
  return `KYRON-${randomSegment(4)}-${randomSegment(4)}-${randomSegment(4)}`;
}
