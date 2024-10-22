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
  close?: () => void;
  title?: string;
  titleClassName?: string;
  className?: string;
}

export function BaseModal(props: BaseModalProps) {
  const { open, close, title, titleClassName, className, children } = props;
  return (
    <Dialog open={open}>
      <DialogContent
        close={close}
        className={cn(className, "max-w-[600px] w-[90%] sm:w-full")}
      >
        <DialogHeader>
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
