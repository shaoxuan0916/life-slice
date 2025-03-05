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

export default function RootLayout() {
  return (
    <html lang="en">
      <body className="font-dmSans">
        <RootProvider>
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Hi, we&apos;re sorry!</h1>
            <p className="text-lg text-muted-foreground">
              We are no longer actively developing this product.
            </p>
          </div>
          {/* {children} */}
        </RootProvider>
      </body>
    </html>
  );
}
