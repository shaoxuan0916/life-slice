"use client";

import { fetchSliceById } from "@/lib/api/slice";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import EditSliceForm from "./form";
import SlicePageHeader from "../partials/slice-page-header";

const EditSlicePage = () => {
  const { id: journeyId, sliceId } = useParams();

  const {
    data: slice,
    error,
    isLoading,
  } = useQuery<Slice>({
    queryKey: ["slice", sliceId],
    queryFn: () => fetchSliceById(sliceId as string),
    enabled: !!journeyId || !!sliceId,
  });

  if (isLoading)
    return <LoaderCircleIcon width={16} height={16} className="animate-spin" />;
  if (error) return <div>Error fetching slice data.</div>;
  if (!slice) return <div>Data not found =(</div>;

  return (
    <>
      <SlicePageHeader
        journeyId={journeyId as string}
        slice={slice}
        isEdit={true}
      />
      <EditSliceForm slice={slice} journeyId={journeyId as string} />
    </>
  );
};

export default EditSlicePage;
