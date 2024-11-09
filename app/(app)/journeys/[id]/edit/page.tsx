"use client";

import { fetchJourneyById } from "@/lib/api/journey";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import EditJourneyForm from "./form";
import JourneyPageHeader from "../partials/journey-page-header";
import { Loader } from "@/components/common/loader";
import { useAuth } from "@/lib/supabase/provider";

interface RouteParams {
  params: {
    id: string;
  };
}

const EditJourneyPage = ({ params }: RouteParams) => {
  const journeyId = params.id;
  const { user } = useAuth();
  const {
    data: journey,
    error,
    isLoading,
  } = useQuery<Journey>({
    queryKey: ["journey", journeyId],
    queryFn: () => fetchJourneyById(journeyId),
    enabled: !!journeyId,
  });

  const isOwner = user?.id === journey?.user_id;

  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching journey data.</div>;
  if (!journey) return <div>Data not found =(</div>;

  return (
    <>
      <JourneyPageHeader journey={journey} isEdit={true} isOwner={isOwner} />
      <EditJourneyForm journey={journey} />
    </>
  );
};

export default EditJourneyPage;
