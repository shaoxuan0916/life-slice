import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import errorHandler from "@/lib/error.handler";
import { createClient } from "@/lib/supabase/client";
// import { createClient } from "@/lib/supabase/server";

const stripeApiKey = `${process.env.STRIPE_SECRET_KEY}`;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = new Stripe(stripeApiKey, {
  apiVersion: "2024-10-28.acacia",
  typescript: true,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");
  const supabase = createClient();

  let event;

  if (!signature || !webhookSecret) {
    throw new Error("Missing stripe-signature or webhook secret");
  }

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(
      `Webhook signature verification failed. ${errorHandler(err)}`
    );
    return NextResponse.json({ error: errorHandler(err) }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    // COMPLETE / SUCCESS
    case "checkout.session.completed":
      // const session = event.data.object;
      // console.log("Payment successful: ", session);

      if (event.data.object.client_reference_id) {
        const { data, error } = await supabase
          .from("subscriptions")
          .insert([
            {
              user_id: event.data.object.client_reference_id.toString(),
              is_pro: true,
            },
          ])
          .select();

        const { data: updatedUserData, error: updateUserError } = await supabase
          .from("users")
          .update({ is_pro: true, updated_at: new Date().toISOString() })
          .eq("user_id", event.data.object.client_reference_id.toString())
          .select();

        console.log("subscription data", data, error);
        console.log("update user data", updatedUserData, updateUserError);
      }
      break;

    // FAILED
    case "checkout.session.async_payment_failed":
      // const failedSession = event.data.object;
      // console.log("Payment failed: ", failedSession);
      break;

    // EXPIRED / CANCELLED
    case "checkout.session.expired":
      // const expiredSession = event.data.object;
      // console.log("Payment expired: ", expiredSession);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json("OK");
}
