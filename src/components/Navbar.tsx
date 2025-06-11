"use client";
import {
  Box,
  VStack,
  Image,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import "@/app/fonts/fonts.css";
import { LuTrees } from "react-icons/lu";
import { MdOutlineDashboard, MdOutlinePeopleAlt, MdArrowOutward } from "react-icons/md";
import { FiBell, FiMenu } from "react-icons/fi";
import { IconType } from "react-icons";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation"; // Added usePathname

import { useUser } from "@clerk/nextjs";
import { isMobile } from "react-device-detect";
import UserCardContent from "./UserCardContent";

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
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const { user, isLoaded } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasMounted, setHasMounted] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Determine active button based on current path
  const activeButton = NAV_ITEMS.find((item) => pathname?.startsWith(item.path))?.text || "Dashboard";

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      setShowMobileNav(isMobile);
    }
  }, [hasMounted]);

  let role = null;
  if (isLoaded && user) {
    role = user.organizationMemberships?.[0]?.role;
  }

  const isAdmin = role === "org:admin";

  const handleNavigation = (path: string) => {
    router.push(path);
    if (showMobileNav) {
      onClose();
    }
  };

  useEffect(() => {}, [(window as any).globalUserRole]);

  // mobile navbar
  if (showMobileNav) {
    return (
      <>
        <IconButton
          aria-label="Open Navigation"
          icon={<FiMenu />}
          onClick={onOpen}
          position="fixed"
          top="10px"
          left="10px"
          zIndex="100"
          size="lg"
          colorScheme="green"
          backgroundColor={COLORS.primary}
          color={COLORS.white}
          borderRadius="50%"
        />

        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
          <DrawerOverlay />
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
                    onClick={() => handleNavigation(NavItem.path)}
                    style={{
                      backgroundColor: activeButton === NavItem.text ? COLORS.secondary : "transparent",
                      color: activeButton === NavItem.text ? COLORS.primary : COLORS.white,
                      borderRadius: "20px",
                      width: "190px",
                      height: "2.5rem",
                      justifyContent: "flex-start",
                      marginLeft: "20px",
                    }}
                    _hover={{
                      backgroundColor: activeButton === NavItem.text ? COLORS.secondary : "rgba(255,255,255,0.1)",
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
              <Box bg="white" borderRadius="lg" boxShadow="md" p={4} mx={2} my={4}>
                <UserCardContent />
              </Box>
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
        <VStack>
          {NAV_ITEMS.map((NavItem) => {
            if (NavItem.path === "/volunteers" && (!isAdmin || localStorage.getItem("globalUserRole") == "Volunteer"))
              return null;
            return (
              <Button
                key={NavItem.text}
                onClick={() => handleNavigation(NavItem.path)}
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
