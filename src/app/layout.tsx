"use client";
import type { Metadata } from "next";
import { ChakraProvider } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/nextjs";
import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Navbar";

import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ChakraProvider>
            <div style={{ display: "flex", minHeight: "100vh" }}>
              {pathName !== "/login" && pathName !== "/signup"}
              <main
                style={{
                  backgroundColor: "#F4F1E8",
                  flexGrow: 1,
                  paddingLeft:
                    pathName !== "/login" &&
                    pathName !== "/signup" &&
                    pathName !== "/messages" &&
                    pathName !== "/adminDashboard" &&
                    pathName !== "/createAnnouncement"
                    pathName !== "/volunteerDashboard" &&
                    pathName !== "/volunteers" &&
                    pathName !== "/treeTable" &&
                    pathName !== "/newTreeForm"
                      ? "15rem"
                      : "0",
                  width: "100%",
                  height: "100%",
                  minHeight: "100vh",
                }}
              >
                <ProfileCard />
                {children}
              </main>
            </div>
          </ChakraProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
