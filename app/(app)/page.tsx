"use client";

import { Loader } from "@/components/common/loader";
import { fetchPublicJourneys } from "@/lib/api/journey";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import JourneyCard from "./journeys/partials/journey-card";

const ExplorePage = () => {
  const {
    data: journeys,
    error,
    isLoading,
  } = useQuery<Journey[]>({
    queryKey: ["explore", "journeys"],
    queryFn: () => fetchPublicJourneys(),
  });

  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching journeys data.</div>;
  if (!journeys)
    return <div className="w-full h-full flex flex-col">Data not found =(</div>;

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-2xl font-bricolage font-semibold mb-4">Explore</h3>
      <div className="pt-4 grid gap-4 lg:grid-cols-2">
        {journeys.length > 0 ? (
          journeys.map((j) => {
            return <JourneyCard key={j.id} journey={j} />;
          })
        ) : (
          <div className="">No public journeys found</div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
