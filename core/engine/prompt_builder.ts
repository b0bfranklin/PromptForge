import { applyCompliance } from "./compliance_guard";
import { adaptForPlatform } from "./platform_adapter";
import { resolveTier } from "./tier_resolver";

export interface PromptRequest {
  rawInput: string;
  platform: "claude" | "claude-code";
  tier: "government" | "enterprise" | "business";
  complianceMode: "OVIC_VPDSF";
}

export function buildPrompt(req: PromptRequest): string {
  const compliantInput = applyCompliance(req.rawInput, req.complianceMode);
  const tierContext = resolveTier(req.tier);
  return adaptForPlatform(
    compliantInput,
    req.platform,
    tierContext,
    req.complianceMode
  );
}
