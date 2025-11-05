import path from "path";
import fs from "fs";
import { createServer } from "./index";
import express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// Try multiple possible paths for the SPA directory
const possiblePaths = [
  path.join(process.cwd(), "dist/spa"),
  path.resolve("dist/spa"),
  "/app/dist/spa",
  "./dist/spa",
];

let distPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    distPath = p;
    console.log(`✅ Found SPA directory at: ${distPath}`);
    break;
  }
}

if (!distPath) {
  console.error(`❌ Could not find dist/spa directory. Tried:\n${possiblePaths.join("\n")}`);
  process.exit(1);
}

// Serve static files
app.use(express.static(distPath, { index: false }));

// Handle React Router - serve index.html for all non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "Not found" });
  }

  const indexPath = path.join(distPath, "index.html");

  if (!fs.existsSync(indexPath)) {
    console.error(`❌ index.html not found at: ${indexPath}`);
    return res.status(500).json({ error: "index.html not found" });
  }

  res.sendFile(indexPath);
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`📂 Serving SPA from: ${distPath}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Shutting down gracefully");
  process.exit(0);
});
