import { BackButton } from "@/components/common/back-button";
import ConfirmModal from "@/components/common/confirm-modal";
import MorePopover from "@/components/common/more-popover";
import { toast } from "@/hooks/use-toast";
import { deleteJourneyById } from "@/lib/api/journey";
import { cn } from "@/lib/utils";
import { BookmarkIcon, PlusIcon, Share2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ModalShareLink from "./modal-share-link";
import { UseMutationResult } from "@tanstack/react-query";

interface JourneyPageHeaderProps {
  journey: Journey;
  isEdit?: boolean;
  isOwner: boolean;
  isFavorite?: boolean;
  mutation?: UseMutationResult<unknown[] | null, Error, string, unknown>;
}

const JourneyPageHeader = ({
  journey,
  isEdit = false,
  isOwner,
  isFavorite,
  mutation,
}: JourneyPageHeaderProps) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCopyModal, setShowCopyModal] = useState<boolean>(false);

  return (
    <div className="sticky top-0 left-0 right-0 flex items-center justify-between gap-4 bg-background z-50 py-4 md:hidden">
      <BackButton showText />
      <ModalShareLink
        open={showCopyModal}
        onOpenChange={() => setShowCopyModal(false)}
      />
      <div className={cn("flex items-center gap-4")}>
        <Link
          href={`/create?type=slice&journeyId=${journey.id}&title=${journey.name}`}
          className={cn("", isEdit && "hidden", !isOwner && "hidden")}
        >
          <PlusIcon width={20} height={20} className="cursor-pointer" />
        </Link>
        {!isOwner && mutation && (
          <BookmarkIcon
            width={20}
            height={20}
            className={cn(
              "cursor-pointer",
              isFavorite && "text-amber-400 fill-amber-400"
            )}
            onClick={async () => await mutation.mutateAsync(journey.id)}
          />
        )}
        <Share2Icon
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={() => setShowCopyModal(!showCopyModal)}
        />
        {isOwner && (
          <MorePopover>
            <div className="flex flex-col gap-1">
              {!isEdit && (
                <div
                  onClick={() => router.push(`/journeys/${journey.id}/edit`)}
                  className="px-3 py-1 hover:bg-primary-foreground cursor-pointer rounded-md"
                >
                  Edit
                </div>
              )}
              <div
                onClick={() => setShowModal(true)}
                className="px-3 py-1 hover:bg-primary-foreground cursor-pointer rounded-md"
              >
                Delete
              </div>
            </div>
          </MorePopover>
        )}
      </div>

      <ConfirmModal
        open={showModal}
        title={`Are you sure you want to delete ${journey.name}?`}
        variant="destructive"
        confirmText="Delete"
        close={() => setShowModal(false)}
        onConfirm={async () => {
          await deleteJourneyById(journey.id);
          toast({ description: "Journey deleted!" });
          router.push("/journeys");
        }}
      />
    </div>
  );
};

export default JourneyPageHeader;
