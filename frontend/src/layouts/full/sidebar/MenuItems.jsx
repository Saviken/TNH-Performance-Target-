
import { IconAperture, IconLayoutDashboard, IconUsers } from '@tabler/icons-react';
import axios from 'axios';

export async function getMenuItems(userRole = null) {
  // Fetch branches from backend
  const branchesRes = await axios.get('http://localhost:8000/api/branches/');
  const branches = branchesRes.data;

  // Build menu items
  const menu = [
    {
      navlabel: true,
      subheader: 'TNH Performance Targets',
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: IconLayoutDashboard,
      href: '/dashboard',
    },
    {
      navlabel: true,
      subheader: 'Branches',
    },
    ...branches.map(branch => {
      const name = branch.name.toLowerCase();
      let href = `/branch/${branch.id}`;
      if (name.includes('medical')) {
        href = '/pages/medical-services';
      } else if (name.includes('finance')) {
        href = '/pages/finance';
      } else if (name.includes('engineering')) {
        href = '/pages/engineering';
      } else if (name.includes('college of health sciences') || name.includes('health sciences')) {
        href = '/pages/health-science';
      } else if (name.includes('operations')) {
        href = '/pages/operation';
      } else if (name.includes('strategy & innovation') || name.includes('strategy and innovation') || name.includes('strategy innovation')) {
        href = '/pages/strategy-innovation';
      } else if (name.includes('legal') && name.includes('kha')) {
        href = '/pages/legal-kha';
      } else if (name === 'ict') {
        href = '/pages/ict';
      } else if (name.includes('nursing')) {
        href = '/pages/nursing-services';
      } else if (name.includes('security')) {
        href = '/pages/security';
      } else if (name.includes('internal audit')) {
        href = '/pages/internal-audit';
      } else if (name.includes('risk') && name.includes('compliance')) {
        href = '/pages/risk-compliance';
      } else if ((name.includes('supply chain') && name.includes('distribution')) || name.includes('supply chain')) {
        href = '/pages/supply-chain';
      } else if (name.includes('human resource')) {
        href = '/pages/human-resource';
      }
      return {
        id: branch.id,
        title: branch.name,
        icon: IconAperture,
        href,
      };
    }),
  ];

  // Add admin-only menu items
  if (userRole === 'ADMIN') {
    menu.push(
      {
        navlabel: true,
        subheader: 'Administration',
      },
      {
        id: 'user-management',
        title: 'User Management',
        icon: IconUsers,
        href: '/admin/user-management',
      }
    );
  }

  return menu;
}