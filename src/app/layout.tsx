"use client";
import type { Metadata } from "next";
import { ChakraProvider } from "@chakra-ui/react";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import ProfileCard from "@/components/ProfileCard";

import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ProfileCard />
          <ChakraProvider>{children}</ChakraProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
