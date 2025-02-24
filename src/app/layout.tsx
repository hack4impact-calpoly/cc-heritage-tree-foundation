"use client";
import type { Metadata } from "next";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <div style={{ display: "flex", minHeight: "100vh" }}>
            {pathName !== "/login" && pathName !== "/createAccount" && <Navbar />}
            <main
              style={{
                flexGrow: 1,
                marginLeft: pathName !== "/login" && pathName !== "/createAccount" ? "15rem" : "0",
              }}
            >
              {children}
            </main>
          </div>
        </ChakraProvider>
      </body>
    </html>
  );
}
