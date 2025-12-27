# PromptForge OVIC/VPDSF Compliance Documentation

**Version:** 0.1.0
**Date:** 2025-12-22
**Framework:** OVIC + VPDSF (Victorian Government)

## Executive Summary

PromptForge is designed for Victorian Government deployment with mandatory OVIC/VPDSF compliance. All data is de-identified, never stored, and operates locally only.

## Compliance Regime

### Primary Frameworks

1. **OVIC** (Office of the Victorian Information Commissioner)
   - Information Privacy Principles
   - De-identification requirements
   - Data minimization

2. **VPDSF** (Victorian Protective Data Security Framework)
   - Protective marking handling
   - Security controls
   - Audit requirements

## De-Identification Engine

### Scope

PromptForge automatically de-identifies 25+ categories of Australian PII:

#### Personal Identifiers
- Full names (John Smith → [PERSON])
- Email addresses (john@example.com → [EMAIL])
- Phone numbers (0412 345 678 → [PHONE])
- Mobile numbers (0412 345 678 → [MOBILE])

#### Government Identifiers
- Tax File Numbers (123 456 789 → [TFN])
- Medicare numbers (1234 56789 1 → [MEDICARE])
- Centrelink Reference Numbers (123 456 789A → [CRN])
- Driver's licenses (DL1234567 → [LICENSE])
- Passport numbers (N1234567 → [PASSPORT])

#### Financial Identifiers
- ABN/ACN (51 824 753 556 → [ABN])
- Bank account numbers (BSB + account → [BANK_ACCOUNT])
- Credit card numbers (4111 1111 1111 1111 → [PAYMENT_CARD])

#### Location Data
- Street addresses (123 Main Street Melbourne → [ADDRESS])
- Postcodes (3000 → [POSTCODE])

#### Technical Identifiers
- IPv4 addresses (192.168.1.1 → [IP_ADDRESS])
- IPv6 addresses (2001:db8::1 → [IP_ADDRESS])
- URLs (https://example.com → [URL])
- Vehicle Identification Numbers (17-char VINs → [VIN])

#### Temporal Data
- Dates in multiple formats (01/01/2024 → [DATE])

### De-Identification Guarantees

1. **Deterministic:** Same input always produces same output
2. **Stateless:** No session data, no history
3. **Comprehensive:** 25+ pattern categories
4. **Order-optimized:** Prevents false positives
5. **ReDoS-protected:** Limited regex repetition

### False Positive Handling

Conservative approach: Over-redaction is preferred to under-redaction.

Example: "51 824 753 556" without "ABN:" prefix → Redacted as [TFN] or [ABN]

## Memory Prohibition

### Inference Language Detection

PromptForge detects and warns about prohibited memory language:

**Prohibited terms:**
- "remember", "recall", "store", "save"
- "keep track", "for future", "next time"
- "previously", "summarize", "retain"

**Action:** Warnings displayed; prompts include explicit "do not retain" instructions

### Storage Verification

No data storage mechanisms:
- ✓ No localStorage
- ✓ No sessionStorage
- ✓ No IndexedDB
- ✓ No cookies
- ✓ No service workers
- ✓ No file persistence (CLI exits immediately)

## Prompt Security

### Compliance Headers

Every generated prompt includes:

```
# Compliance Notice

The following content is de-identified and synthetic.

**Mandatory constraints:**
- Do NOT infer identities or personal information
- Do NOT request additional personal data
- Do NOT retain, store, or summarize this information
- Do NOT reference this interaction in future responses

**Compliance mode:** OVIC / VPDSF (Victorian Government)
```

### Tier-Specific Behavior

**Government Tier (default):**
- Conservative, formal language
- No speculation or probabilistic statements
- Audit-safe, evidence-based outputs
- Risk management prioritized

**Enterprise Tier:**
- Structured, risk-aware analysis
- Scalability considerations

**Business Tier:**
- Clear, actionable output

## Interface Compliance

### CLI (Command Line)

**Security features:**
- No configuration files
- No command history
- Exits immediately after output
- Clipboard copy explicit user action

**Usage:**
```bash
promptforge -i "task" -p claude-code -t government
```

### Web UI (Local Only)

**Security features:**
- No external CDNs, fonts, or scripts
- No localStorage/cookies/IndexedDB
- XSS protection via HTML escaping
- Autocomplete disabled
- Before-unload warning if data present
- Runs on 127.0.0.1 only

**Verification:**
- Runtime compliance checks
- Network isolation verification
- Generates compliance reports

### Desktop (Electron)

**Security features:**
- Sandboxed renderer process
- No external navigation
- No new window creation
- No remote module
- Hardware acceleration disabled
- No webview tags

**Deployment:**
- Signed Electron package
- Local-only operation
- No auto-updates

## Audit Trail

### Evidence of Compliance

1. **Source Code:** All de-identification rules visible in `core/engine/compliance_guard.ts`
2. **Test Results:** CLI test shows comprehensive de-identification
3. **Build Artifacts:** Strict TypeScript compilation, zero warnings
4. **Runtime Checks:** Web UI verification module (apps/web/src/verification.ts)

### Procurement Documentation

**Assurance statements:**
- ✓ No cloud dependencies
- ✓ No telemetry or analytics
- ✓ No external network calls
- ✓ No data retention mechanisms
- ✓ Local-only operation guaranteed

## Security Architecture

### Threat Model

**In-scope threats:**
- Accidental PII exposure
- Unintentional data storage
- Prompt injection attacks
- External data exfiltration

**Mitigations:**
- Deterministic de-identification
- Explicit storage prohibition
- Compliance headers in prompts
- Network isolation

**Out-of-scope:**
- Physical security of deployment environment
- User authentication (no multi-user support)
- Encryption at rest (no storage)

### Attack Surface

**Minimal attack surface:**
- No database
- No authentication system
- No API endpoints
- No user accounts
- No session management

## Deployment Guidelines

### Recommended Environment

- Victorian Government restricted network
- Air-gapped or isolated segment
- No internet access required
- Local workstation deployment

### Installation

```bash
# CLI
cd apps/local-cli
npm install
npm run build

# Web UI
cd apps/web
npm install
npm start

# Desktop
cd apps/desktop
npm install
npm start
```

### Operational Security

**Best practices:**
1. Deploy in isolated network segment
2. Disable clipboard history on host
3. Clear terminal history after use
4. Use desktop app for maximum isolation
5. Verify compliance report before deployment

## Testing & Validation

### De-Identification Testing

Test input:
```
Contact John Smith at john.smith@example.com or 0412 345 678.
His TFN is 123 456 789 and Medicare number is 1234 56789 1.
Lives at 123 Main Street Melbourne 3000.
ABN: 51 824 753 556.
```

Expected output:
```
[PERSON] at [EMAIL] or [PHONE].
His TFN is [TFN] and Medicare number is [MEDICARE].
Lives at [ADDRESS] [POSTCODE].
ABN: [ABN].
```

Result: ✅ PASS

### Storage Testing

1. Check localStorage: Empty ✓
2. Check sessionStorage: Empty ✓
3. Check cookies: None ✓
4. Check IndexedDB: Not used ✓
5. Check service workers: None ✓

Result: ✅ PASS

## Compliance Verification

### Runtime Verification (Web UI)

Access verification module:
```typescript
import { verifyRuntimeCompliance, generateComplianceReport } from './verification';

const result = verifyRuntimeCompliance();
console.log(generateComplianceReport());
```

### Manual Verification

**Checklist:**
- [ ] Run CLI test with PII input
- [ ] Verify all PII redacted
- [ ] Check no files created
- [ ] Verify no network calls (browser DevTools)
- [ ] Confirm localStorage empty
- [ ] Test before-unload warning
- [ ] Verify compliance headers in output

## Maintenance & Updates

### Security Updates

**Policy:** Only critical security updates applied

**Process:**
1. Review change impact
2. Test de-identification unchanged
3. Verify no new storage mechanisms
4. Update this document
5. Re-certify compliance

### Adding De-Identification Rules

**Procedure:**
1. Add pattern to `core/engine/compliance_guard.ts`
2. Place in correct order (specific before generic)
3. Limit regex repetition (ReDoS prevention)
4. Test with real data
5. Update this document
6. Re-run compliance checks

## Limitations

### Known Limitations

1. **Context-free:** Cannot detect PII requiring context
2. **Format-dependent:** Requires recognizable patterns
3. **English-only:** Pattern matching optimized for English text
4. **Conservative:** May over-redact to ensure safety

### Not De-Identified

**Semantic PII:**
- "The CEO" (role without name)
- "My colleague" (relationship without identity)
- Coded references requiring domain knowledge

**Action:** User responsible for avoiding semantic PII

## Contact & Support

**Internal support:** Deployment team
**Security concerns:** Information Security
**Compliance questions:** Privacy Officer

## Appendix A: Regulatory References

- OVIC Information Privacy Principles
- VPDSF Protective Marking Guidelines
- Victorian Government Data Security Standards

## Appendix B: Pattern Definitions

See `core/engine/compliance_guard.ts` for complete regex patterns.

## Appendix C: Change Log

**v0.1.0 (2025-12-22):**
- Initial OVIC/VPDSF implementation
- 25+ de-identification patterns
- CLI, Web, Desktop interfaces
- Memory prohibition enforcement
- Compliance verification module
