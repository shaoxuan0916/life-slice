"use client";

// import Sidebar from "@/components/layout/Sidebar";
// import BottomNav from "@/components/layout/bottom-nav";
// import { FloatingDock } from "@/components/layout/floating-dock";
// import { cn } from "@/lib/utils";
// import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  // const pathname = usePathname();

  // Uncomment this if you want to show the floating dock
  // const hideFloatingDock =
  //   pathname.startsWith("/journeys/") ||
  //   pathname.includes("edit") ||
  //   pathname.includes("create");

  // const hideBottomNav =
  //   pathname.startsWith("/journeys/") ||
  //   pathname.includes("edit") ||
  //   pathname.includes("create");

  return (
    <div className="flex flex-col min-h-screen mx-auto">
      {/* Uncomment this if you want to show the floating dock */}
      {/* {!hideFloatingDock && <FloatingDock />} */}

      {/* <div className={cn("flex md:gap-4 min-h-screen")}>
        <div className="hidden md:flex h-full md:sticky md:top-0 md:left-0 z-50">
          <Sidebar />
        </div>
        <div className="w-full max-w-[1440px] mx-auto md:mt-8 px-4 pb-16">
          {children}
        </div>
      </div>
      {!hideBottomNav && <BottomNav />} */}

      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Hi, we&apos;re sorry!</h1>
        <p className="text-lg text-muted-foreground">
          We are no longer actively developing this product.
        </p>
      </div>
    </div>
  );
};

export default AppLayout;
