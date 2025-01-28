import Stripe from "stripe";

const stripeApiKey = `${process.env.STRIPE_SECRET_KEY}`;

const stripe = new Stripe(stripeApiKey, {
  apiVersion: "2025-01-27.acacia",
  typescript: true,
});

export default stripe;
