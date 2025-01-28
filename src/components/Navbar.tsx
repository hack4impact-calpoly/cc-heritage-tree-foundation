import style from "@/components/Navbar.module.css";
import { Box, VStack, Image, Button } from "@chakra-ui/react";
import "@/app/fonts/fonts.css";
import { LuTrees } from "react-icons/lu";
import { MdOutlineDashboard, MdOutlinePeopleAlt } from "react-icons/md";


export default function Navbar() {
  return (
    <div
      style={{
        position: "absolute",
        height: "100vh",
        width: "10%",
      }}
    >
      {/*Box for NavBar*/}
      <Box>
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
          <Button>
            <MdOutlineDashboard /> Dashboard
          </Button>
          <Button>
            <LuTrees /> Tree Inventory
          </Button>
          <Button>
            <MdOutlinePeopleAlt /> Volunteers
          </Button>
        </VStack>
      </Box>
      <div>NavBar</div>
    </div>
  );
}
