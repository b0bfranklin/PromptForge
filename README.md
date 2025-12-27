# PromptForge

PromptForge is a **local-first, OVIC/VPDSF-compliant prompt generator**
designed to maximise output quality across GenAI platforms
without exposing regulated data.

## What This Is
- A prompt compiler
- A compliance enforcement engine
- A platform-aware instruction generator

## What This Is NOT
- Not a chatbot
- Not an AI wrapper
- Not a SaaS product
- Not cloud-dependent

## Compliance Focus
- OVIC (Victorian Information Privacy)
- VPDSF (Victorian Protective Data Security Framework)

All data is:
- De-identified automatically
- Never stored or retained
- Local execution only

## Supported Platforms
- Claude (conversational)
- Claude Code (development-focused)

## Usage

### CLI (Command Line)

```bash
cd apps/local-cli
npm install
npm run build

# Interactive mode
node dist/apps/local-cli/src/index.js

# Direct mode
node dist/apps/local-cli/src/index.js -i "Review contract" -p claude-code -t government

# Help
node dist/apps/local-cli/src/index.js --help
```

### Web UI (Local Browser)

```bash
cd apps/web
npm install
npm start
```

Visit: http://127.0.0.1:3000

## De-identification

Automatic scrubbing of:
- Personal names, emails, phone numbers
- Australian identifiers (ABN, Medicare, postcodes)
- Addresses, dates, IP addresses
- Payment card numbers, generic identifiers

## Defaults
- **Platform:** claude-code
- **Tier:** government
- **Compliance:** OVIC_VPDSF (non-disableable)

## Architecture

```
core/engine/          # Compliance & prompt generation
apps/local-cli/       # Command-line interface
apps/web/             # Local web interface
```

## Technical
- TypeScript (strict mode)
- ES2022 modules
- No runtime dependencies (core)
- Stateless, pure functions
