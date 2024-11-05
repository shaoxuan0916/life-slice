import { BackButton } from "@/components/common/back-button";
import ConfirmModal from "@/components/common/confirm-modal";
import MorePopover from "@/components/common/more-popover";
import { toast } from "@/hooks/use-toast";
import { deleteJourneyById } from "@/lib/api/journey";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

interface JourneyPageHeaderProps {
  journey: Journey;
  isEdit?: boolean;
}

const JourneyPageHeader = ({
  journey,
  isEdit = false,
}: JourneyPageHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState<boolean>(false);
  const goBackLink = pathname.includes("edit")
    ? `/journeys/${journey.id}`
    : "/journeys";

  return (
    <div className="sticky top-0 left-0 right-0 flex items-center justify-between gap-4 bg-background z-50 py-3 md:hidden">
      <BackButton link={goBackLink} showText />
      <div className="flex items-center gap-4">
        <Link
          href={`/create?type=slice&journeyId=${journey.id}&title=${journey.name}`}
          className={cn("", isEdit && "hidden")}
        >
          <PlusIcon width={20} height={20} className="cursor-pointer" />
        </Link>
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
