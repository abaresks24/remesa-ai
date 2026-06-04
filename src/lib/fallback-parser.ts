import type { Intent } from "./types";

// Deterministic regex parser used when the AI provider is unavailable.
// Decent for demos with typical phrasings; the AI agent is the real path.

const RELATIVES_RE =
  /\bmi\s+(mam[áa]|pap[áa]|hermano|hermana|hijo|hija|abuel[oa]|t[ií]o|t[ií]a|primo|prima|esposa|esposo|novia|novio)(?=\s|$|[^\p{L}])/iu;

const CITY_RE =
  /\b(?:en|in)\s+(CDMX|Ciudad de México|Puebla|Guadalajara|Monterrey|Tijuana|Mérida|Cancún|Oaxaca|León|Toluca|Querétaro|Aguascalientes|Chihuahua|Veracruz|Acapulco|Morelia)\b/iu;

const NAME_AFTER_PREP_RE =
  /\b(?:a|para|pa['’]?|to)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?)\b/u;

function stripDiacritics(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function fallbackParse(raw: string): Intent {
  const text = raw.toLowerCase();
  const missing: string[] = [];

  const amountMatch =
    text.match(/(\d+(?:[.,]\d+)?)\s*(?:dólar|dolar|dolares|usd|bucks|\$)/i) ||
    text.match(/(\d+(?:[.,]\d+)?)/);
  const amountUsd = amountMatch ? Number(amountMatch[1].replace(",", ".")) : 0;
  if (!amountUsd) missing.push("amount");

  let recipientName = "";
  const relMatch = text.match(RELATIVES_RE);
  if (relMatch) {
    const word = stripDiacritics(relMatch[1]);
    recipientName = "Mi " + word.charAt(0).toUpperCase() + word.slice(1);
  } else {
    const nameMatch = raw.match(NAME_AFTER_PREP_RE);
    if (nameMatch) recipientName = nameMatch[1].trim();
  }
  if (!recipientName) missing.push("recipient");

  const cityMatch = raw.match(CITY_RE);
  const recipientCity = cityMatch ? cityMatch[1] : undefined;
  if (!recipientCity) missing.push("city");

  let confidence: Intent["confidence"] = "low";
  if (amountUsd && recipientName) confidence = recipientCity ? "high" : "medium";

  return {
    amountUsd,
    recipientName: recipientName || "—",
    recipientCity,
    recipientCountry: "MX",
    confidence,
    missing: missing.length ? missing : undefined,
    raw,
  };
}
