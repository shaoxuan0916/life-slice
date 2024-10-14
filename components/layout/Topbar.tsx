"use client";

import { User } from "@supabase/supabase-js";
import React from "react";
import { Button } from "../ui/button";
import { logout } from "@/lib/api/auth";

interface TopbarProps {
  user?: User | null;
}

const Topbar = ({ user }: TopbarProps) => {
  return (
    <div>
      Topbar, {user?.email}
      <div>
        <Button onClick={logout}>Log out</Button>
      </div>
    </div>
  );
};

export default Topbar;
