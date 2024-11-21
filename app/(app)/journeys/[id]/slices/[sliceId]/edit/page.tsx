"use client";

import { fetchSliceById } from "@/lib/api/slice";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import EditSliceForm from "./form";
import SlicePageHeader from "../partials/slice-page-header";
import { Loader } from "@/components/common/loader";

const EditSlicePage = () => {
  const { id: journeyId, sliceId } = useParams();

  const {
    data: slice,
    error,
    isLoading,
  } = useQuery<Slice>({
    queryKey: ["slices", sliceId],
    queryFn: () => fetchSliceById(sliceId as string),
    enabled: !!journeyId || !!sliceId,
  });

  if (isLoading) return <Loader />;
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
