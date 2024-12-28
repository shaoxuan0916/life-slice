"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Loader } from "@/components/common/loader";
import { fetchUser } from "@/lib/api/user";
import EditProfileForm from "./form";

const EditProfilePage = () => {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<UserInfo[]>({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
  });

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
