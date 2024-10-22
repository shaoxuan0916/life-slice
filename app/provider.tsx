"use client";

import React, { ReactNode } from "react";
import { Toaster } from "../components/ui/toaster";
import GlobalStyles from "../components/layout/GlobalStyles";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import AuthProvider from "@/lib/supabase/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Next Theme
function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Tanstack Query
const queryClient = new QueryClient();

const RootProvider = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
        <GlobalStyles />
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};

export default RootProvider;
