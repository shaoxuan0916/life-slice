"use client";

import { Loader } from "@/components/common/loader";
import { fetchPublicJourneys } from "@/lib/api/journey";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import JourneyCard from "./journeys/partials/journey-card";
import Input from "@/components/common/input";
import { SearchIcon, XIcon } from "lucide-react";

const ExplorePage = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: journeys,
    error,
    isLoading,
  } = useQuery<(Journey & { users: UserInfo })[]>({
    queryKey: ["explore", "journeys", searchQuery],
    queryFn: () => fetchPublicJourneys(searchQuery),
  });

  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching journeys data.</div>;

  return (
    // TODO: Infinite scroll down & enhance UI
    // TODO: Fix search in chinese
    <div className="w-full h-full flex flex-col pb-16">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bricolage font-semibold mb-4">Explore</h3>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchQuery(searchText);
              }
            }}
          />
          <SearchIcon
            width={24}
            height={24}
            className="cursor-pointer p-1 hover:bg-primary/30 hover:rounded-full"
            onClick={() => setSearchQuery(searchText)}
          />
          {searchQuery && (
            <XIcon
              width={24}
              height={24}
              className="cursor-pointer p-1 hover:bg-primary/30 hover:rounded-full"
              onClick={() => {
                setSearchText("");
                setSearchQuery("");
              }}
            />
          )}
        </div>
      </div>
      <div className="pt-4 grid gap-4 lg:grid-cols-2">
        {journeys && journeys?.length > 0 ? (
          journeys?.map((j) => {
            return <JourneyCard key={j.id} journey={j} showCreator />;
          })
        ) : (
          <div className="">No public journeys found</div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
