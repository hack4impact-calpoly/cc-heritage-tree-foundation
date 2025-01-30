import { Box, VStack, Image, Button, Flex } from "@chakra-ui/react";
import "@/app/fonts/fonts.css";
import { LuTrees } from "react-icons/lu";
import { MdOutlineDashboard, MdOutlinePeopleAlt } from "react-icons/md";
import { IconType } from "react-icons";

const COLORS = {
  primary: "#596435",
  secondary: "#e0ee99",
  white: "white",
};

interface NavItem {
  text: string;
  icon: IconType;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    text: "Dashboard",
    icon: MdOutlineDashboard,
  },
  {
    text: "Tree Inventory",
    icon: LuTrees,
  },
  {
    text: "Volunteers",
    icon: MdOutlinePeopleAlt,
  },
];

export default function Navbar() {
  return (
    <div
      style={{
        position: "sticky",
        height: "100vh",
        width: "15rem",
        backgroundColor: COLORS.primary,
        borderTopRightRadius: "20px",
        borderBottomRightRadius: "20px",
        justifyContent: "center",
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
              width: "70%",
              height: "70%",
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
              style={{
                backgroundColor: COLORS.secondary,
                color: COLORS.primary,
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
