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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [strategicData, setStrategicData] = useState({
    objectives: [],
    key_metrics: [],
    priority_actions: [],
    recent_achievements: [],
    department_info: {}
  });

  useEffect(() => {
    fetchStrategicData();
  }, []);

  const fetchStrategicData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await strategicObjectivesAPI.getDepartmentStrategicData('Medical Services');
      
      if (result.success) {
        setStrategicData(result.data);
      } else {
        setError(result.error || 'Failed to fetch strategic data');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching strategic data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Icon mapping for dynamic icons from backend
  const getIconComponent = (iconName) => {
    const iconMap = {
      'IconHeartHandshake': IconHeartHandshake,
      'IconUsers': IconUsers,
      'IconClock': IconClock,
      'IconTrendingUp': IconTrendingUp,
      'IconStethoscope': IconStethoscope,
      'IconReportAnalytics': IconReportAnalytics,
    };
    
    const IconComponent = iconMap[iconName] || IconStethoscope;
    return <IconComponent />;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'on_track': 'success',
      'in_progress': 'warning',
      'exceeding_target': 'primary',
      'behind_schedule': 'error',
      'completed': 'success'
    };
    return colorMap[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'on_track': 'On Track',
      'in_progress': 'In Progress',
      'exceeding_target': 'Exceeding Target',
      'behind_schedule': 'Behind Schedule',
      'completed': 'Completed'
    };
    return labelMap[status] || status;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#e91e63', fontWeight: 'bold' }}>
          Medical Services Strategic Objectives
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Monitor and track progress on key medical service initiatives
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {strategicData.key_metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ color: '#e91e63', mr: 1 }}>
                    {getIconComponent(metric.icon_name)}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {metric.value}
                  </Typography>
                  <Chip 
                    label={metric.trend} 
                    color="success" 
                    size="small" 
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Strategic Objectives */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Strategic Objectives
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {strategicData.objectives.map((objective) => (
          <Grid item xs={12} md={6} key={objective.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
                    {objective.title}
                  </Typography>
                  <Chip 
                    label={getStatusLabel(objective.status)} 
                    color={getStatusColor(objective.status)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: '#f5f5f5',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#e91e63'
                      }
                    }}
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Target:</strong> {objective.target}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Due:</strong> {objective.deadline}
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
              {strategicData.priority_actions.map((action, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Box sx={{ color: '#e91e63' }}>
                      {getIconComponent(action.icon_name)}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={action.title}
                    secondary={action.due_date ? `Due: ${action.due_date}` : action.description}
                  />
                </ListItem>
              ))}
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
              {strategicData.recent_achievements.map((achievement, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Box sx={{ color: '#4caf50' }}>
                      {getIconComponent(achievement.icon_name)}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={achievement.title}
                    secondary={achievement.due_date || achievement.description}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MedicalServicesObjectives;
