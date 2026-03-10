import type { ReactNode } from "react";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "EBMS Employee Portal",
  description: "Auth.js bridge and employee dashboard for EBMS."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
