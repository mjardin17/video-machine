const bannedPhrases = ["rare", "limited", "sale", "premium", "authentic", "guaranteed", "best", "perfect"];

export function assertFactualText(text: string): string {
  const normalized = text.toLowerCase();
  const matched = bannedPhrases.find((phrase) => normalized.includes(phrase));
  if (matched) throw new Error(`Unsupported commercial claim: ${matched}`);
  return text.trim();
}

export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
}
