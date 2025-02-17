"use client";

import { Loader } from "@/components/common/loader";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import JourneyCard from "./journeys/partials/journey-card";
import Input from "@/components/common/input";
import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetchPublicJourneys } from "@/hooks/journey.hook";

const ExplorePage = () => {
  const [journeyList, setJourneyList] = useState<
    (Journey & { users: UserInfo })[]
  >([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);

  const limit = 100;

  const {
    data: journeys,
    error,
    isLoading,
    isFetching,
    isSuccess,
  } = useFetchPublicJourneys(searchQuery, page, limit);

  useEffect(() => {
    if (journeys && page === 0) {
      setJourneyList(journeys);
    } else if (journeys) {
      setJourneyList((prevJourneys) => [...prevJourneys, ...journeys]);
    }
  }, [journeys, page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (isLoading)
    return (
      <div className="p-8">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div>Error fetching journeys data. Please refresh and try again.</div>
    );

  return (
    // TODO: Infinite scroll down & enhance UI
    <div className="w-full h-full flex flex-col pt-8 md:pt-0 pb-16">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bricolage font-semibold">Explore</h3>
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

      <Tabs defaultValue="discover" className="w-full my-5">
        <TabsList className="w-full max-w-[450px] grid grid-cols-2">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>
        <TabsContent value="discover">
          <div>
            {journeyList && journeyList?.length > 0 ? (
              <div className="pt-4 grid gap-4 lg:grid-cols-2">
                {journeyList?.map((j) => {
                  return <JourneyCard key={j.id} journey={j} showCreator />;
                })}
              </div>
            ) : (
              <div className="mt-20 flex flex-col gap-8 items-center">
                <Image
                  src="/assets/vectors/no-data.svg"
                  alt="no-data"
                  width={200}
                  height={200}
                  className="w-full max-w-[200px] h-auto mx-auto"
                />
                <p className="text-lg font-bricolage font-medium">
                  No journey found.
                </p>
              </div>
            )}
          </div>
          {isSuccess && journeys?.length >= limit && !isFetching && (
            <Button
              className="w-fit mt-4 mx-auto"
              variant="outline"
              onClick={handleLoadMore}
              disabled={isFetching}
            >
              {isFetching ? "Loading..." : "Load More"}
            </Button>
          )}
        </TabsContent>
        <TabsContent value="community">
          <div className="pt-4">
            <p>No journeys found.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExplorePage;
