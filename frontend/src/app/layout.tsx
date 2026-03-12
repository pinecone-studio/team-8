import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ApolloWrapper } from "@/lib/apollo-provider";
import { CurrentEmployeeProvider } from "@/lib/current-employee-provider";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Team 8",
  description: "Team 8 Application",
};

type LayoutProps = {
  children: React.ReactNode;
  params?: Promise<Record<string, string | string[]>>;
};
export default async function RootLayout({ children, params }: LayoutProps) {
  if (params) await params;
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <ClerkProvider>
          <ApolloWrapper>
            <CurrentEmployeeProvider>{children}</CurrentEmployeeProvider>
          </ApolloWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}
