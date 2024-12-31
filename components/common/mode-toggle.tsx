"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

export function ModeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    if (theme === "system") {
      setTheme("dark");
    }
  }, [theme, setTheme]);

  return (
    <div className="flex items-center justify-between">
      <p className={cn("hidden", showLabel && "block text-primary")}>
        Dark mode
      </p>
      <Switch
        checked={theme === "dark" ? true : false}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    </div>
  );
}
