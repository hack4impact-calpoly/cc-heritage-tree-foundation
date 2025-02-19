"use client";
import { Box, VStack, Image, Button, Flex } from "@chakra-ui/react";
import "@/app/fonts/fonts.css";
import { LuTrees } from "react-icons/lu";
import { MdOutlineDashboard, MdOutlinePeopleAlt, MdArrowOutward } from "react-icons/md";
import { FiBell } from "react-icons/fi";
import { IconType } from "react-icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js

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

  const handleNavigation = (path: string, text: string) => {
    setActiveButton(text);
    router.push(path);
  };

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
          {NAV_ITEMS.map((NavItem) => (
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
          ))}
        </VStack>
      </VStack>
    </div>
  );
}
