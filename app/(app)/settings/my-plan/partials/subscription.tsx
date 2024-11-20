"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/lib/supabase/provider";

const tiers = [
  {
    name: "Free",
    id: "tier-free",
    price: "$0",
    description:
      "The perfect plan if you're just getting started with LifeSlice.",
    features: ["Up to 3 journeys", "Up to 20 slices per journey"],
    featured: false,
  },
  {
    name: "Premium",
    id: "tier-premium",
    price: "$99",
    discountedPrice: "$49",
    description: "Get everything, forever.",
    features: ["Lifetime access", "Unlimited journeys", "Unlimited slices"],
    featured: true,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SubscriptionPlan() {
  const { user } = useAuth();
  const [loadingCheckoutUrl, setLoadingCheckoutUrl] = useState<boolean>(false);

  const redirectToCheckout = async () => {
    setLoadingCheckoutUrl(true);
    try {
      const stripe = await loadStripe(
        `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
      );
      if (!stripe) throw new Error("Stripe failed to initialize.");

      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ userId: user?.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { sessionId } = await checkoutResponse.json();

      const stripeError = await stripe.redirectToCheckout({ sessionId });
      if (stripeError) {
        console.error("stripeError", stripeError);
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCheckoutUrl(false);
    }
  };
  return (
    <div className="relative isolate px-6 py-8 lg:py-12 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-balance text-3xl lg:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-300 sm:text-6xl">
          Get everything, forever.
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-md font-medium text-neutral-600 dark:text-neutral-400 lg:text-xl/8">
        Choose the plan that works best for your needs.
      </p>

      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2 lg:gap-8">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured
                ? "relative bg-neutral-900/90 dark:bg-neutral-100 shadow-2xl"
                : "bg-white dark:bg-neutral-900/90 sm:mx-8 lg:mx-0",
              "rounded-3xl p-8 ring-1 ring-neutral-900/60 sm:p-10"
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured
                  ? "text-indigo-400 dark:text-indigo-600"
                  : "text-indigo-600 dark:text-indigo-400",
                "text-base/7 font-semibold"
              )}
            >
              {tier.name}
            </h3>
            <div className="mt-4 flex items-baseline gap-x-2">
              {tier.discountedPrice ? (
                <div>
                  <span
                    className={classNames(
                      tier.featured
                        ? "text-neutral-300 dark:text-neutral-600"
                        : "text-neutral-600 dark:text-neutral-300",
                      "text-2xl font-semibold tracking-tight line-through mr-3"
                    )}
                  >
                    {" "}
                    {tier.price}{" "}
                  </span>
                  <span
                    className={classNames(
                      tier.featured
                        ? "text-neutral-100 dark:text-neutral-900"
                        : "text-neutral-900 dark:text-neutral-100",
                      "text-5xl font-semibold tracking-tight"
                    )}
                  >
                    {tier.discountedPrice}
                  </span>
                  <span
                    className={classNames(
                      tier.featured
                        ? "text-neutral-400 dark:text-neutral-500"
                        : "text-neutral-500 dark:text-neutral-400",
                      "text-base"
                    )}
                  >
                    /lifetime
                  </span>
                </div>
              ) : (
                <div>
                  <span
                    className={classNames(
                      tier.featured
                        ? "text-neutral-100 dark:text-neutral-900"
                        : "text-neutral-900 dark:text-neutral-100",
                      "text-5xl font-semibold tracking-tight"
                    )}
                  >
                    {tier.price}
                  </span>
                  <span
                    className={classNames(
                      tier.featured
                        ? "text-neutral-400 dark:text-neutral-500"
                        : "text-neutral-500 dark:text-neutral-400",
                      "text-base"
                    )}
                  >
                    /lifetime
                  </span>
                </div>
              )}
            </div>
            <p
              className={classNames(
                tier.featured
                  ? "text-neutral-300 dark:text-neutral-600"
                  : "text-neutral-600 dark:text-neutral-300",
                "mt-6 text-base/7"
              )}
            >
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured
                  ? "text-neutral-300 dark:text-neutral-600"
                  : "text-neutral-600 dark:text-neutral-300",
                "mt-8 space-y-3 text-sm/6 sm:mt-10"
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={classNames(
                      tier.featured ? "text-indigo-400" : "text-indigo-600",
                      "h-6 w-5 flex-none"
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            {tier.featured && (
              <Button
                onClick={() => redirectToCheckout()}
                loading={loadingCheckoutUrl}
                aria-describedby={tier.id}
                className={classNames(
                  tier.featured
                    ? "bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500"
                    : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600",
                  "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 w-full"
                )}
              >
                Upgrade now!
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
