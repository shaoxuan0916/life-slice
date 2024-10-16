"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, [supabase]);

  if (!user && !loading) redirect("/login");

  return (
    <div className="flex flex-col max-w-[1440px] mx-auto">
      <Topbar />

      <div className={cn("relative flex md:gap-4 min-h-screen pt-16 md:pt-0")}>
        <div className="hidden md:flex h-full md:sticky md:top-0 md:left-0 z-50">
          <Sidebar />
        </div>
        <div className="w-full mx-auto md:mt-8">{children}</div>
        <Link
          href="/create"
          className="md:hidden absolute bottom-8 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-primary"
        >
          <PlusIcon
            width={24}
            height={24}
            className="w-8 h-8 text-primary-foreground"
          />
        </Link>
      </div>
    </div>
  );
};

export default AppLayout;
