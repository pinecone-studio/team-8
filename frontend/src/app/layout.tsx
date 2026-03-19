import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ApolloWrapper } from "@/lib/apollo-provider";
import { CurrentEmployeeProvider } from "@/lib/current-employee-provider";
import { ThemeProvider } from "@/app/_components/ThemeProvider";
import "./globals.css";

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
    <html lang="en" className="font-sans">
      <body>
        <ClerkProvider>
          <ThemeProvider>
            <ApolloWrapper>
              <CurrentEmployeeProvider>{children}</CurrentEmployeeProvider>
            </ApolloWrapper>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
