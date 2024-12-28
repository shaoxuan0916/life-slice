"use client";

import { fetchJourneyById } from "@/lib/api/journey";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import JourneyPageHeader from "./partials/journey-page-header";
import { Timeline } from "@/components/ui/timeline";
import { BookmarkIcon, PlusIcon, Share2Icon } from "lucide-react";
import { fetchJourneySlices } from "@/lib/api/slice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/common/loader";
import { useAuth } from "@/lib/supabase/provider";
import { cn } from "@/lib/utils";
import ModalShareLink from "./partials/modal-share-link";
import { BackButton } from "@/components/common/back-button";
import {
  useCheckIsJourneyFavorite,
  useHandleUserFavorite,
} from "@/hooks/user-favorite.hook";

interface RouteParams {
  params: {
    id: string;
  };
}

const JourneyPage = ({ params }: RouteParams) => {
  const router = useRouter();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const journeyId = params.id;
  const {
    data: journey,
    error: errorJourney,
    isLoading: isLoadingJourney,
  } = useQuery<Journey>({
    queryKey: ["journeys", journeyId],
    queryFn: () => fetchJourneyById(journeyId),
    enabled: !!journeyId,
  });

  const {
    data: slices,
    error: errorSlices,
    isLoading: isLoadingSlices,
  } = useQuery<Slice[]>({
    queryKey: ["slices"],
    queryFn: () => fetchJourneySlices(journeyId),
    enabled: !!journeyId,
  });

  const { data: isFavorite } = useCheckIsJourneyFavorite(journeyId);

  const mutation = useHandleUserFavorite();

  const isOwner = user?.id === journey?.user_id;

  if (isLoadingJourney || isLoadingSlices)
    return (
      <div className="p-8">
        <Loader />
      </div>
    );
  if (errorJourney || errorSlices)
    return <div>Error fetching journey data.</div>;
  if (!journey || !slices) return <div>Data not found =(</div>;

  return (
    <div className="w-full h-full flex flex-col">
      <JourneyPageHeader
        journey={journey}
        isOwner={isOwner}
        isFavorite={isFavorite}
        mutation={mutation}
      />

      <ModalShareLink
        open={showModal}
        onOpenChange={() => setShowModal(false)}
      />

      <div className="flex items-center justify-between gap-8 py-8 px-4 md:px-8 lg:px-10 max-w-[1200px]">
        <div className="flex flex-col">
          <Badge variant="outline" className="w-fit mb-4 md:hidden">
            {journey.is_public ? "Public" : "Private"}
          </Badge>
          <div className="flex items-center gap-4 mb-4">
            <div className="hidden md:flex">
              <BackButton />
            </div>
            <h2 className="text-xl md:text-2xl text-black font-bricolage dark:text-white line-clamp-2 md:line-clamp-1">
              {journey.name}
            </h2>
            <Badge variant="outline" className="hidden md:flex">
              {journey.is_public ? "Public" : "Private"}
            </Badge>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-[16px] leading-6 whitespace-pre-line">
            {journey.description}
          </p>
        </div>

        <div className={cn("hidden md:flex items-center gap-8")}>
          <Link
            href={`/create?type=slice&journeyId=${journey.id}&title=${journey.name}`}
            className={cn("", !isOwner && "hidden")}
          >
            <PlusIcon width={24} height={24} className="cursor-pointer" />
          </Link>
          {!isOwner && (
            <BookmarkIcon
              width={24}
              height={24}
              className={cn(
                "cursor-pointer",
                isFavorite && "text-amber-400 fill-amber-400"
              )}
              onClick={async () => await mutation.mutateAsync(journey.id)}
            />
          )}
          <Share2Icon
            width={22}
            height={22}
            className="cursor-pointer"
            onClick={() => setShowModal(!showModal)}
          />
          <Button
            onClick={() => router.push(`/journeys/${journeyId}/edit`)}
            className={cn("px-8", !isOwner && "hidden")}
            variant="secondary"
          >
            Edit
          </Button>
        </div>
      </div>

      <Timeline
        data={slices}
        journeyId={journey.id}
        title={journey.name}
        isPublic={journey.is_public}
        isOwner={isOwner}
      />
    </div>
  );
};

export default JourneyPage;
