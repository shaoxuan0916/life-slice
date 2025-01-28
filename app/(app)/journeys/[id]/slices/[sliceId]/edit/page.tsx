"use client";

import { useParams } from "next/navigation";
import React from "react";
import EditSliceForm from "./form";
import SlicePageHeader from "../partials/slice-page-header";
import { Loader } from "@/components/common/loader";
import { useFetchSliceById } from "@/hooks/slice.hook";

const EditSlicePage = () => {
  const { id: journeyId, sliceId } = useParams();

  const {
    data: slice,
    error,
    isLoading,
  } = useFetchSliceById(journeyId as string, sliceId as string);

  if (isLoading)
    return (
      <div className="p-8">
        <Loader />
      </div>
    );
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
