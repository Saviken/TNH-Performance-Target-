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
  IconTrendingUp,
  IconBuildingBank,
  IconReportAnalytics,
  IconCurrencyDollar,
  IconReceipt,
  IconChartPie
} from '@tabler/icons-react';
import strategicObjectivesAPI from '../../services/strategicObjectivesAPI';

const FinanceObjectives = () => {
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
      const result = await strategicObjectivesAPI.getDepartmentStrategicData('Finance');
      
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
      'IconTrendingUp': IconTrendingUp,
      'IconBuildingBank': IconBuildingBank,
      'IconReportAnalytics': IconReportAnalytics,
      'IconCurrencyDollar': IconCurrencyDollar,
      'IconReceipt': IconReceipt,
      'IconChartPie': IconChartPie,
    };
    
    const IconComponent = iconMap[iconName] || IconBuildingBank;
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
  <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }} className="ms-heading-title">
          Finance Department Strategic Objectives
        </Typography>
  <Typography variant="subtitle1" color="text.secondary" className="ms-heading-subtitle">
          Monitor and track financial performance indicators and strategic goals
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {strategicData.key_metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', bgcolor: '#f8fafc' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ color: '#1976d2', mr: 1 }}>
                    {getIconComponent(metric.icon_name)}
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
        {strategicData.objectives.map((objective) => (
          <Grid item xs={12} md={6} key={objective.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }} className="ms-heading-title">
                    {objective.title}
                  </Typography>
                  <Chip 
                    label={getStatusLabel(objective.status)} 
                    color={getStatusColor(objective.status)} 
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
                    color={getStatusColor(objective.status)}
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
              <IconBuildingBank sx={{ mr: 1, color: '#1976d2' }} />
              Priority Actions
            </Typography>
            <List>
              {strategicData.priority_actions.map((action, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Box sx={{ color: '#1976d2' }}>
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
              <IconTrendingUp sx={{ mr: 1, color: '#1976d2' }} />
              Recent Achievements
            </Typography>
            <List>
              {strategicData.recent_achievements.map((achievement, index) => (
                <ListItem key={index}>
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

export default FinanceObjectives;
