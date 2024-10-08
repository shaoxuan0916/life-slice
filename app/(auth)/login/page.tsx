"use client";

import React, { useEffect } from "react";
import LoginForm from "./form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/provider";

const LoginPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email_confirmed_at) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="bg-background">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
