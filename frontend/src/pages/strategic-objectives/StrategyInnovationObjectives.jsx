import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { 
  IconBrain,
  IconBulb,
  IconTrendingUp,
  IconChartLine,
  IconRocket,
  IconReportAnalytics
} from '@tabler/icons-react';

const StrategyInnovationObjectives = () => {
  const objectives = [
    {
      id: 1,
      title: "Digital Transformation",
      description: "Implement digital solutions across all hospital operations",
      progress: 70,
      status: "In Progress",
      color: "warning",
      target: "100% Digital Integration",
      deadline: "Q4 2024"
    },
    {
      id: 2,
      title: "Innovation Labs",
      description: "Establish research and development labs for medical innovation",
      progress: 55,
      status: "In Progress",
      color: "warning",
      target: "3 Active Labs",
      deadline: "Q3 2024"
    },
    {
      id: 3,
      title: "Strategic Partnerships",
      description: "Form partnerships with leading medical institutions",
      progress: 85,
      status: "On Track",
      color: "success",
      target: "5 Key Partnerships",
      deadline: "Q4 2024"
    },
    {
      id: 4,
      title: "Process Innovation",
      description: "Redesign key processes for efficiency and quality improvement",
      progress: 92,
      status: "Nearly Complete",
      color: "primary",
      target: "50% Efficiency Gain",
      deadline: "Q2 2024"
    }
  ];

  const keyMetrics = [
    { label: "Innovation Projects", value: "24", icon: <IconBulb />, trend: "+8" },
    { label: "Digital Adoption", value: "78%", icon: <IconBrain />, trend: "+15%" },
    { label: "Process Efficiency", value: "43%", icon: <IconTrendingUp />, trend: "+18%" },
    { label: "ROI on Innovation", value: "2.4x", icon: <IconReportAnalytics />, trend: "+0.6x" }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
  <Typography variant="h4" gutterBottom sx={{ color: '#9c27b0', fontWeight: 'bold' }} className="ms-heading-title">
          Strategy & Innovation Strategic Objectives
        </Typography>
  <Typography variant="subtitle1" color="text.secondary" className="ms-heading-subtitle">
          Drive innovation and strategic initiatives for organizational transformation
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {keyMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', bgcolor: '#faf5ff' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ color: '#9c27b0', mr: 1 }}>
                    {metric.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {metric.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {metric.label}
                </Typography>
                <Chip 
                  label={metric.trend} 
                  size="small" 
                  color="success" 
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Strategic Objectives */}
      <Grid container spacing={3}>
        {objectives.map((objective) => (
          <Grid item xs={12} md={6} key={objective.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }} className="ms-heading-title">
                    {objective.title}
                  </Typography>
                  <Chip 
                    label={objective.status} 
                    color={objective.color} 
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }} className="ms-heading-subtitle">
                  {objective.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {objective.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={objective.progress} 
                    color={objective.color}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Target: {objective.target}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Due: {objective.deadline}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Action Items */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <IconRocket sx={{ mr: 1, color: '#9c27b0' }} />
              Priority Actions
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <IconBulb sx={{ color: '#9c27b0' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Launch AI-powered diagnostic tools"
                  secondary="Due: Next Month"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <IconBrain sx={{ color: '#9c27b0' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Establish innovation think tank"
                  secondary="Due: End of Quarter"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <IconChartLine sx={{ color: '#9c27b0' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Implement predictive analytics"
                  secondary="Due: Next Quarter"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <IconTrendingUp sx={{ mr: 1, color: '#9c27b0' }} />
              Recent Achievements
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Launched telemedicine platform"
                  secondary="Completed last month"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Signed partnership with Tech University"
                  secondary="Completed 2 weeks ago"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Reduced process time by 45%"
                  secondary="Completed this quarter"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StrategyInnovationObjectives;
