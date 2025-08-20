import React, { useState, useEffect } from 'react';
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
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  IconHeartHandshake,
  IconUsers,
  IconClock,
  IconTrendingUp,
  IconStethoscope,
  IconReportAnalytics
} from '@tabler/icons-react';
import strategicObjectivesAPI from '../../services/strategicObjectivesAPI';

const MedicalServicesObjectives = () => {
  const objectives = [
    {
      id: 1,
      title: "Patient Care Excellence",
      description: "Improve patient satisfaction scores and reduce wait times",
      progress: 82,
      status: "On Track",
      color: "success",
      target: "95% Satisfaction",
      deadline: "Q4 2024"
    },
    {
      id: 2,
      title: "Medical Equipment Upgrade",
      description: "Modernize medical equipment and technology infrastructure",
      progress: 65,
      status: "In Progress",
      color: "warning",
      target: "80% Equipment Upgrade",
      deadline: "Q3 2024"
    },
    {
      id: 3,
      title: "Staff Training Program",
      description: "Enhance medical staff competency through continuous training",
      progress: 78,
      status: "On Track",
      color: "success",
      target: "100% Staff Certified",
      deadline: "Q4 2024"
    },
    {
      id: 4,
      title: "Emergency Response Time",
      description: "Reduce emergency response time and improve critical care",
      progress: 90,
      status: "Exceeding Target",
      color: "primary",
      target: "< 5 minutes",
      deadline: "Q2 2024"
    }
  ];

  const keyMetrics = [
    { label: "Patient Satisfaction", value: "92%", icon: <IconHeartHandshake />, trend: "+7%" },
    { label: "Average Wait Time", value: "18 min", icon: <IconClock />, trend: "-15%" },
    { label: "Staff Utilization", value: "87%", icon: <IconUsers />, trend: "+5%" },
    { label: "Treatment Success", value: "94%", icon: <IconReportAnalytics />, trend: "+3%" }

  ];
 

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
  <Typography variant="h4" gutterBottom sx={{ color: '#e91e63', fontWeight: 'bold' }} className="ms-heading-title">
          Medical Services Strategic Objectives
        </Typography>
  <Typography variant="subtitle1" color="text.secondary" className="ms-heading-subtitle">
          Monitor patient care quality and medical service performance indicators
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {keyMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', bgcolor: '#fdf2f8' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ color: '#e91e63', mr: 1 }}>
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
              <IconStethoscope sx={{ mr: 1, color: '#e91e63' }} />
              Priority Actions
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <IconHeartHandshake sx={{ color: '#e91e63' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Upgrade ICU monitoring systems"
                  secondary="Due: Next Month"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <IconUsers sx={{ color: '#e91e63' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Recruit specialized nurses"
                  secondary="Due: End of Quarter"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <IconClock sx={{ color: '#e91e63' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Implement patient scheduling system"
                  secondary="Due: Next Quarter"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <IconTrendingUp sx={{ mr: 1, color: '#e91e63' }} />
              Recent Achievements
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Reduced emergency response time to 4.2 minutes"
                  secondary="Completed last month"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Achieved 92% patient satisfaction score"
                  secondary="Completed 2 weeks ago"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Completed staff certification program"
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

export default MedicalServicesObjectives;
