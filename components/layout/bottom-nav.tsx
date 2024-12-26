"use client";

import Link from "next/link";
import React from "react";
import { RouteIcon, SearchIcon, Settings, UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const pathname = usePathname();

  const items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
  }[] = [
    {
      title: "Explore",
      href: "/",
      icon: <SearchIcon width={24} height={24} />,
    },
    {
      title: "Journeys",
      href: "/journeys",
      icon: <RouteIcon width={24} height={24} />,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: <UserIcon width={24} height={24} />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings width={24} height={24} />,
    },
  ];

  return (
    <div className="md:hidden grid grid-cols-4 fixed bottom-0 left-0 p-4 right-0 bg-background z-50">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href || ""}
          className={cn(
            "flex flex-col gap-1 items-center justify-center rounded-full text-neutral-700 dark:text-neutral-300",
            pathname === item.href && "text-primary dark:text-primary font-bold"
          )}
        >
          {item.icon}
          <span className="text-xs">{item.title}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
