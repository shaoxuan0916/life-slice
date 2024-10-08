"use client";

import React, { ReactNode } from "react";
import Topbar from "@/components/layout/Topbar";
import { useAuth } from "@/lib/supabase/provider";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  return (
    <>
      <Topbar user={user} />
      {children}
    </>
  );
};

export default AppLayout;
