/**
 * OVIC/VPDSF Compliance Guard
 *
 * Applies de-identification transformations according to:
 * - Office of the Victorian Information Commissioner (OVIC)
 * - Victorian Protective Data Security Framework (VPDSF)
 *
 * This is a deterministic, stateless transformation.
 * No data is stored, inferred, or retained.
 */

export type ComplianceMode = "OVIC_VPDSF";

interface DeIdentificationRule {
  readonly pattern: RegExp;
  readonly replacement: string;
  readonly description: string;
}

const OVIC_VPDSF_RULES: readonly DeIdentificationRule[] = [
  // Email addresses (before names to avoid partial matches)
  {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    replacement: "[EMAIL]",
    description: "Email addresses"
  },

  // Australian phone numbers
  {
    pattern: /\b(?:\+?61|0)[2-478](?:[ -]?\d){8}\b/g,
    replacement: "[PHONE]",
    description: "Australian phone numbers"
  },

  // Australian mobile numbers (specific pattern)
  {
    pattern: /\b(?:\+?61|0)4\d{2}[\s-]?\d{3}[\s-]?\d{3}\b/g,
    replacement: "[MOBILE]",
    description: "Australian mobile numbers"
  },

  // Tax File Numbers (TFN) - with or without prefix
  {
    pattern: /\b(?:TFN[:\s]?)?\d{3}[\s-]\d{3}[\s-]\d{3}\b/gi,
    replacement: "[TFN]",
    description: "Tax File Numbers"
  },

  // Driver's License (VIC format)
  {
    pattern: /\b(?:DL|License|Licence)[:\s#]?\d{1,10}\b/gi,
    replacement: "[LICENSE]",
    description: "Driver's license numbers"
  },

  // Australian Passport (letter followed by 7 digits)
  {
    pattern: /\b[A-Z]\d{7}\b/g,
    replacement: "[PASSPORT]",
    description: "Australian passport numbers"
  },

  // Bank account numbers (BSB + Account)
  {
    pattern: /\b\d{3}[\s-]?\d{3}[\s-]\d{6,10}\b/g,
    replacement: "[BANK_ACCOUNT]",
    description: "Bank account numbers with BSB"
  },

  // Victorian addresses (before dates and names to avoid conflicts)
  {
    pattern: /\b\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,5}\s+(?:Street|St|Road|Rd|Avenue|Ave|Drive|Dr|Court|Ct|Place|Pl|Lane|Ln|Boulevard|Blvd|Highway|Hwy|Parade|Pde)(?:\s+[A-Z][a-z]+)?\b/gi,
    replacement: "[ADDRESS]",
    description: "Street addresses"
  },

  // Dates (multiple formats)
  {
    pattern: /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g,
    replacement: "[DATE]",
    description: "Date formats (dd/mm/yyyy, dd-mm-yyyy)"
  },
  {
    pattern: /\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/g,
    replacement: "[DATE]",
    description: "ISO date formats (yyyy-mm-dd)"
  },

  // Australian postcodes (VIC range)
  {
    pattern: /\b(?:3\d{3}|8\d{3})\b/g,
    replacement: "[POSTCODE]",
    description: "Australian postcodes"
  },

  // Medicare numbers (10 digits with optional position)
  {
    pattern: /\b\d{4}\s?\d{5}\s?\d(?:\s?\/\s?\d)?\b/g,
    replacement: "[MEDICARE]",
    description: "Medicare numbers"
  },

  // Centrelink Reference Numbers (CRN)
  {
    pattern: /\b\d{3}\s?\d{3}\s?\d{3}[A-Z]\b/g,
    replacement: "[CRN]",
    description: "Centrelink Reference Numbers"
  },

  // ABN/ACN (with or without prefix)
  {
    pattern: /\b(?:ABN|ACN)[:\s]?\d{2}\s?\d{3}\s?\d{3}\s?\d{3}\b/gi,
    replacement: "[ABN]",
    description: "Australian Business Numbers (with prefix)"
  },
  {
    pattern: /\b\d{2}\s\d{3}\s\d{3}\s\d{3}\b/g,
    replacement: "[ABN]",
    description: "Australian Business Numbers (without prefix)"
  },

  // VIN (Vehicle Identification Number) - before generic identifiers
  {
    pattern: /\b[A-HJ-NPR-Z0-9]{17}\b/g,
    replacement: "[VIN]",
    description: "Vehicle Identification Numbers"
  },

  // Generic identifiers (6+ digits) - placed after specific patterns
  {
    pattern: /\b\d{6,}\b/g,
    replacement: "[IDENTIFIER]",
    description: "Numeric identifiers"
  },

  // IP addresses (IPv4)
  {
    pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    replacement: "[IP_ADDRESS]",
    description: "IPv4 addresses"
  },

  // IPv6 addresses
  {
    pattern: /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g,
    replacement: "[IP_ADDRESS]",
    description: "IPv6 addresses"
  },

  // Credit card numbers (basic pattern)
  {
    pattern: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g,
    replacement: "[PAYMENT_CARD]",
    description: "Payment card numbers"
  },

  // URLs (http/https)
  {
    pattern: /\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?\b/g,
    replacement: "[URL]",
    description: "Web URLs"
  },

  // Personal names (last to avoid conflicts with addresses)
  {
    pattern: /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}\b/g,
    replacement: "[PERSON]",
    description: "Full names"
  }
];

/**
 * Apply OVIC/VPDSF de-identification to input text.
 *
 * @param input - Raw text that may contain identifiable information
 * @param mode - Compliance mode (only OVIC_VPDSF supported)
 * @returns De-identified text with abstract placeholders
 */
export function applyCompliance(
  input: string,
  mode: ComplianceMode
): string {
  if (mode !== "OVIC_VPDSF") {
    return input;
  }

  let processed = input;

  for (const rule of OVIC_VPDSF_RULES) {
    processed = processed.replace(rule.pattern, rule.replacement);
  }

  return processed;
}

/**
 * Validate that input does not contain prohibited memory or inference language.
 *
 * @param input - Text to validate
 * @returns Array of validation warnings (empty if compliant)
 */
export function validateNoInference(input: string): readonly string[] {
  const warnings: string[] = [];

  const prohibitedPhrases = [
    /\bremember\b/gi,
    /\brecall\b/gi,
    /\bstore\b/gi,
    /\bsave\b/gi,
    /\bkeep track\b/gi,
    /\bfor future\b/gi,
    /\bnext time\b/gi,
    /\bpreviously\b/gi,
    /\bsummar[iy]ze?\b/gi,
    /\bretain\b/gi
  ];

  for (const pattern of prohibitedPhrases) {
    if (pattern.test(input)) {
      warnings.push(`Input contains prohibited inference language: ${pattern.source}`);
    }
  }

  return warnings;
}
