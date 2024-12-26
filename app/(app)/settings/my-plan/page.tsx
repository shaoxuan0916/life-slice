"use client";

import React from "react";
import SubscriptionPlan from "./partials/subscription";
import { fetchUserSubsriptionPlan } from "@/lib/api/subscription";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, CheckCircleIcon, Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const MyPlan = () => {
  const {
    data: subscription,
    error,
    isLoading,
  } = useQuery<Subscription[]>({
    queryKey: ["subscriptions"],
    queryFn: () => fetchUserSubsriptionPlan(),
  });

  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching user subsription plan.</div>;
  if (!subscription)
    return <div className="w-full h-full flex flex-col">Data not found =(</div>;

  const isPro = subscription[0]?.is_pro;

  return (
    <div className="w-full h-full flex flex-col pt-8 md:pt-0 pb-24">
      <h3 className="text-2xl lg:text-3xl font-bricolage font-semibold">
        My Plan
      </h3>
      <p className="mt-2 mb-4 text-md text-neutral-600 dark:text-neutral-400">
        Manage your subscription plan here.
      </p>

      <div className="mt-4 mb-8 flex items-center gap-2 p-4 border-[1px] rounded-xl">
        <Label className="text-md text-neutral-600 dark:text-neutral-300">
          Current Plan :
        </Label>
        <div className="flex items-center gap-2">
          <Badge>
            {isPro ? "Premium" : "Free"}
            {isPro && (
              <CheckCircleIcon
                width={20}
                height={20}
                className="ml-2 text-green-500"
              />
            )}
          </Badge>
        </div>
      </div>
      {!isPro ? (
        <>
          <div className="my-12 flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-200">
            <ArrowDown width={16} height={16} />
            <p className="text-md lg:text-lg font-semibold">
              Looking for upgrade plan?
            </p>
            <ArrowDown width={16} height={16} />
          </div>
          <SubscriptionPlan />
        </>
      ) : (
        <div className="my-12">
          <p className="mb-4 font-semibold text-lg lg:text-2xl text-center">
            Premium Plan Benefits:
          </p>
          <div className="flex flex-col items-center justify-center w-full max-w-[600px] mx-auto gap-4">
            <div className="px-4 py-3 rounded-xl bg-muted border">
              - Lifetime access
            </div>
            <div className="px-4 py-3 rounded-xl bg-muted border">
              - Unlimited journeys creation
            </div>
            <div className="px-4 py-3 rounded-xl bg-muted border">
              - Unlimited slices creation
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPlan;
