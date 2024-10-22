"use client";

import React, { useState } from "react";
import CreateJourneyForm from "./form/create-journey-form";
import CreateSliceForm from "./form/create-slice-form";
import TypeSelect from "./partials/type-select";
import { useSearchParams } from "next/navigation";

const CreatePage = () => {
  const searchParams = useSearchParams();
  const createType = searchParams.get("type");
  const [type, setType] = useState<string | null>(createType || null);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {!type ? (
        <>
          <p className="mb-8 text-xl md:text-2xl font-medium font-bricolage">
            What do you want to create?
          </p>
          <TypeSelect type={type} onSelect={(value) => setType(value)} />
        </>
      ) : (
        renderForm(type)
      )}
    </div>
  );
};

export default CreatePage;

const renderForm = (type: string) => {
  switch (type.toUpperCase()) {
    case "JOURNEY":
      return <CreateJourneyForm />;
    case "SLICE":
      return <CreateSliceForm />;
    default:
      break;
  }
};
