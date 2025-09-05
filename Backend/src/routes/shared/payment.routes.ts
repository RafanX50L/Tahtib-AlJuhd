import express, { Request, Response } from "express";
import Stripe from "stripe";
import { env } from "@/config/env.config";

// Initialize Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.WEBHOOK_SECRET;

const router = express.Router();


router.post("/create-checkout-session", async (req: Request, res: Response) => {
  const line_items = [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: "Trainer Plan",
        },
        unit_amount: 200000, // in paise (so ₹2000.00)
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: line_items,
    mode: "payment",
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
  });
  console.log(session.id);
  return res.status(200).json({id:session.id});
});



router.post(
  '/webhook',
  express.raw({type: 'application/json'}),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
      const thinEvent = stripe.parseThinEvent(req.body, sig, webhookSecret);

      // Fetch the event data to understand the failure
      const event = await stripe.v2.core.events.retrieve(thinEvent.id);
      if (event.type == 'v1.billing.meter.error_report_triggered') {
        const meter = await event.fetchRelatedObject();
        const meterId = meter.id;
        // Record the failures and alert your team
        // Add your logic here
      }
      res.sendStatus(200);
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.sendStatus(400).send(`Webhook Error: ${err.message}`);
    }
  },
);

export default router;
