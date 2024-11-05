import { PropsWithChildren } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { XCircleIcon } from "lucide-react";

interface ConfirmModalProps extends PropsWithChildren {
  open: boolean;
  onConfirm: () => void;
  confirmText?: string;
  close: () => void;
  title?: string;
  variant?: "default" | "destructive";
}

export default function ConfirmModal(props: ConfirmModalProps) {
  const { open, onConfirm, close, variant, title, confirmText, children } =
    props;
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-[600px] w-[90%] sm:w-full">
        {!!close && (
          <div className="fixed top-4 right-4 cursor-pointer" onClick={close}>
            <XCircleIcon className="h-6 w-6 text-blox-red/50" />
          </div>
        )}
        <AlertDialogDescription className="hidden">
          Hidden Desc
        </AlertDialogDescription>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-md md:text-lg font-medium leading-snug my-4 text-left">
            {title || "Are you sure you want to proceed?"}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button asChild variant="secondary" onClick={close}>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </Button>
          <Button asChild variant={variant || "default"} onClick={onConfirm}>
            <AlertDialogAction>{confirmText || "Confirm"}</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
