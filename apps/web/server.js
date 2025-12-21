#!/usr/bin/env node

/**
 * Local Development Server
 *
 * Minimal HTTP server for local development only.
 * No logging, no analytics, no external connections.
 */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PUBLIC_DIR = join(__dirname, "public");
const PORT = 3000;

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json"
};

/**
 * Handle incoming HTTP requests.
 */
async function handleRequest(req, res) {
  try {
    // Parse URL
    let filePath = req.url === "/" ? "/index.html" : req.url;

    // Security: prevent directory traversal
    if (filePath.includes("..")) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    // Resolve file path
    const fullPath = join(PUBLIC_DIR, filePath);

    // Read file
    const content = await readFile(fullPath);

    // Determine content type
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    // Send response
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY"
    });
    res.end(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.writeHead(404);
      res.end("Not Found");
    } else {
      res.writeHead(500);
      res.end("Internal Server Error");
    }
  }
}

/**
 * Start the server.
 */
const server = createServer(handleRequest);

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\n╔════════════════════════════════════════════════════════╗`);
  console.log(`║  PromptForge Web UI — Local Only                      ║`);
  console.log(`╚════════════════════════════════════════════════════════╝\n`);
  console.log(`Server running at: http://127.0.0.1:${PORT}`);
  console.log(`Compliance: OVIC / VPDSF`);
  console.log(`Mode: Local development only\n`);
  console.log(`Press Ctrl+C to stop\n`);
});

// Handle shutdown
process.on("SIGINT", () => {
  console.log("\n\nShutting down server...");
  server.close(() => {
    console.log("Server stopped");
    process.exit(0);
  });
});
