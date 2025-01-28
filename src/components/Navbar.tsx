import { Box, VStack, Image, Button, Icon } from "@chakra-ui/react";
import "@/app/fonts/fonts.css";
import { LuTrees } from "react-icons/lu";
import { MdOutlineDashboard, MdOutlinePeopleAlt } from "react-icons/md";
import { IconType } from "react-icons";

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
        position: "absolute",
        height: "100vh",
        width: "10%",
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
          <Button key={NavItem.text}>
            {<NavItem.icon />}
            {NavItem.text}
          </Button>
        ))}
      </VStack>
      <div>NavBar</div>
    </div>
  );
}
