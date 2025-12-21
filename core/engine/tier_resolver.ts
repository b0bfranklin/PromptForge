export function resolveTier(tier: string): string {
  switch (tier) {
    case "government":
      return `
You are operating in a Victorian Government context.
Use conservative language.
Avoid speculation.
Produce audit-safe outputs.
`;
    case "enterprise":
      return `
Provide structured, risk-aware analysis.
`;
    default:
      return `
Provide clear, actionable output.
`;
  }
}
