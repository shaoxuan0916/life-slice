"use client";

import { fetchJourneyById } from "@/lib/api/journey";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Spinner from "@/components/common/spinner";
import JourneyPageHeader from "./partials/journey-page-header";
import { Timeline } from "@/components/ui/timeline";

interface RouteParams {
  params: {
    id: string;
  };
}

const slices: Slice[] = [
  {
    id: 1,
    journey_id: "11",
    user_id: "111",
    name: "Slice 1",
    description: "This is slice one.",
    img_urls: [
      "https://gipkzolaugsifkzdthph.supabase.co/storage/v1/object/public/journey-development/private/0ba90a99-a2fe-423a-9401-40931c51905f/uploaded_image_1729235890202-f98d64f3-57a6-4f32-ad3a-91dcd7a4e72e.png",
      "https://gipkzolaugsifkzdthph.supabase.co/storage/v1/object/public/journey-development/private/0ba90a99-a2fe-423a-9401-40931c51905f/uploaded_image_1729235890202-f98d64f3-57a6-4f32-ad3a-91dcd7a4e72e.png",
    ],
    slice_date: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    journey_id: "22",
    user_id: "222",
    name: "Slice 2",
    description: "This is slice two.",
    img_urls: [
      "https://gipkzolaugsifkzdthph.supabase.co/storage/v1/object/public/journey-development/private/0ba90a99-a2fe-423a-9401-40931c51905f/uploaded_image_1729235890202-f98d64f3-57a6-4f32-ad3a-91dcd7a4e72e.png",
      "https://gipkzolaugsifkzdthph.supabase.co/storage/v1/object/public/journey-development/private/0ba90a99-a2fe-423a-9401-40931c51905f/uploaded_image_1729235890202-f98d64f3-57a6-4f32-ad3a-91dcd7a4e72e.png",
      "https://gipkzolaugsifkzdthph.supabase.co/storage/v1/object/public/journey-development/private/0ba90a99-a2fe-423a-9401-40931c51905f/uploaded_image_1729235890202-f98d64f3-57a6-4f32-ad3a-91dcd7a4e72e.png",
    ],
    slice_date: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    journey_id: "33",
    user_id: "333",
    name: "Slice 3",
    description: "This is slice three.",
    img_urls: [
      "https://gipkzolaugsifkzdthph.supabase.co/storage/v1/object/public/journey-development/private/0ba90a99-a2fe-423a-9401-40931c51905f/uploaded_image_1729235890202-f98d64f3-57a6-4f32-ad3a-91dcd7a4e72e.png",
    ],
    slice_date: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    journey_id: "44",
    user_id: "444",
    name: "Slice 4",
    description: "This is slice four.",
    img_urls: [
      "https://gipkzolaugsifkzdthph.supabase.co/storage/v1/object/public/journey-development/private/0ba90a99-a2fe-423a-9401-40931c51905f/uploaded_image_1729235890202-f98d64f3-57a6-4f32-ad3a-91dcd7a4e72e.png",
      "https://gipkzolaugsifkzdthph.supabase.co/storage/v1/object/public/journey-development/private/0ba90a99-a2fe-423a-9401-40931c51905f/uploaded_image_1729235890202-f98d64f3-57a6-4f32-ad3a-91dcd7a4e72e.png",
      "https://gipkzolaugsifkzdthph.supabase.co/storage/v1/object/public/journey-development/private/0ba90a99-a2fe-423a-9401-40931c51905f/uploaded_image_1729235890202-f98d64f3-57a6-4f32-ad3a-91dcd7a4e72e.png",
      "https://gipkzolaugsifkzdthph.supabase.co/storage/v1/object/public/journey-development/private/0ba90a99-a2fe-423a-9401-40931c51905f/uploaded_image_1729235890202-f98d64f3-57a6-4f32-ad3a-91dcd7a4e72e.png",
    ],
    slice_date: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const JourneyPage = ({ params }: RouteParams) => {
  const journeyId = params.id;
  const {
    data: journey,
    error,
    isLoading,
  } = useQuery<Journey>({
    queryKey: ["journey", journeyId],
    queryFn: () => fetchJourneyById(journeyId),
    enabled: !!journeyId,
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>Error fetching journey data.</div>;
  if (!journey) return <div>Data not found =(</div>;

  return (
    <div className="w-full h-full flex flex-col">
      <JourneyPageHeader journey={journey} />
      <Timeline
        data={slices}
        title={journey.name}
        journeyId={journeyId}
        description={journey.description}
      />
    </div>
  );
};

export default JourneyPage;
