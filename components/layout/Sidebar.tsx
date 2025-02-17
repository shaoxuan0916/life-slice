"use client";

import { logout } from "@/lib/api/auth";
import {
  LogOutIcon,
  UserIcon,
  RouteIcon,
  SearchIcon,
  Settings,
} from "lucide-react";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { ModeToggle } from "../common/mode-toggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/supabase/provider";

export type NavLinks = {
  name: string;
  pathname: string;
  icon: JSX.Element | string | StaticImageData;
  hasNotification?: boolean;
  seperator?: boolean;
  hide?: boolean;
};

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const routes: NavLinks[] = [
    {
      name: "Explore",
      pathname: "/",
      icon: <SearchIcon width={20} height={20} />,
    },
    {
      name: "Journeys",
      pathname: "/journeys",
      icon: <RouteIcon width={20} height={20} />,
    },
    {
      name: "Profile",
      pathname: "/profile",
      icon: <UserIcon width={20} height={20} />,
    },
    {
      name: "Settings",
      pathname: "/settings",
      icon: <Settings width={20} height={20} />,
    },
  ];

  return (
    <div className="flex flex-col w-[200px] h-screen py-8 px-4 bg-background">
      <div className="flex items-center justify-between mb-6">
        <Link href="/journeys">
          <h1 className="pl-2 text-2xl font-bricolage font-semibold">
            Life Slice
          </h1>
        </Link>
      </div>

      {/* Nav Link */}
      <div className="flex-1">
        {routes.map((link) => (
          <Link key={link.name} href={link.pathname}>
            <div
              className={cn(
                "relative flex items-center gap-2 my-2 py-3 px-2 w-full text-primary rounded-lg",
                pathname.startsWith(link.pathname) &&
                  link.pathname != "/" &&
                  "text-primary font-semibold bg-primary-foreground rounded-lg"
              )}
            >
              {link.icon as string}
              <p className="text-[16px] leading-6">{link.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Logout & Theme Toggle */}
      <div className="flex flex-col gap-4 mb-12">
        <ModeToggle showLabel={true} />
        <div
          className="flex items-center gap-2 py-3 w-full text-primary rounded-lg cursor-pointer"
          onClick={async () => {
            if (user) {
              await logout();
            }
            router.push("/login");
          }}
        >
          <LogOutIcon width={20} height={20} />
          <p className="text-[16px] leading-6">{user ? "Logout" : "Login"}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
