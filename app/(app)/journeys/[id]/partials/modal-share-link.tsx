"use client";

import React from "react";
import { useCopyToClipboard } from "usehooks-ts";
import { BaseModal } from "@/components/common/base-modal";
import { toast } from "@/hooks/utils/use-toast";
import { usePathname } from "next/navigation";
import Input from "@/components/common/input";
import { Button } from "@/components/ui/button";

interface ModalShareLinkProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

const ModalShareLink = ({ open, onOpenChange }: ModalShareLinkProps) => {
  const [copiedText, copy] = useCopyToClipboard();
  const pathname = usePathname();

  const journeyLink = window.location.origin + pathname;

  const handleCopy = (text: string) => () => {
    copy(text)
      .then(() => {
        console.log(copiedText);
        toast({ description: "Copied to clipboard!" });
      })
      .catch((error) => {
        console.log("Failed to copy: ", error);
        toast({ variant: "destructive", description: "Failed to copy" });
      })
      .finally(() => {
        onOpenChange(false);
      });
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Share journey"
      className="max-w-[450px]"
    >
      <Input value={journeyLink} disabled />
      <Button
        className="w-full"
        variant="default"
        onClick={handleCopy(journeyLink)}
      >
        Copy link
      </Button>
    </BaseModal>
  );
};

export default ModalShareLink;
