import "./globals.css";
import type { Metadata, Viewport } from "next";
import RootProvider from "./provider";

export const metadata: Metadata = {
  title: "Life Slice",
  description: "",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-dmSans">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
