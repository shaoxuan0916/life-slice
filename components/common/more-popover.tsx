import React, { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { EllipsisVerticalIcon } from "lucide-react";

const MorePopover = ({ children }: { children: ReactNode }) => {
  return (
    <Popover>
      <PopoverTrigger className="hover:bg-primary-foreground rounded-full">
        <EllipsisVerticalIcon width={20} height={20} />
      </PopoverTrigger>
      <PopoverContent className="w-fit mx-4 px-3 py-2">
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default MorePopover;
