/**
 * PromptForge Desktop App
 *
 * Client-side application logic for Electron.
 * Identical to web UI but optimized for desktop.
 *
 * No persistence, no localStorage, no cookies.
 */

import { buildPrompt } from "../../../core/index.js";
import type { Platform, Tier, PromptResult } from "../../../core/types.js";

// Identical implementation to web/src/app.ts
// (Electron will load this as app.js)

function initialize(): void {
  const form = document.getElementById("promptForm") as HTMLFormElement;
  const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;
  const copyBtn = document.getElementById("copyBtn") as HTMLButtonElement;

  if (!form || !clearBtn || !copyBtn) {
    console.error("Required DOM elements not found");
    return;
  }

  form.addEventListener("submit", handleSubmit);
  clearBtn.addEventListener("click", handleClear);
  copyBtn.addEventListener("click", handleCopy);

  preventPersistence();
}

function handleSubmit(event: Event): void {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  const rawInput = formData.get("taskInput") as string;
  const platform = formData.get("platform") as Platform;
  const tier = formData.get("tier") as Tier;

  if (!rawInput || !rawInput.trim()) {
    alert("Please enter a task description");
    return;
  }

  try {
    const result = buildPrompt({
      rawInput: rawInput.trim(),
      platform,
      tier,
      complianceMode: "OVIC_VPDSF"
    });

    displayResult(result);
  } catch (error) {
    console.error("Error generating prompt:", error);
    alert("An error occurred while generating the prompt");
  }
}

function displayResult(result: PromptResult): void {
  const outputSection = document.getElementById("outputSection");
  const warningsContainer = document.getElementById("warningsContainer");
  const metadataContainer = document.getElementById("metadataContainer");
  const promptOutput = document.getElementById("promptOutput");

  if (!outputSection || !warningsContainer || !metadataContainer || !promptOutput) {
    return;
  }

  outputSection.classList.add("visible");

  if (result.warnings.length > 0) {
    warningsContainer.innerHTML = `
      <div class="warnings">
        <h3>⚠️ Compliance Warnings</h3>
        <ul>
          ${result.warnings.map(w => `<li>${escapeHtml(w)}</li>`).join("")}
        </ul>
      </div>
    `;
  } else {
    warningsContainer.innerHTML = "";
  }

  metadataContainer.innerHTML = `
    <div class="metadata-item">
      <div class="metadata-label">Platform</div>
      <div>${escapeHtml(result.metadata.platform)}</div>
    </div>
    <div class="metadata-item">
      <div class="metadata-label">Tier</div>
      <div>${escapeHtml(result.metadata.tier)}</div>
    </div>
    <div class="metadata-item">
      <div class="metadata-label">Compliance</div>
      <div>${escapeHtml(result.metadata.complianceMode)}</div>
    </div>
    <div class="metadata-item">
      <div class="metadata-label">De-identified</div>
      <div>${result.metadata.wasDeIdentified ? "Yes" : "No"}</div>
    </div>
  `;

  promptOutput.textContent = result.prompt;

  outputSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function handleClear(): void {
  const form = document.getElementById("promptForm") as HTMLFormElement;
  const outputSection = document.getElementById("outputSection");
  const promptOutput = document.getElementById("promptOutput");
  const warningsContainer = document.getElementById("warningsContainer");
  const metadataContainer = document.getElementById("metadataContainer");

  if (!form) return;

  form.reset();

  if (outputSection) {
    outputSection.classList.remove("visible");
  }

  if (promptOutput) {
    promptOutput.textContent = "";
  }

  if (warningsContainer) {
    warningsContainer.innerHTML = "";
  }

  if (metadataContainer) {
    metadataContainer.innerHTML = "";
  }

  const firstInput = form.querySelector("textarea") as HTMLTextAreaElement;
  if (firstInput) {
    firstInput.focus();
  }
}

async function handleCopy(): Promise<void> {
  const promptOutput = document.getElementById("promptOutput") as HTMLElement;

  if (!promptOutput || !promptOutput.textContent) {
    return;
  }

  try {
    await navigator.clipboard.writeText(promptOutput.textContent);

    const copyBtn = document.getElementById("copyBtn") as HTMLButtonElement;
    if (copyBtn) {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "✓ Copied!";
      copyBtn.disabled = true;

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.disabled = false;
      }, 2000);
    }
  } catch (error) {
    console.error("Failed to copy:", error);
    alert("Failed to copy to clipboard");
  }
}

function preventPersistence(): void {
  const inputs = document.querySelectorAll("input, textarea");
  inputs.forEach(input => {
    input.setAttribute("autocomplete", "off");
  });

  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) {
    // Storage might be disabled
  }

  window.addEventListener("beforeunload", (e) => {
    const taskInput = document.getElementById("taskInput") as HTMLTextAreaElement;
    if (taskInput && taskInput.value.trim()) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
