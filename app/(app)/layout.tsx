import Topbar from "@/components/layout/Topbar";
import config from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const AppLayout = async ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(config.auth.loginUrl);
  }

  return (
    <>
      <Topbar user={user} />
      {children}
    </>
  );
};

export default AppLayout;
