"use client";

import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

export const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function GlobalStyles() {
  return (
    <style jsx global>
      {`
        :root {
          --font-dmSans: ${dmSans.style.fontFamily};
          --font-bricolage: ${bricolage.style.fontFamily};
        }
      `}
    </style>
  );
}
