import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const navigate = useNavigate();

  // Function to fix notification URLs from backend
  const fixNotificationUrl = (url) => {
    if (!url) return '/dashboard';
    
    // If URL is already properly formatted, return as is
    if (url.startsWith('/pages/')) return url;
    
    // Fix common incorrect URLs from backend
    const urlMappings = {
      '/medical-services/': '/pages/medical-services',
      '/medical-services': '/pages/medical-services',
      '/finance/': '/pages/finance',
      '/finance': '/pages/finance',
      '/nursing-services/': '/pages/nursing-services',
      '/nursing-services': '/pages/nursing-services',
      '/ict/': '/pages/ict',
      '/ict': '/pages/ict',
      '/supply-chain/': '/pages/supply-chain',
      '/supply-chain': '/pages/supply-chain',
      '/operation/': '/pages/operation',
      '/operation': '/pages/operation',
      '/engineering/': '/pages/engineering',
      '/engineering': '/pages/engineering',
      '/security/': '/pages/security',
      '/security': '/pages/security',
      '/strategy-innovation/': '/pages/strategy-innovation',
      '/strategy-innovation': '/pages/strategy-innovation',
      '/internal-audit/': '/pages/internal-audit',
      '/internal-audit': '/pages/internal-audit',
      '/risk-compliance/': '/pages/risk-compliance',
      '/risk-compliance': '/pages/risk-compliance',
      '/legal-kha/': '/pages/legal-kha',
      '/legal-kha': '/pages/legal-kha',
      '/health-science/': '/pages/health-science',
      '/health-science': '/pages/health-science',
      '/human-resource/': '/pages/human-resource',
      '/human-resource': '/pages/human-resource'
    };
    
    return urlMappings[url] || '/dashboard';
  };

  useEffect(() => {
    // Initial fetch of notifications
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/notifications/");
        const newNotifications = res.data;
        
        // Check if there are new notifications
        if (newNotifications.length > lastNotificationCount) {
          setHasNewNotifications(true);
          // Auto-hide the "new" indicator after 10 seconds
          setTimeout(() => setHasNewNotifications(false), 10000);
        }
        
        setNotifications(newNotifications);
        setLastNotificationCount(newNotifications.length);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        // Use mock data when backend is not available
        const mockNotifications = [
          {
            id: 1,
            title: 'Strategic Objective Pending Approval',
            message: 'Medical Services strategic objective requires your approval',
            type: 'approval_request',
            is_read: false,
            created_at: '2024-08-18T10:30:00Z',
            related_url: '/pages/medical-services'
          },
          {
            id: 2,
            title: 'Unit of Measure Approved',
            message: 'Your unit of measure has been approved by the Head of Department',
            type: 'approval_granted',
            is_read: false,
            created_at: '2024-08-18T09:15:00Z',
            related_url: '/pages/medical-services'
          }
        ];
        setNotifications(mockNotifications);
        setLastNotificationCount(mockNotifications.length);
      }
    };

    fetchNotifications();

    // Set up real-time polling with shorter interval for more real-time feel
    const interval = setInterval(fetchNotifications, 3000); // Poll every 3 seconds for real-time feel

    // Optional: WebSocket implementation for true real-time (can be added later)
    // const socket = io("http://localhost:8000");
    // socket.on("new_notification", (notification) => {
    //   setNotifications(prev => [notification, ...prev]);
    // });

    return () => {
      clearInterval(interval);
      // socket.disconnect();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setHasNewNotifications(false); // Clear new notification indicator when opened
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickNotification = (notification) => {
    handleClose();
    const fixedUrl = fixNotificationUrl(notification.url);
    navigate(fixedUrl);
    // Optionally mark as read via API
    axios.patch(`http://localhost:8000/api/notifications/${notification.id}/`, { is_read: true });
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          variant={hasNewNotifications ? "dot" : "standard"}
          sx={{
            '& .MuiBadge-badge': {
              animation: hasNewNotifications ? 'pulse 1.5s infinite' : 'none',
            },
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                opacity: 1,
              },
              '50%': {
                transform: 'scale(1.1)',
                opacity: 0.7,
              },
              '100%': {
                transform: 'scale(1)',
                opacity: 1,
              },
            },
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {notifications.length === 0 ? (
          <MenuItem disabled>No notifications</MenuItem>
        ) : (
          notifications.map((n) => (
            <MenuItem
              key={n.id}
              onClick={() => handleClickNotification(n)}
              style={{ 
                fontWeight: n.is_read ? "normal" : "bold",
                backgroundColor: n.is_read ? "transparent" : "#f5f5f5",
                maxWidth: '300px',
                whiteSpace: 'normal',
                wordWrap: 'break-word'
              }}
            >
              {n.message}
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
