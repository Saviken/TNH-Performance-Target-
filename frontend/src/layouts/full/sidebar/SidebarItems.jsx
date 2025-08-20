
import  { useEffect, useState } from 'react';
import { getMenuItems } from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import { useAuth } from '../../../contexts/AuthContext';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getMenuItems(user?.role)
      .then((items) => {
        setMenuItems(items);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load menu');
        setLoading(false);
      });
  }, [user?.role]);

  if (loading) {
    return <Box sx={{ px: 3, py: 2 }}>Loading menu...</Box>;
  }

  if (error) {
    return <Box sx={{ px: 3, py: 2, color: 'red' }}>Error: {error}</Box>;
  }

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {menuItems.length === 0 && (
          <Box sx={{ py: 2, color: 'gray' }}>No menu items found.</Box>
        )}
        {menuItems.map((item) => {
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;
          } else {
            return (
              <NavItem item={item} key={item.id} pathDirect={pathDirect} />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
