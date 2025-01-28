"use client";

import React from "react";
import { Loader } from "@/components/common/loader";
import EditProfileForm from "./form";
import { useFetchUser } from "@/hooks/user.hook";

const EditProfilePage = () => {
  const { data: user, error, isLoading } = useFetchUser();

  if (isLoading)
    return (
      <div className="p-8">
        <Loader />
      </div>
    );
  if (error) return <div>Error fetching profile data.</div>;
  if (!user) return <div>Data not found =(</div>;

  return (
    <>
      <EditProfileForm user={user[0]} />
    </>
  );
};

export default EditProfilePage;
