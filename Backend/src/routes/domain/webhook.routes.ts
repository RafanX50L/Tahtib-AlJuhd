import express from "express";
import Stripe from "stripe";
import { env } from "@/config/env.config";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" });
const webhookSecret = env.WEBHOOK_SECRET!;
const router = express.Router();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig!, webhookSecret);

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("✅ PaymentIntent succeeded:", paymentIntent.id);

        // TODO: update MongoDB here (e.g. mark user as paid)
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("✅ Checkout session completed:", session.id);
      }

      res.status(200).send("ok");
    } catch (err: any) {
      console.error(`⚠️ Webhook error: ${err.message}`);
      res.status(400).send(`Webhook error: ${err.message}`);
    }
  }
);

export default router;
