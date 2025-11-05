import path from "path";
import { createServer } from "./index";
import express from "express";

const app = createServer();
const port = process.env.PORT || 3000;
const distPath = path.join(process.cwd(), "dist/spa");

// Serve static files
app.use(express.static(distPath));

// Fallback to index.html for any unmatched routes (SPA routing)
app.use((_req: any, res: any) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
