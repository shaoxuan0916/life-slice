import { BackButton } from "@/components/common/back-button";
import ConfirmModal from "@/components/common/confirm-modal";
import MorePopover from "@/components/common/more-popover";
import { toast } from "@/hooks/use-toast";
import { deleteSliceById } from "@/lib/api/slice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface SlicePageHeaderProps {
  slice: Slice;
  journeyId: string;
  isEdit?: boolean;
}

const SlicePageHeader = ({
  slice,
  journeyId,
  isEdit = false,
}: SlicePageHeaderProps) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const goBackLink = `/journeys/${journeyId}`;

  return (
    <div className="sticky top-0 left-0 right-0 flex items-center justify-between gap-4 bg-background z-50 py-3 md:hidden">
      <BackButton link={goBackLink} showText />
      <MorePopover>
        <div className="flex flex-col gap-1">
          {!isEdit && (
            <div
              onClick={() =>
                router.push(`/journeys/${journeyId}/slice/${slice.id}/edit`)
              }
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

      <ConfirmModal
        open={showModal}
        title={`Are you sure you want to delete ${slice.name}?`}
        variant="destructive"
        confirmText="Delete"
        close={() => setShowModal(false)}
        onConfirm={async () => {
          await deleteSliceById(slice.id);
          toast({ description: "Slice deleted!" });
          router.push(`/journeys/${journeyId}`);
        }}
      />
    </div>
  );
};

export default SlicePageHeader;
