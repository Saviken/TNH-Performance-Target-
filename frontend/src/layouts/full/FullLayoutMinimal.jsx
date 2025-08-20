import React from "react";
import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

const FullLayoutMinimal = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Hospital Dashboard - Minimal Layout
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default FullLayoutMinimal;
