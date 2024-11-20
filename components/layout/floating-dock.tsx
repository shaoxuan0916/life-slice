/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/
"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MoonStarIcon,
  PanelBottomCloseIcon,
  PanelBottomOpenIcon,
  RouteIcon,
  SearchIcon,
  Settings,
  UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

export const FloatingDock = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme === "system") {
      setTheme("dark");
    }
  }, [theme, setTheme]);

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
    {
      title: "Dark mode",
      onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
      icon: <MoonStarIcon width={24} height={24} />,
    },
  ];

  return (
    <>
      {open && (
        <div
          className={cn("fixed inset-0 bg-black/10 backdrop-blur-sm z-10")}
          onClick={() => setOpen(false)}
        ></div>
      )}
      <div className={cn("fixed bottom-8 right-4 md:hidden z-20", className)}>
        <AnimatePresence>
          {open && (
            <motion.div
              layoutId="nav"
              className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2"
            >
              {items.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    transition: {
                      delay: idx * 0.05,
                    },
                  }}
                  transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                >
                  {item.onClick ? (
                    <div
                      key={item.title}
                      className={cn(
                        "h-20 w-20 rounded-full bg-neutral-100/90 border-[1px] border-neutral-300 dark:bg-neutral-900/90 flex items-center justify-center",
                        theme === "dark" && "dark:bg-neutral-100/30"
                      )}
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                    >
                      <div className="h-6 w-6">{item.icon}</div>
                    </div>
                  ) : (
                    <Link
                      href={item?.href || ""}
                      key={item.title}
                      onClick={() => setOpen(!open)}
                      className={cn(
                        "h-20 w-20 rounded-full bg-neutral-100/90 border-[1px] border-neutral-300 dark:bg-neutral-900/90 flex items-center justify-center",
                        pathname === item?.href &&
                          "border-blue-500 bg-blue-400/30 dark:bg-blue-400/30"
                      )}
                    >
                      <div className="h-6 w-6">{item.icon}</div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setOpen(!open)}
          className="h-20 w-20 rounded-full bg-neutral-100 dark:bg-neutral-900 border-[1px] border-neutral-300 flex items-center justify-center"
        >
          {open ? (
            <PanelBottomCloseIcon className="h-6 w-6" />
          ) : (
            <PanelBottomOpenIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    </>
  );
};
