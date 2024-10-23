"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const showFloatingCreateBtn = pathname === "/journeys";
  const hideTopbar = pathname.startsWith("/journeys/");

  return (
    <div className="flex flex-col min-h-screen mx-auto">
      {!hideTopbar && <Topbar />}

      <div
        className={cn(
          "flex md:gap-4 min-h-screen pt-16 md:pt-0",
          hideTopbar && "pt-4"
        )}
      >
        <div className="hidden md:flex h-full md:sticky md:top-0 md:left-0 z-50">
          <Sidebar />
        </div>
        <div className="w-full max-w-[1440px] mx-auto md:mt-8 px-4">
          {children}
          {showFloatingCreateBtn && (
            <Link
              href="/create?type=journey"
              className="md:hidden sticky bottom-12 ml-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary"
            >
              <PlusIcon
                width={24}
                height={24}
                className="w-8 h-8 text-primary-foreground"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
