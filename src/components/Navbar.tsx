import { Box, VStack, Image, Button, Icon } from "@chakra-ui/react";
import "@/app/fonts/fonts.css";
import { LuTrees } from "react-icons/lu";
import { MdOutlineDashboard, MdOutlinePeopleAlt } from "react-icons/md";
import { IconType } from "react-icons";

const COLORS = {
  primary: "#596435",
  secondary: "#e0ee99",
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
        width: "17rem",
        backgroundColor: COLORS.primary,
      }}
    >
      {/*Box for Logo*/}
      <Box>
        <Image
          src="/logo1.png"
          alt="Logo"
          style={{
            width: "70%",
            height: "70%",
            objectFit: "contain",
          }}
        />
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
              width: "80%",
            }}
          >
            {<NavItem.icon />}
            {NavItem.text}
          </Button>
        ))}
      </VStack>
      <div>NavBar</div>
    </div>
  );
}
