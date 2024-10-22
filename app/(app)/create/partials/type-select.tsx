import { cn } from "@/lib/utils";
import { FlagIcon, RouteIcon } from "lucide-react";

const createOptions = [
  {
    name: "Journey",
    value: "JOURNEY",
    icon: <RouteIcon width={28} height={28} className="w-6 h-6" />,
  },
  {
    name: "Slice",
    value: "SLICE",
    icon: <FlagIcon width={28} height={28} className="w-6 h-6" />,
  },
];

type TypeSelectProps = {
  type: string | null;
  onSelect: (value: string) => void;
};

const TypeSelect = ({ type, onSelect }: TypeSelectProps) => {
  return (
    <div className="w-full max-w-[600px] flex flex-col gap-4">
      {createOptions.map((c) => {
        return (
          <div
            key={c.value}
            className={cn(
              "w-full flex flex-col md:flex-row items-center gap-6 md:gap-8 p-8 md:px-12 rounded-2xl border-[1.5px] cursor-pointer hover:bg-primary-foreground/50",
              type === c.value && "bg-primary-foreground"
            )}
            onClick={() => onSelect(c.value)}
          >
            {c.icon}
            <p className="text-xl font-medium">{c.name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TypeSelect;
