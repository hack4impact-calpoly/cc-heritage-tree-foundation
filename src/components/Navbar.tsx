"use client";
import {
  Box,
  VStack,
  Image,
  Button,
  Flex,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import "@/app/fonts/fonts.css";
import { LuTrees } from "react-icons/lu";
import { MdOutlineDashboard, MdOutlinePeopleAlt, MdArrowOutward } from "react-icons/md";
import { FiBell, FiMenu } from "react-icons/fi";
import { IconType } from "react-icons";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js

import { useUser } from "@clerk/nextjs";
import { isMobile } from "react-device-detect";

const COLORS = {
  primary: "#596435",
  secondary: "#e0ee99",
  white: "white",
};

interface NavItem {
  id: number;
  text: string;
  icon: IconType;
  path: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    id: 1,
    text: "Dashboard",
    icon: MdOutlineDashboard,
    path: "/adminDashboard",
  },
  {
    id: 2,
    text: "Tree Inventory",
    icon: LuTrees,
    path: "/treeTable",
  },
  {
    id: 3,
    text: "Volunteers",
    icon: MdOutlinePeopleAlt,
    path: "/volunteers",
  },
  {
    id: 4,
    text: "Messages",
    icon: FiBell,
    path: "/messages",
  },
  {
    id: 5,
    text: "Map",
    icon: MdArrowOutward,
    path: "/map",
  },
];

export default function Navbar() {
  const [activeButton, setActiveButton] = useState("Dashboard");
  const router = useRouter(); // Initialize the router
  const { user, isLoaded } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  let role = null;
  if (isLoaded && user) {
    role = user.organizationMemberships?.[0]?.role;
  }

  const isAdmin = role === "org:admin";
  const handleNavigation = (path: string, text: string) => {
    setActiveButton(text);
    router.push(path);
    if (isMobile) {
      onClose(); // Close the drawer when navigating on mobile
    }
  };

  // mobile navbar
  if (isMobile) {
    return (
      <>
        {/* Mobile Header Bar */}
        <Box position="fixed" top="0" left="0" width="100%" height="120px" zIndex="90" backgroundColor="#F4F1E8">
          {/* Menu Button */}
          <IconButton
            aria-label="Open Navigation"
            icon={<FiMenu />}
            onClick={onOpen}
            position="absolute"
            left="10px"
            top="50%"
            transform="translateY(-50%)"
            zIndex="100"
            size="lg"
            backgroundColor="transparent"
          />

          <Box
            position="absolute"
            left="50%"
            top="50%"
            transform="translate(-50%, -50%)"
            width="50px"
            height="50px"
            borderRadius="full"
            backgroundColor="transparent"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderWidth="1px"
            borderColor={COLORS.primary}
          >
            <Image src="/logo1.png" alt="Tree Logo" width="36px" height="36px" objectFit="contain" />
          </Box>
        </Box>

        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
          <DrawerOverlay style={{ backgroundColor: "transparent" }} />
          <DrawerContent
            backgroundColor={COLORS.primary}
            borderTopRightRadius="30px"
            borderBottomRightRadius="30px"
            maxWidth="270px"
          >
            <DrawerHeader pt={6}>
              <VStack spacing={2}>
                <Box
                  style={{
                    backgroundColor: "white",
                    borderRadius: "100%",
                    height: "5rem",
                    width: "5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src="/logo1.png"
                    alt="Logo"
                    style={{
                      width: "80%",
                      height: "80%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Box
                  style={{
                    color: COLORS.white,
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: "medium",
                    marginTop: "8px",
                  }}
                >
                  Central Coast Heritage
                  <br />
                  Tree Foundation
                </Box>
              </VStack>
            </DrawerHeader>
            <DrawerBody>
              <VStack spacing={3} align="stretch" mt={4}>
                {NAV_ITEMS.map((NavItem) => (
                  <Button
                    key={NavItem.text}
                    onClick={() => handleNavigation(NavItem.path, NavItem.text)}
                    style={{
                      backgroundColor: activeButton === NavItem.text ? COLORS.secondary : "transparent",
                      color: activeButton === NavItem.text ? COLORS.primary : COLORS.white,
                      borderRadius: "20px",
                      width: "187px",
                      height: "2.5rem",
                      justifyContent: "flex-start",
                      marginLeft: "20px",
                    }}
                  >
                    <NavItem.icon
                      size={20}
                      style={{
                        marginRight: "12px",
                      }}
                    />
                    {NavItem.text}
                  </Button>
                ))}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        height: "100vh",
        width: "15rem",
        backgroundColor: COLORS.primary,
        borderTopRightRadius: "20px",
        borderBottomRightRadius: "20px",
        padding: "20px",
        justifyContent: "center",
        zIndex: "100",
      }}
    >
      <VStack>
        <Box
          style={{
            backgroundColor: "white",
            borderRadius: "100%",
            height: "5rem",
            width: "5rem",
            alignContent: "center",
            marginTop: "1rem",
          }}
        >
          <Image
            src="/logo1.png"
            alt="Logo"
            style={{
              width: "100%",
              height: "85%",
              objectFit: "contain",
              justifySelf: "center",
            }}
          />
        </Box>
        <Box
          style={{
            color: COLORS.white,
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Central Coast Heritage
          <br />
          Tree Foundation
        </Box>
        {/*VStack for Items*/}
        <VStack>
          {NAV_ITEMS.map((NavItem) => {
            if (NavItem.path === "/volunteers" && !isAdmin) return null;
            return (
              <Button
                key={NavItem.text}
                onClick={() => handleNavigation(NavItem.path, NavItem.text)}
                style={{
                  backgroundColor: activeButton === NavItem.text ? COLORS.secondary : COLORS.primary,
                  color: activeButton === NavItem.text ? COLORS.primary : COLORS.white,
                  borderRadius: "20px",
                  width: "100%",
                  height: "2rem",
                  justifyContent: "left",
                  marginTop: "1rem",
                }}
              >
                <NavItem.icon
                  size="25"
                  style={{
                    marginRight: "0.5rem",
                  }}
                />
                {NavItem.text}
              </Button>
            );
          })}
        </VStack>
      </VStack>
    </div>
  );
}
