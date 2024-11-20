import { cn } from "@/lib/utils";
import { CreditCardIcon, HeadsetIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const SettingsPage = () => {
  const items = [
    {
      title: "My Plan",
      href: "/settings/my-plan",
      icon: <CreditCardIcon width={24} height={24} />,
    },
    {
      title: "Support",
      href: "/settings/support",
      icon: <HeadsetIcon width={24} height={24} />,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-2xl font-bricolage font-semibold mb-4">Settings</h3>

      <div className="flex flex-col gap-4 mt-4">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "flex items-center gap-4 w-full px-5 py-7 border-2 rounded-xl hover:bg-primary-foreground cursor-pointer"
            )}
          >
            <div className="flex items-center gap-4 w-full text-primary">
              {item.icon}
              <p className="text-md lg:text:lg font-medium line-clamp-1">
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
