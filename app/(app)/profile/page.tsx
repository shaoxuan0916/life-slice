"use client";

import Input from "@/components/common/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/supabase/provider";
import React from "react";

const ProfilePage = () => {
  const { user } = useAuth();
  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-2xl font-bricolage font-semibold mb-4">Profile</h3>
      <div className="mt-8 flex flex-col gap-4 max-w-[500px]">
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input className="border-input" disabled value={user?.email} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
