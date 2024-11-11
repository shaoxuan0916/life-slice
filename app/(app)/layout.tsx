"use client";

import Sidebar from "@/components/layout/Sidebar";
// import Topbar from "@/components/layout/topbar";
import { FloatingDock } from "@/components/layout/floating-dock";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  // const hideTopbar = pathname.startsWith("/journeys/");
  const hideFloatingDock =
    pathname.startsWith("/journeys/") ||
    pathname.includes("edit") ||
    pathname.includes("create");

  return (
    <div className="flex flex-col min-h-screen mx-auto">
      {/* {!hideTopbar && <Topbar />} */}

      {!hideFloatingDock && <FloatingDock />}

      <div
        className={cn(
          "flex md:gap-4 min-h-screen pt-8 md:pt-0"
          // hideTopbar && "pt-4"
        )}
      >
        <div className="hidden md:flex h-full md:sticky md:top-0 md:left-0 z-50">
          <Sidebar />
        </div>
        <div className="w-full max-w-[1440px] mx-auto md:mt-8 px-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
