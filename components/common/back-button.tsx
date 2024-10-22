"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  link?: string;
  onClick?: () => void;
  goBack?: boolean;
  showText?: boolean;
}

export function BackButton({
  link,
  onClick,
  goBack = true,
  showText = false,
}: BackButtonProps) {
  const router = useRouter();
  return (
    <div
      className="flex flex-row items-center gap-2 cursor-pointer"
      onClick={() => {
        if (link) {
          router.push(link);
        } else {
          onClick?.();
          if (goBack) router.back();
        }
      }}
    >
      <ArrowLeftIcon width={24} height={24} />
      {showText && <p className="text-[16px] font-semibold">Back</p>}
    </div>
  );
}
