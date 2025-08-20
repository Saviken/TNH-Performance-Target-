import React, { useEffect, useState } from 'react';
import { 
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
  Collapse,
  CircularProgress
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  IconLayoutDashboard,
  IconAperture,
  IconSettings,
  IconUsers,
  IconTarget,
  IconChevronDown,
  IconChevronRight,
  IconCalendarStats
} from '@tabler/icons-react';
import { useAuth, DEPARTMENTS } from '../../../contexts/AuthContext.jsx';
import Logo from '../shared/logo/Logo';

const CustomSidebar = ({ open, onClose, variant = "permanent" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, getAccessibleDepartments } = useAuth();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState({});
  const [historyData, setHistoryData] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

  useEffect(() => {
    if (!historyOpen || historyData) return;
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const res = await fetch(`${apiBase}objectives/history/`);
        if (!res.ok) throw new Error(`History load failed: ${res.status}`);
        const json = await res.json();
        setHistoryData(json.years || {});
      } catch (e) {
        setHistoryError(e.message);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [historyOpen, historyData, apiBase]);

  // All available departments with their details
  const allDepartments = [
    // Divisions
    { 
      id: DEPARTMENTS.FINANCE, 
      text: 'Finance', 
      icon: IconAperture, 
      path: '/pages/finance', 
      type: 'division',
      color: '#10b981'
    },
    { 
      id: DEPARTMENTS.MEDICAL_SERVICES, 
      text: 'Medical Services', 
      icon: IconAperture, 
      path: '/pages/medical-services', 
      type: 'division',
      color: '#3b82f6'
    },
    { 
      id: DEPARTMENTS.STRATEGY_INNOVATION, 
      text: 'Strategy & Innovation', 
      icon: IconTarget, 
      path: '/pages/strategy-innovation', 
      type: 'division',
      color: '#8b5cf6'
    },
    { 
      id: DEPARTMENTS.ICT, 
      text: 'ICT', 
      icon: IconAperture, 
      path: '/pages/ict', 
      type: 'division',
      color: '#06b6d4'
    },
    { 
      id: DEPARTMENTS.NURSING_SERVICES, 
      text: 'Nursing Services', 
      icon: IconAperture, 
      path: '/pages/nursing-services', 
      type: 'division',
      color: '#ec4899'
    },
    { 
      id: DEPARTMENTS.SUPPLY_CHAIN, 
      text: 'Supply Chain', 
      icon: IconAperture, 
      path: '/pages/supply-chain', 
      type: 'division',
      color: '#f59e0b'
    },
    // Departments
    { 
      id: DEPARTMENTS.OPERATION, 
      text: 'Operation', 
      icon: IconSettings, 
      path: '/pages/operation', 
      type: 'department',
      color: '#ef4444'
    },
    { 
      id: DEPARTMENTS.LEGAL_KHA, 
      text: 'Legal KHA', 
      icon: IconAperture, 
      path: '/pages/legal-kha', 
      type: 'department',
      color: '#6366f1'
    },
    { 
      id: DEPARTMENTS.SECURITY, 
      text: 'Security', 
      icon: IconAperture, 
      path: '/pages/security', 
      type: 'department',
      color: '#64748b'
    },
    { 
      id: DEPARTMENTS.INTERNAL_AUDIT, 
      text: 'Internal Audit', 
      icon: IconAperture, 
      path: '/pages/internal-audit', 
      type: 'department',
      color: '#84cc16'
    },
    { 
      id: DEPARTMENTS.RISK_COMPLIANCE, 
      text: 'Risk & Compliance', 
      icon: IconAperture, 
      path: '/pages/risk-compliance', 
      type: 'department',
      color: '#f97316'
    },
    { 
      id: DEPARTMENTS.ENGINEERING, 
      text: 'Engineering', 
      icon: IconAperture, 
      path: '/pages/engineering', 
      type: 'department',
      color: '#14b8a6'
    },
    { 
      id: DEPARTMENTS.HEALTH_SCIENCE, 
      text: 'Health Science', 
      icon: IconAperture, 
      path: '/pages/health-science', 
      type: 'department',
      color: '#a855f7'
    },
    { 
      id: DEPARTMENTS.HUMAN_RESOURCE, 
      text: 'Human Resource', 
      icon: IconUsers, 
      path: '/pages/human-resource', 
      type: 'department',
      color: '#f43f5e'
    }
  ];

  // Get departments user can access
  const accessibleDepartmentIds = getAccessibleDepartments();
  const accessibleDepartments = allDepartments.filter(dept => 
    accessibleDepartmentIds.includes(dept.id)
  );

  // Group by type
  const divisions = accessibleDepartments.filter(dept => dept.type === 'division');
  const departments = accessibleDepartments.filter(dept => dept.type === 'department');

  // Base menu items (always visible)
  const baseMenuItems = [
    { text: 'Dashboard', icon: IconLayoutDashboard, path: '/dashboard' }
  ];

  // Strategic objectives available based on user access
  const getStrategicObjectives = () => {
    const accessibleDepartmentIds = getAccessibleDepartments();
    const strategicObjectives = [];

    if (accessibleDepartmentIds.includes(DEPARTMENTS.FINANCE)) {
      strategicObjectives.push({
        text: 'Finance Objectives',
        path: '/strategic-objectives/finance',
        icon: IconAperture,
        department: 'Finance'
      });
    }

    if (accessibleDepartmentIds.includes(DEPARTMENTS.MEDICAL_SERVICES)) {
      strategicObjectives.push({
        text: 'Medical Services Objectives',
        path: '/strategic-objectives/medical-services',
        icon: IconAperture,
        department: 'Medical Services'
      });
    }

    if (accessibleDepartmentIds.includes(DEPARTMENTS.STRATEGY_INNOVATION)) {
      strategicObjectives.push({
        text: 'Strategy & Innovation Objectives',
        path: '/strategic-objectives/strategy-innovation',
        icon: IconAperture,
        department: 'Strategy & Innovation'
      });
    }

    return strategicObjectives;
  };

  const strategicObjectives = getStrategicObjectives();

  // Admin menu items (only visible to admins)
  const adminMenuItems = isAdmin ? [
    { text: 'User Management', icon: IconUsers, path: '/admin/user-management' }
  ] : [];

  const handleNavigation = (path) => {
    navigate(path);
    if (variant === "temporary") {
      onClose();
    }
  };

  const renderMenuSection = (title, items, showChip = false) => {
    if (items.length === 0) return null;

    return (
      <>
        <Typography variant="overline" color="textSecondary" sx={{ p: 2, pb: 0 }}>
          {title} {showChip && <Chip label={items.length} size="small" />}
        </Typography>
        <List>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActive}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: item.color || 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#d97706',
                      },
                    },
                    '&:hover': {
                      backgroundColor: '#f3e8d0',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'white' : 'inherit' }}>
                    <Icon size={20} />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </>
    );
  };

  const drawerContent = (
    <Box sx={{ width: 270, height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Logo />
      </Box>
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Typography variant="overline" color="textSecondary" className="ms-heading-subtitle">
          TNH Performance Targets
        </Typography>
        {user && (
          <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 0.5 }} className="ms-heading-subtitle">
            Welcome, {user.name}
          </Typography>
        )}
      </Box>
      
      {/* Base Menu Items */}
      <List>
        {baseMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#d97706',
                    },
                  },
                  '&:hover': {
                    backgroundColor: '#f3e8d0',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : 'inherit' }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Admin Section */}
      {adminMenuItems.length > 0 && renderMenuSection('Administration', adminMenuItems)}

      {/* Strategic Objectives Section */}
      {strategicObjectives.length > 0 && (
        <>
          {adminMenuItems.length > 0 && <Divider sx={{ my: 1 }} />}
          {renderMenuSection('Strategic Objectives', strategicObjectives)}
        </>
      )}

      {/* Divisions Section */}
      {strategicObjectives.length > 0 && divisions.length > 0 && <Divider sx={{ my: 1 }} />}
      {renderMenuSection('Divisions', divisions, true)}

      {/* Departments Section */}
      {divisions.length > 0 && departments.length > 0 && <Divider sx={{ my: 1 }} />}
      {renderMenuSection('Departments', departments)}

      {/* Admin Info */}
      {isAdmin && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
              🔑 Administrator Access
            </Typography>
            <Typography variant="caption" display="block" color="textSecondary">
              You can view all departments
            </Typography>
          </Box>
        </>
      )}

      <Divider sx={{ my: 1 }} />
      {/* Performance Targets History */}
      <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => setHistoryOpen(o => !o)}>
        <Typography variant="overline" color="textSecondary" className="ms-heading-subtitle" sx={{ flexGrow: 1 }}>
          Performance Targets
        </Typography>
        {historyOpen ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
      </Box>
      <Collapse in={historyOpen} timeout="auto" unmountOnExit>
        <Box sx={{ px: 1 }}>
          {loadingHistory && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1 }}>
              <CircularProgress size={14} />
              <Typography variant="caption">Loading history...</Typography>
            </Box>
          )}
          {historyError && (
            <Typography variant="caption" color="error" sx={{ px: 2 }}>
              {historyError}
            </Typography>
          )}
          {!loadingHistory && !historyError && historyData && Object.keys(historyData).length === 0 && (
            <Typography variant="caption" sx={{ px: 2 }}>
              No historical entries
            </Typography>
          )}
          <List dense>
            {historyData && Object.keys(historyData).sort((a,b)=> b.localeCompare(a)).map(year => {
              const open = yearOpen[year];
              return (
                <React.Fragment key={year}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => setYearOpen(prev => ({ ...prev, [year]: !prev[year] }))}
                      sx={{ mx: 1, borderRadius: 1 }}
                    >
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <IconCalendarStats size={16} />
                      </ListItemIcon>
                      <ListItemText primary={year} primaryTypographyProps={{ fontSize: 13 }} />
                      {open ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List dense sx={{ pl: 3 }}>
                      {Object.keys(historyData[year]).sort((a,b)=> parseInt(a)-parseInt(b)).map(q => (
                        <ListItem key={q} disablePadding>
                          <ListItemButton
                            onClick={() => handleNavigation(`/performance/history/${year}/q${q}`)}
                            sx={{ mx: 1, borderRadius: 1 }}
                          >
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <IconTarget size={14} />
                            </ListItemIcon>
                            <ListItemText primary={`Quarter ${q}`} primaryTypographyProps={{ fontSize: 12 }} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            })}
          </List>
        </Box>
      </Collapse>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: 270,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 270,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default CustomSidebar;
