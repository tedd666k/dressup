import path from "path";
import { createServer } from "./index";
import express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built SPA files from the same directory as this file
const distPath = path.resolve(import.meta.dirname, "../spa");

try {
  // Serve static files
  app.use(express.static(distPath, { index: false }));

  // Handle React Router - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }

    const indexPath = path.join(distPath, "index.html");
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  });

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📂 Serving SPA from: ${distPath}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("🛑 Received SIGTERM, shutting down gracefully");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    console.log("🛑 Received SIGINT, shutting down gracefully");
    process.exit(0);
  });
} catch (err) {
  console.error("Fatal error:", err);
  process.exit(1);
}
