import path from "path";
import { createServer } from "./index";
import express from "express";

const app = createServer();
const port = process.env.PORT || 3000;
const distPath = path.join(process.cwd(), "dist/spa");

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(distPath, { index: false }));

// Fallback to index.html for all non-API routes (SPA routing)
app.use((req, res) => {
  // Don't serve index.html for API routes that weren't matched
  if (req.path.startsWith("/api/") || req.path.startsWith("/.netlify/")) {
    return res.status(404).json({ error: "Not found" });
  }

  // Serve index.html for all other routes
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      console.error("Error serving index.html:", err);
      res.status(500).send("Internal server error");
    }
  });
});

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Serving from: ${distPath}`);
});
