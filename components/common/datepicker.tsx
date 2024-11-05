"use client";

import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Matcher } from "react-day-picker";
import { useState } from "react";

export interface DatePickerProps {
  label: string;
  description?: string;
  date?: string;
  setDate: (date: string | undefined) => void;
  disabled?: boolean;
  disabledMatcher?: Matcher | Matcher[] | undefined;
}

export default function DatePicker(props: DatePickerProps) {
  const { label, description, date, setDate, disabled, disabledMatcher } =
    props;
  const [open, setOpen] = useState<boolean>(false);
  return (
    <FormItem className="space-y-2">
      <FormLabel>{label}</FormLabel>
      {description && <FormDescription>{description}</FormDescription>}
      <div className="grid gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild disabled={disabled}>
            <Button
              variant={"outline"}
              className={cn("justify-start text-left font-normal gap-3")}
            >
              <div className="h-10 flex items-center justify-center pr-3 border-r">
                <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
              </div>
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              defaultMonth={date ? new Date(date) : new Date()}
              numberOfMonths={1}
              onSelect={(date) => {
                setDate(date?.toISOString());
                setOpen(false);
              }}
              disabled={disabledMatcher}
              fromYear={1900}
              toYear={2030}
              initialFocus
              captionLayout="dropdown-buttons"
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>
      <FormMessage />
    </FormItem>
  );
}
