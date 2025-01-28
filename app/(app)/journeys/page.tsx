"use client";

import React from "react";
import JourneyCard from "./partials/journey-card";
import Link from "next/link";
import Image from "next/image";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/common/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetchUserFavorite } from "@/hooks/user-favorite.hook";
import { useFetchUserJourneys } from "@/hooks/journey.hook";

const JourneysPage = () => {
  const router = useRouter();
  const { data: journeys, error, isLoading } = useFetchUserJourneys();
  // TODO: only fetch favorites when the "favorites" tab is selected
  const {
    data: favorites,
    isLoading: favoritesLoading,
    error: favoritesError,
  } = useFetchUserFavorite();

  if (isLoading || favoritesLoading)
    return (
      <div className="p-8">
        <Loader />
      </div>
    );
  if (error || favoritesError) return <div>Error fetching journeys data.</div>;
  if (!journeys)
    return <div className="w-full h-full flex flex-col">Data not found =(</div>;

  return (
    <div className="w-full h-full flex flex-col pt-8 md:pt-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bricolage font-semibold">Journeys</h3>
        <Button
          className="flex gap-2 px-5"
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

      <Tabs defaultValue="mine" className="w-full my-5">
        <TabsList className="w-full max-w-[450px] grid grid-cols-2">
          <TabsTrigger value="mine">Mine</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="mine">
          <div>
            {journeys.length > 0 ? (
              <div className="pt-4 grid gap-4 lg:grid-cols-2">
                {journeys.map((j) => {
                  return <JourneyCard key={j.id} journey={j} />;
                })}
              </div>
            ) : (
              <div className="mt-24 w-full flex flex-col gap-8 items-center justify-center mx-auto text-center">
                <Image
                  src="/assets/vectors/adventure.svg"
                  alt="contact-us"
                  width={200}
                  height={200}
                  className="w-full max-w-[250px] lg:max-w-[400px] h-auto mx-auto"
                />
                <Link
                  href="/create?type=journey"
                  className="text-lg font-bricolage font-medium"
                >
                  Create your first journey now!
                </Link>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="favorites">
          <div>
            {favorites && favorites?.length > 0 ? (
              <div className="pt-4 grid gap-4 lg:grid-cols-2">
                {favorites.map((j) => {
                  return <JourneyCard key={j.id} journey={j} />;
                })}
              </div>
            ) : (
              <div className="mt-24 w-full flex flex-col gap-8 items-center justify-center mx-auto text-center">
                <Image
                  src="/assets/vectors/adventure.svg"
                  alt="contact-us"
                  width={200}
                  height={200}
                  className="w-full max-w-[250px] lg:max-w-[400px] h-auto mx-auto"
                />
                <Link
                  href="/create?type=journey"
                  className="text-lg font-bricolage font-medium"
                >
                  No favorites yet.
                </Link>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JourneysPage;
