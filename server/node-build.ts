import path from "path";
import fs from "fs";
import { createServer } from "./index";
import express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// Find SPA directory
const distPath = path.join(process.cwd(), "dist/spa");

// Serve static files
app.use(express.static(distPath, { index: false }));

// Serve index.html for SPA routing
const serveIndex = (_req: any, res: any) => {
  const indexPath = path.join(distPath, "index.html");
  fs.readFile(indexPath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading index.html:", err);
      return res.status(500).send("Internal server error");
    }
    res.type("text/html").send(data);
  });
};

// Handle React Router - serve index.html for all non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "Not found" });
  }

  serveIndex(req, res);
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Serving SPA from: ${distPath}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down gracefully");
  server.close(() => {
    process.exit(0);
  });
});
