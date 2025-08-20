import React from 'react';
import { CssBaseline, ThemeProvider, Typography, Box } from '@mui/material';
import { baselightTheme } from "./theme/DefaultColors.jsx";

function AppDebug() {
  const theme = baselightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          MUI Theme Test
        </Typography>
        <Typography variant="body1">
          If you can see this styled text, MUI and the theme are working correctly.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default AppDebug;
