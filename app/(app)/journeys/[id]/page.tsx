"use client";

import { fetchJourneyById } from "@/lib/api/journey";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import JourneyPageHeader from "./partials/journey-page-header";
import { Timeline } from "@/components/ui/timeline";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";
import { fetchJourneySlices } from "@/lib/api/slice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RouteParams {
  params: {
    id: string;
  };
}

const JourneyPage = ({ params }: RouteParams) => {
  const router = useRouter();

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

  if (isLoadingJourney || isLoadingSlices)
    return <LoaderCircleIcon width={16} height={16} className="animate-spin" />;

  if (errorJourney || errorSlices)
    return <div>Error fetching journey data.</div>;

  if (!journey || !slices) return <div>Data not found =(</div>;

  return (
    <div className="w-full h-full flex flex-col">
      <JourneyPageHeader journey={journey} />

      <div className="flex items-center justify-between gap-8 py-8 px-4 md:px-8 lg:px-10 max-w-[1200px]">
        <div className="flex flex-col max-w-[500px]">
          <h2 className="text-2xl md:text-3xl mb-4 text-black font-bricolage dark:text-white">
            {journey.name}
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-[16px] leading-6 whitespace-pre-line">
            {journey.description}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href={`/create?type=slice&journeyId=${journey.id}&title=${journey.name}`}
          >
            <PlusIcon width={24} height={24} className="cursor-pointer" />
          </Link>
          <Button
            onClick={() => router.push(`/journeys/${journeyId}/edit`)}
            className="px-8"
            variant="secondary"
          >
            Edit
          </Button>
        </div>
      </div>

      <Timeline data={slices} journeyId={journey.id} title={journey.name} />
    </div>
  );
};

export default JourneyPage;
