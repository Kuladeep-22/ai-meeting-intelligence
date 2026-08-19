import { useState } from "react";

import { Box, Toolbar } from "@mui/material";

import Navbar from "../components/common/Navbar";
import Sidebar, { SIDEBAR_WIDTH } from "../components/common/Sidebar";
import Footer from "../components/common/Footer";

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar
        onMenuClick={() => setOpen(true)}
      />

      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { sm: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />

        <Box
          sx={{
            p: 3,
            flexGrow: 1,
          }}
        >
          {children}
        </Box>

        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;