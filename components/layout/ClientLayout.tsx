"use client";

import React, { ReactNode } from "react";
import { Toaster } from "../ui/toaster";
import GlobalStyles from "./GlobalStyles";

const ClientLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Toaster />
      <GlobalStyles />
      {children}
    </>
  );
};

export default ClientLayout;
