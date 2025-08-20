import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

const DashboardSimple = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Typography variant="h4">Dashboard is Working!</Typography>
        <Typography variant="body1">
          If you can see this message, the basic dashboard routing is working correctly.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default DashboardSimple;
