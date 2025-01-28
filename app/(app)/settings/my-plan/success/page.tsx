import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, CircleCheckBigIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const SuccessSubscription = () => {
  return (
    <div className="w-full min-h-screen flex flex-col gap-8 px-4 pt-16 pb-40 md:pb-0 max-w-[1200px] mx-auto">
      <CircleCheckBigIcon
        width={80}
        height={80}
        className="text-green-600 dark:text-green-500 mx-auto"
      />
      <p className="text-3xl font-bold text-center">🎉 Premium Unlocked!</p>
      <div className="my-4 flex flex-col gap-2 mx-auto text-neutral-600 dark:text-neutral-300">
        <p className="text-xl font-medium">Here&apos;s what you now enjoy:</p>
        <p>✅ Unlimited Journey Creation</p>
        <p>✅ Unlimited Slice Creation</p>
        <p>✅ Lifetime Access</p>
      </div>
      <p className="text-center text-neutral-600 dark:text-neutral-300">
        Welcome to the full LifeSlice experience, where your life&apos;s moments
        have no limits!
      </p>
      <Link href="/settings/my-plan" className="mx-auto">
        <Button
          variant="link"
          className="underline underline-offset-2 text-lg gap-2"
        >
          <ArrowLeftIcon width={20} height={20} /> Back to My Plan Page
        </Button>
      </Link>
    </div>
  );
};

export default SuccessSubscription;
