import { cn } from "@/lib/utils";
import {
  Input as InputPrimitive,
  type InputProps as InputPrimitiveProps,
} from "../ui/input";
import { Label } from "../ui/label";
import { ForwardedRef } from "react";

type InputProps = InputPrimitiveProps & {
  label?: string;
  error?: string;
  ref?: ForwardedRef<HTMLInputElement>;
};

export default function Input(props: InputProps) {
  const { label, error, required, ref, ...rest } = props;

  return (
    <div className="flex flex-col">
      {label && (
        <Label
          htmlFor={rest.id}
          className={cn(
            "mb-2 ml-1",
            required ? "after:content-['*'] after:ml-1 after:text-red-600" : ""
          )}
        >
          {label}
        </Label>
      )}
      <InputPrimitive ref={ref} {...rest} />
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
