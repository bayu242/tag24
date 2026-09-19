const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

const LOOKUP: Record<string, number> = {};
for (let index = 0; index < ALPHABET.length; index += 1) {
  LOOKUP[ALPHABET[index]] = index;
}

/** Encode bytes as unpadded Base64URL (RFC 4648 section 5). */
export function bytesToBase64Url(bytes: Uint8Array): string {
  let output = "";
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index];
    const second = bytes[index + 1];
    const third = bytes[index + 2];

    output += ALPHABET[first >> 2];
    output += ALPHABET[((first & 0x03) << 4) | ((second ?? 0) >> 4)];
    if (second === undefined) break;

    output += ALPHABET[((second & 0x0f) << 2) | ((third ?? 0) >> 6)];
    if (third === undefined) break;

    output += ALPHABET[third & 0x3f];
  }
  return output;
}

/**
 * Decode an unpadded Base64URL string into bytes.
 * Throws an Error with message "INVALID_BASE64" when the input is not decodable.
 */
export function base64UrlToBytes(value: string): Uint8Array {
  const input = value.replace(/=+$/, "");
  if (input.length === 0) return new Uint8Array(0);

  const remainder = input.length % 4;
  if (remainder === 1) throw new Error("INVALID_BASE64");

  const bytes = new Uint8Array(Math.floor((input.length * 3) / 4));
  let offset = 0;

  for (let index = 0; index < input.length; index += 4) {
    const c0 = LOOKUP[input[index]];
    const c1 = LOOKUP[input[index + 1]];
    const c2 = LOOKUP[input[index + 2]];
    const c3 = LOOKUP[input[index + 3]];

    if (c0 === undefined || c1 === undefined) throw new Error("INVALID_BASE64");

    bytes[offset++] = (c0 << 2) | (c1 >> 4);
    if (c2 === undefined) break;
    bytes[offset++] = ((c1 & 0x0f) << 4) | (c2 >> 2);
    if (c3 === undefined) break;
    bytes[offset++] = ((c2 & 0x03) << 6) | c3;
  }

  return bytes.subarray(0, offset);
}
