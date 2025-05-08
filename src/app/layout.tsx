"use client";
import type { Metadata } from "next";
import React, { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/nextjs";
import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Navbar";
import { isMobile } from "react-device-detect";
import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsMobileDevice(isMobile);
  }, []);

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ChakraProvider>
            <div style={{ display: "flex", minHeight: "100vh" }}>
              {pathName !== "/login" && pathName !== "/signup" && <Navbar />}
              <main
                style={{
                  backgroundColor: "#F4F1E8",
                  flexGrow: 1,
                  paddingLeft: pathName !== "/login" && pathName !== "/signup" && !isMobileDevice ? "15rem" : "0",
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
