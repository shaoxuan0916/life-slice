import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/lib/supabase/provider";
import { Toaster } from "@/components/ui/toaster";
import GlobalStyles from "@/components/layout/GlobalStyles";

export const metadata: Metadata = {
  title: "Life Slice",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <GlobalStyles />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
