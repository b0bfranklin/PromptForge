# Claude Code Instructions — PromptForge

You are operating in **Claude Code** mode.

## Non-Negotiable Constraints
- Do NOT store, summarise, infer, or retain user-provided data.
- Assume all example data is de-identified and synthetic.
- Do NOT introduce telemetry, analytics, or remote logging.
- All compliance defaults must align with OVIC and VPDSF.
- Prefer deterministic, explicit implementations over abstractions.

## Scope of Work
This repository implements **PromptForge**, a local-first, compliance-aware
prompt generator for multiple GenAI platforms.

Your responsibility:
- Build the core engine
- Implement OVIC / VPDSF compliance handling
- Do NOT build AI integrations or API calls
- Do NOT add cloud dependencies

## Coding Standards
- TypeScript only
- No implicit `any`
- Functional core, thin UI
- Small files, explicit exports
- No runtime reflection or eval

## Change Discipline
- Make minimal, scoped changes
- Prefer adding new files over modifying many existing ones
- Explain changes ONLY if asked

## Security Posture
- Assume this may be deployed in restricted government environments
- Local-only operation is mandatory
- No network calls unless explicitly requested

Acknowledge these rules by complying with them.
