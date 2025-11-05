import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { handleDemo } from "./routes/demo";
import { initializePayment, verifyPayment, getPublicKey } from "./routes/paystack";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from dist/spa (production build)
  app.use(express.static(path.join(__dirname, "../dist/spa")));

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

  // SPA fallback: serve index.html for all non-API routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../dist/spa/index.html"));
  });

  return app;
}
