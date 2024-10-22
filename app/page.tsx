import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const LandingPage = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto p-4">
      <div className="flex flex-col gap-8">
        <p>LandingPage</p>
        <Button className="w-fit">
          <Link href="/login">Go to App</Link>
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
