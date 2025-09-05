var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import Stripe from "stripe";
import { env } from "../../config/env.config";
// Initialize Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const router = express.Router();
router.post("/create-checkout-session", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const session = yield stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: line_items,
        mode: "payment",
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cancel",
    });
    console.log(session.id);
    return res.status(200).json({ id: session.id });
}));
export default router;
//# sourceMappingURL=payment.routes.js.map