import { PropsWithChildren } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface BaseModalProps extends PropsWithChildren {
  open: boolean;
  onOpenChange?: (val: boolean) => void;
  close?: () => void;
  title?: string;
  titleClassName?: string;
  className?: string;
}

export function BaseModal(props: BaseModalProps) {
  const {
    open,
    onOpenChange,
    close,
    title,
    titleClassName,
    className,
    children,
  } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        close={close}
        className={cn("max-w-[600px] w-[90%] sm:w-full", className)}
      >
        <DialogHeader>
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
