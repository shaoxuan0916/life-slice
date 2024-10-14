"use client";

import React, { useEffect } from "react";
import LoginForm from "./form";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) router.push("/");
    };
    getUser();
  }, [supabase, router]);

  return (
    <div className="bg-background">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
