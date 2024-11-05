"use client";

import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Fragment } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export interface DateRangePickerProps {
  label: string;
  description?: string;
  fromDate?: Date;
  toDate?: Date;
  setFromDate: (date: Date | undefined) => void;
  setToDate: (date: Date | undefined) => void;
  disabled?: boolean;
  disabledDates?: (date: Date) => boolean;
}

export default function DateRangePicker(props: DateRangePickerProps) {
  const {
    label,
    description,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    disabled,
    disabledDates,
  } = props;
  return (
    <FormItem className="space-y-2">
      <FormLabel>{label}</FormLabel>
      {description && <FormDescription>{description}</FormDescription>}
      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild disabled={disabled}>
            <Button
              variant={"outline"}
              className="justify-start text-left font-normal gap-3"
            >
              <div className="h-10 flex items-center justify-center pr-3 border-r">
                <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
              </div>
              {fromDate ? (
                toDate ? (
                  <Fragment>
                    {format(fromDate, "LLL dd, y")} -{" "}
                    {format(toDate, "LLL dd, y")}
                  </Fragment>
                ) : (
                  format(fromDate, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{
                from: fromDate,
                to: toDate,
              }}
              defaultMonth={fromDate}
              numberOfMonths={2}
              onSelect={(dates) => {
                setFromDate(dates?.from);
                setToDate(dates?.to);
              }}
              disabled={disabledDates}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <FormMessage />
    </FormItem>
  );
}
