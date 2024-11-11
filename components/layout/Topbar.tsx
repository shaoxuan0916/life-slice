"use client";

import Link from "next/link";
import React from "react";
import {
  Headset,
  LogOutIcon,
  MenuIcon,
  RouteIcon,
  SearchIcon,
  // Settings,
  UserIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLinks } from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { ModeToggle } from "../common/mode-toggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/supabase/provider";

const Topbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isSheetOpen, setSheetOpen] = React.useState(false);

  const handleClose = () => setSheetOpen(false);

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
    // {
    //   name: "Settings",
    //   pathname: "/settings",
    //   icon: <Settings width={20} height={20} />,
    // },
    {
      name: "Support",
      pathname: "/support",
      icon: <Headset width={20} height={20} />,
    },
  ];

  return (
    <div className="md:hidden flex justify-between items-center fixed top-0 left-0 right-0 p-4 bg-background z-50">
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger>
          <MenuIcon className="text-primary w-6 h-6 cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="left" className="pt-16 flex flex-col gap-6 w-full">
          <h1 className="pl-2 text-2xl font-bricolage font-bold">LifeSlice</h1>
          <SheetTitle className="hidden">LifeSlice</SheetTitle>
          {/* Nav Link */}
          <div className="flex-1">
            {routes.map((link) => (
              <div key={link.name}>
                <Link
                  key={link.name}
                  href={link.pathname}
                  onClick={handleClose}
                >
                  <div
                    className={cn(
                      "relative flex items-center gap-2 my-2 py-3 px-2 w-full text-primary rounded-lg",
                      pathname.startsWith(link.pathname) &&
                        link.pathname != "/" &&
                        "text-primary font-semibold bg-primary-foreground rounded-lg"
                    )}
                  >
                    {link.icon as string}
                    {isSheetOpen && (
                      <p className="text-[16px] leading-6">{link.name}</p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/*  Logout & Theme Toggle */}
          <div className="flex flex-col gap-4 mb-12">
            <ModeToggle showLabel={isSheetOpen} />

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
              {isSheetOpen && <p>{user ? "Logout" : "Login"}</p>}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Topbar;
