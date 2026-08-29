---
name: ai-tailoring-workflow
description: >-
  Use this skill when configuring AI synthesis prompts, managing integrity safeguards,
  handling Markdown CV parsing, or working with ATS calibration and gap analysis.
---

# AI Tailoring & Synthesis Workflow

This skill guides the implementation and refinement of the AI tailoring engine, prompt engineering, integrity safeguard rules, and ATS gap scoring.

---

## Core Synthesis Architecture

1. **Prompt Template**: `prompts/system-prompt.md` and `rules.md` contain the system prompt and instructions for the Google XYZ formula and ATS formatting rules.
2. **AI Service Provider**: `src/core/ai-service.ts` handles communication with Gemini API (`@google/generative-ai`) and custom OpenAI-compatible endpoints.
3. **Markdown Parser**: `src/core/parser.ts` parses raw markdown resumes into structured `CVData` objects.
4. **Integrity Safeguard Engine**: `src/core/audit.ts` validates that the tailored CV does not invent fraudulent skills or fabricate companies not in `master-data.md`.
5. **Gap Analysis & Calibration**: `src/core/gap-analysis.ts` extracts required keywords from `target-job.md`, computes match scores (0–100), and identifies missing competencies.

---

## Workflow: Adjusting AI Prompts & Rules

1. **Prompt Updates**:
   - When modifying system synthesis instructions, edit `prompts/system-prompt.md` or `rules.md`.
   - Always enforce the Google XYZ formula: *Accomplished [X] as measured by [Y] by doing [Z]*.
2. **Integrity Safeguard Constraint**:
   - Never remove the integrity safeguard instruction: *Do not invent companies, positions, dates, or certifications not present in the master profile.*
3. **CLI Synthesis Testing**:
   - Run `npm run tailor` to test the synthesis pipeline locally via CLI.
   - Run `npm run audit` to compute the ATS match score and audit report.
4. **Web Studio Validation**:
   - Test that the tailored markdown output parses without error in `src/components/studio/StepPreview.tsx`.
