"use client";

import Input from "@/components/common/input";
import { Loader } from "@/components/common/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/lib/api/auth";
import { fetchUser } from "@/lib/api/user";
import { useQuery } from "@tanstack/react-query";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const ProfilePage = () => {
  const router = useRouter();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<UserInfo[]>({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
  });

  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching user&apos;s data.</div>;
  if (!user)
    return <div className="w-full h-full flex flex-col">User not found =(</div>;

  return (
    <div className="w-full h-full flex flex-col pt-8 md:pt-0 max-w-[1000px]">
      <div className="flex items-center justify-between gap-8 mb-12">
        <h3 className="text-2xl font-bricolage font-semibold">Profile</h3>
        <Button onClick={() => router.push("/profile/edit")} className="px-8">
          Edit
        </Button>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-4">
            Email
            <Badge
              className="text-green-600 dark:text-green-300 border-green-600 dark:border-green-300"
              variant="outline"
            >
              {user[0].is_verified ? "Verified" : "Not verified"}
            </Badge>
          </Label>
          <Input className="border-input" disabled value={user[0].email} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Name</Label>
          <Input
            className="border-input"
            disabled
            value={user[0].full_name || ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Username</Label>
          <Input className="border-input" disabled value={user[0].username} />
        </div>
      </div>
      <Separator className="my-8 md:hidden" />
      <Button
        variant="outline"
        className="border-neutral-500 md:hidden"
        onClick={async () => {
          if (user) {
            await logout();
          }
          router.push("/login");
        }}
      >
        <LogOutIcon width={24} height={24} />
        <p className="text-lg">{user ? "Logout" : "Login"}</p>
      </Button>
    </div>
  );
};

export default ProfilePage;
