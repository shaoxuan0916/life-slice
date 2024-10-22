import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import React from "react";

const Spinner = ({ className }: { className?: string }) => {
  return (
    <LoaderCircleIcon
      width={16}
      height={16}
      className={cn("animate-spin", className)}
    />
  );
};

export default Spinner;
