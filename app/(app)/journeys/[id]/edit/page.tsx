"use client";

import { fetchJourneyById } from "@/lib/api/journey";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import EditJourneyForm from "./form";
import JourneyPageHeader from "../partials/journey-page-header";
import { LoaderCircleIcon } from "lucide-react";

interface RouteParams {
  params: {
    id: string;
  };
}

const EditJourneyPage = ({ params }: RouteParams) => {
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

  if (isLoading)
    return <LoaderCircleIcon width={16} height={16} className="animate-spin" />;
  if (error) return <div>Error fetching journey data.</div>;
  if (!journey) return <div>Data not found =(</div>;

  return (
    <>
      <JourneyPageHeader journey={journey} isEdit={true} />
      <EditJourneyForm journey={journey} />
    </>
  );
};

export default EditJourneyPage;
