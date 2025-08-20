import React from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Button from '@mui/material/Button';

// components
import SalesOverview from './components/SalesOverview';
import YearlyBreakup from './components/YearlyBreakup';
import RecentTransactions from './components/RecentTransactions';
import ProductPerformance from './components/ProductPerformance';
import Blog from './components/Blog';
import MonthlyEarnings from './components/MonthlyEarnings';


const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Button variant="contained" color="primary" sx={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }} onClick={logout}>
          Logout
        </Button>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} lg={12}>
            <ProductPerformance />
          </Grid>
          
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
