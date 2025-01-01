import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Email Template Manager",
  description: "Create and manage your email templates with ease",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <Providers>
              <SidebarTrigger />
              {children}
            </Providers>
          </SidebarProvider>
        </main>
      </body>
    </html>
  );
}
