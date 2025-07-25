"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Navbar";
import { isMobile } from "react-device-detect";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { IUser } from "@/database/userSchema";
import { Box, Image } from "@chakra-ui/react";

function LayoutInnerContent({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const { user, isLoaded } = useUser();

  const [customUserData, setCustomUserData] = useState<IUser | null>(null);
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);
  const [isLoadingCustomUserData, setIsLoadingCustomUserData] = useState(true);

  useEffect(() => {
    setIsLoadingCustomUserData(true);
    setHasPhoneNumber(false);
    setCustomUserData(null);

    if (isLoaded && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      fetch(`/api/user/${email}`)
        .then((res) => {
          if (!res.ok) {
            console.error("Failed to fetch user data from custom DB:", res.statusText);
            return null;
          }
          return res.json();
        })
        .then((data: IUser | null) => {
          const plainData = data ? JSON.parse(JSON.stringify(data)) : null;
          setCustomUserData(plainData);
          if (plainData && plainData.phoneNumber && plainData.phoneNumber.trim() !== "") {
            setHasPhoneNumber(true);
          } else {
            setHasPhoneNumber(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setCustomUserData(null);
          setHasPhoneNumber(false);
        })
        .finally(() => {
          setIsLoadingCustomUserData(false);
        });
    } else if (isLoaded && !user) {
      setIsLoadingCustomUserData(false);
    }
  }, [user?.id, isLoaded]); // Changed from [user, isLoaded] to [user?.id, isLoaded]

  const showNavbar =
    user && !isLoadingCustomUserData && hasPhoneNumber && pathName !== "/login" && pathName !== "/signup";

  if (!isLoaded || (user && isLoadingCustomUserData)) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F4F1E8",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {showNavbar && <Navbar />}
      <main
        style={{
          backgroundColor: "#F4F1E8",
          flexGrow: 1,
          paddingLeft: showNavbar && !isMobile ? "15rem" : "0",
          width: "100%",
          height: "100%",
          minHeight: "100vh",
        }}
      >
        {isMobile && (
          <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt="48px" mb="8px">
            <Box
              borderRadius="full"
              border="1px solid #596435"
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="62px"
              height="62px"
              p="2px"
              boxSizing="border-box"
            >
              <Image src="/logo1.png" alt="Logo" style={{ width: "56px", height: "56px", objectFit: "contain" }} />
            </Box>
          </Box>
        )}
        {/* Only show user spacer on desktop/tablet */}
        {!isMobile && user && <div style={{ width: "100vw", height: "100px" }} />}
        {children}
        <div style={{ position: "absolute", top: "0", zIndex: "1000" }}>{user && !isMobile && <ProfileCard />}</div>
      </main>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ChakraProvider>
            <LayoutInnerContent>{children}</LayoutInnerContent>
          </ChakraProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
