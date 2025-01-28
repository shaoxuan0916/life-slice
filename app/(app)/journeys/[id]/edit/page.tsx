"use client";

import React from "react";
import EditJourneyForm from "./form";
import JourneyPageHeader from "../partials/journey-page-header";
import { Loader } from "@/components/common/loader";
import { useAuth } from "@/lib/supabase/provider";
import { useFetchJourneyById } from "@/hooks/journey.hook";

interface RouteParams {
  params: {
    id: string;
  };
}

const EditJourneyPage = ({ params }: RouteParams) => {
  const journeyId = params.id;
  const { user } = useAuth();
  const { data: journey, error, isLoading } = useFetchJourneyById(journeyId);

  const isOwner = user?.id === journey?.user_id;

  if (isLoading)
    return (
      <div className="p-8">
        <Loader />
      </div>
    );
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
