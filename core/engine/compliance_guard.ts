export function applyCompliance(
  input: string,
  mode: "OVIC_VPDSF"
): string {
  if (mode !== "OVIC_VPDSF") return input;

  // Minimal example — Claude Code should expand
  return input
    .replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, "[PERSON]")
    .replace(/\b\d{2}\/\d{2}\/\d{4}\b/g, "[DATE]")
    .replace(/\b\d{6,}\b/g, "[IDENTIFIER]");
}
