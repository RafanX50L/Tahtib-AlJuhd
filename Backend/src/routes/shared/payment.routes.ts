// import express, { NextFunction, Request, Response } from 'express';
// import Stripe from 'stripe';
// import mongoose from 'mongoose';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: '2025-08-27.basil',
// });

// // Define interfaces for type safety
// interface PaymentRequestBody {
//   amount: number;
//   currency: string;
//   planId: string;
//   userId: string;
// }

// // MongoDB User Schema (example)
// interface User extends mongoose.Document {
//   _id: string;
//   hasActivePlan: boolean;
//   planId: string | null;
//   purchaseDate: Date | null;
// }

// const UserSchema = new mongoose.Schema({
//   hasActivePlan: { type: Boolean, default: false },
//   planId: { type: String, default: null },
//   purchaseDate: { type: Date, default: null },
// });
// const UserModel = mongoose.model<User>('User', UserSchema);

// const router = express.Router();

// // Endpoint to create a payment intent
// router.post('/create-payment-intent', async (req: Request<{}, {}, PaymentRequestBody>, res: Response, next:NextFunction) => {// eslint-disable-line
//   const { amount, currency, planId, userId } = req.body;

//   // Validate request
//   if (!amount || !currency || !planId || !userId) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   try {
//     // Create Stripe payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount, // Amount in cents (e.g., 5000 = $50)
//       currency,
//       payment_method_types: ['card'],
//       metadata: { planId, userId }, // Store plan and user info for reference
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     next(error);
//   }
// });

// // Endpoint to confirm payment and update user
// router.post('/confirm-payment', async (req: Request<{}, {}, { paymentIntentId: string; userId: string; planId: string }>, res: Response, next:NextFunction) => {// eslint-disable-line
//   const { paymentIntentId, userId, planId } = req.body;

//   try {
//     // Verify payment intent status
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
//     if (paymentIntent.status !== 'succeeded') {
//       return res.status(400).json({ error: 'Payment not successful' });
//     }

//     // Update user in MongoDB
//     await UserModel.updateOne(
//       { _id: userId },
//       { hasActivePlan: true, planId, purchaseDate: new Date() }
//     );

//     res.json({ message: 'Payment confirmed and user updated' });
//   } catch (error) {
//     next(error);
//   }
// });

// export default router;