import React, { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { EllipsisVerticalIcon } from "lucide-react";

const MorePopover = ({
  children,
  btnClassname,
}: {
  children: ReactNode;
  btnClassname?: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger className="hover:bg-primary-foreground rounded-full p-1">
        <EllipsisVerticalIcon width={20} height={20} className={btnClassname} />
      </PopoverTrigger>
      <PopoverContent className="w-fit mx-4 px-3 py-2">
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default MorePopover;
