"use client";

import React from "react";
import LoginForm from "./form";
import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { getUser } from "@/lib/api/auth";
import { redirect } from "next/navigation";

const LoginPage = () => {
  const { data: user, isLoading } = useQuery<User | null | undefined>({
    queryKey: ["users"],
    queryFn: () => getUser(),
  });

  if (user && !isLoading) redirect("/journeys");

  return (
    <div className="bg-background">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
