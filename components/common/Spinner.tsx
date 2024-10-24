"use client";

import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";

export function Spinner({ className }: { className?: string }) {
  return (
    <LoaderCircleIcon
      width={16}
      height={16}
      className={cn("animate-spin", className)}
    />
  );
}
