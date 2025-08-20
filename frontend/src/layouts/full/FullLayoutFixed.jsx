import { useState } from "react";
import { 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  useMediaQuery, 
  useTheme, 
  Container 
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { IconMenu } from '@tabler/icons-react';
import CustomSidebar from "./sidebar/CustomSidebar";
import NotificationBell from "../../components/NotificationBell.jsx";

const FullLayoutFixed = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <CustomSidebar 
          open={true} 
          onClose={() => {}} 
          variant="permanent" 
        />
      )}
      
      {/* Mobile Sidebar */}
      {isMobile && (
        <CustomSidebar 
          open={mobileOpen} 
          onClose={handleDrawerToggle} 
          variant="temporary" 
        />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - 250px)` },
          ml: { lg: 0 },
        }}
      >
        {/* Top App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            width: { lg: `calc(100% - 300px)` }, 
            ml: { lg: `250px` },
            backgroundColor: 'background.paper',
            color: 'text.primary',
            boxShadow: 1,
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <IconMenu />
                </IconButton>
              )}
              {/* <Typography variant="h6" noWrap component="div">
                TNH Performance Dashboard
              </Typography> */}
            </Box>
            <NotificationBell />
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ mt: 8, p: 0, pl: { lg: 0 }, ml: { lg: -1 } }}>
          <Container maxWidth="xl" sx={{ pl: { lg: 0 }, pr: { lg: 0 }, ml: { lg: 0 } }}>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default FullLayoutFixed;
