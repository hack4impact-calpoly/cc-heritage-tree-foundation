"use client";
import type { Metadata } from "next";
import { ChakraProvider } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/nextjs";
import ProfileCard from "@/components/ProfileCard";

import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <ProfileCard />
          <ChakraProvider>{children}</ChakraProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
