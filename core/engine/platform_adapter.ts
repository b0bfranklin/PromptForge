export function adaptForPlatform(
  input: string,
  platform: "claude" | "claude-code",
  tierContext: string,
  complianceMode: "OVIC_VPDSF"
): string {
  const complianceHeader = `
The following content is de-identified and synthetic.
Do NOT infer identities, request personal data, or retain information.
Compliance mode: OVIC / VPDSF.
`;

  if (platform === "claude-code") {
    return `${complianceHeader}
${tierContext}
Task:
${input}
Output only the required result.`;
  }

  return `${complianceHeader}
${tierContext}
${input}`;
}
