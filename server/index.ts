import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { handleDemo } from "./routes/demo";
import {
  initializePayment,
  verifyPayment,
  getPublicKey,
} from "./routes/paystack";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Paystack API routes
  app.post("/api/paystack/initialize", initializePayment);
  app.get("/api/paystack/verify", verifyPayment);
  app.get("/api/paystack/public-key", getPublicKey);

  // Serve static files only if they exist (production mode)
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.resolve(__dirname, "../spa");

  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath, { index: false }));

    // SPA fallback - serve index.html for all non-API routes
    app.use((_req, res) => {
      const indexPath = path.resolve(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({ error: "Not found" });
      }
    });
  }

  return app;
}
