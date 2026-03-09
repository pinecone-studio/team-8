import type { Metadata } from "next";
import { ApolloWrapper } from "@/lib/apollo-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team 8",
  description: "Team 8 Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
