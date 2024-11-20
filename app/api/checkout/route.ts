import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const headersList = headers();
  const { userId } = await req.json();
  const lineItems = [
    {
      price: process.env.NEXT_PUBLIC_PRICE_ID,
      quantity: 1,
    },
  ];
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      expires_at: Math.floor(Date.now() / 1000) + 60 * 30,
      success_url: `${headersList.get(
        "origin"
      )}/settings/my-plan/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${headersList.get(
        "origin"
      )}/settings/my-plan/?cancelled=true`,
      client_reference_id: userId,
    });

    return NextResponse.json({
      sessionId: session.id,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Error creating checkout session" });
  }
}
