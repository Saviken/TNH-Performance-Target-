import React, { useState } from "react";
import { styled, Box, Typography, Link, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "./sidebar/Sidebar";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "90%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 0.14,
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

const FullLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <MainWrapper className="mainwrapper">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <PageWrapper className="page-wrapper">
  {/* Header removed as requested */}

        {/* Page Content */}
        <Container
          maxWidth={false}
          sx={{ paddingTop: "8px", px: 3 }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
            <Outlet />
          </Box>
        </Container>

        {/* Footer */}
        <Box sx={{ pt: 6, pb: 3, display: "flex", justifyContent: "center" }}>
          <Typography>
             © {new Date().getFullYear()} All rights reserved
           <Link target="_blank" href="">
             {/* optional link */}
           </Link>
          </Typography>
        </Box>
        
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;
