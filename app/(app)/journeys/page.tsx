"use client";

import React from "react";
import JourneyCard from "./partials/journey-card";
import { useQuery } from "@tanstack/react-query";
import { fetchUserJourneys } from "@/lib/api/journey";
import Link from "next/link";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const JourneysPage = () => {
  const router = useRouter();
  const {
    data: journeys,
    error,
    isLoading,
  } = useQuery<Journey[]>({
    queryKey: ["journeys"],
    queryFn: () => fetchUserJourneys(),
  });

  if (isLoading)
    return <LoaderCircleIcon width={16} height={16} className="animate-spin" />;
  if (error) return <div>Error fetching journeys data.</div>;
  if (!journeys)
    return <div className="w-full h-full flex flex-col">Data not found =(</div>;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bricolage font-semibold">Journeys</h3>
        <Button
          className="hidden md:flex gap-2"
          onClick={() => router.push("/create?type=journey")}
        >
          <PlusIcon
            width={20}
            height={20}
            className="w-5 h-5 text-primary-foreground"
          />
          <p className="text-md font-semibold">Create</p>
        </Button>
      </div>
      <div className="pt-4 grid gap-4 lg:grid-cols-2">
        {journeys.length > 0 ? (
          journeys.map((j) => {
            return <JourneyCard key={j.id} journey={j} />;
          })
        ) : (
          // TODO: Add a nice svg / icon to guide user to create their first journey
          <div className="">
            <Link href="/create?type=journey" className="underline mr-[6px]">
              Create
            </Link>
            your first journey now!
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneysPage;
