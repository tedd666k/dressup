import { Request, Response } from "express";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_PUBLIC_KEY = "pk_live_8fb52479f7deb87da3914af4916b154e02584a7e";

export async function initializePayment(req: Request, res: Response) {
  try {
    const { email, amount, reference, description } = req.body;

    if (!email || !amount || !reference) {
      return res.status(400).json({ error: "Missing required fields: email, amount, reference" });
    }

    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ error: "Paystack secret key not configured" });
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Convert to pesewas
        reference,
        description: description || "Meya Karis Order",
        metadata: {
          custom_fields: [
            {
              display_name: "Order Reference",
              variable_name: "order_ref",
              value: reference,
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.message || "Failed to initialize payment" });
    }

    return res.json({
      success: true,
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error("Paystack initialization error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function verifyPayment(req: Request, res: Response) {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({ error: "Missing reference parameter" });
    }

    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ error: "Paystack secret key not configured" });
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.message || "Failed to verify payment" });
    }

    const transaction = data.data;
    const isSuccessful = transaction.status === "success";

    return res.json({
      success: true,
      verified: isSuccessful,
      status: transaction.status,
      amount: transaction.amount / 100, // Convert from pesewas to cedis
      reference: transaction.reference,
      email: transaction.customer.email,
      message: isSuccessful ? "Payment verified successfully" : "Payment was not successful",
    });
  } catch (error) {
    console.error("Paystack verification error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export function getPublicKey(_req: Request, res: Response) {
  return res.json({
    publicKey: PAYSTACK_PUBLIC_KEY,
  });
}
