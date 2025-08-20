import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRolePermissions, hasPermission, canViewBranch, PERMISSIONS, ROLES } from '../utils/permissions';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Department and role definitions
export const DEPARTMENTS = {
  ADMIN: 'admin',
  FINANCE: 'finance',
  MEDICAL_SERVICES: 'medical-services',
  STRATEGY_INNOVATION: 'strategy-innovation',
  ICT: 'ict',
  NURSING_SERVICES: 'nursing-services',
  SUPPLY_CHAIN: 'supply-chain',
  OPERATION: 'operation',
  LEGAL_KHA: 'legal-kha',
  SECURITY: 'security',
  INTERNAL_AUDIT: 'internal-audit',
  RISK_COMPLIANCE: 'risk-compliance',
  ENGINEERING: 'engineering',
  HEALTH_SCIENCE: 'health-science',
  HUMAN_RESOURCE: 'human-resource'
};

export const DEPARTMENT_LABELS = {
  [DEPARTMENTS.ADMIN]: 'Administration',
  [DEPARTMENTS.FINANCE]: 'Finance',
  [DEPARTMENTS.MEDICAL_SERVICES]: 'Medical Services',
  [DEPARTMENTS.STRATEGY_INNOVATION]: 'Strategy & Innovation',
  [DEPARTMENTS.ICT]: 'ICT',
  [DEPARTMENTS.NURSING_SERVICES]: 'Nursing Services',
  [DEPARTMENTS.SUPPLY_CHAIN]: 'Supply Chain',
  [DEPARTMENTS.OPERATION]: 'Operation',
  [DEPARTMENTS.LEGAL_KHA]: 'Legal KHA',
  [DEPARTMENTS.SECURITY]: 'Security',
  [DEPARTMENTS.INTERNAL_AUDIT]: 'Internal Audit',
  [DEPARTMENTS.RISK_COMPLIANCE]: 'Risk & Compliance',
  [DEPARTMENTS.ENGINEERING]: 'Engineering',
  [DEPARTMENTS.HEALTH_SCIENCE]: 'Health Science',
  [DEPARTMENTS.HUMAN_RESOURCE]: 'Human Resource'
};

// Helper function to get user permissions based on department and role
const getUserPermissions = (department, role) => {
  const basePermissions = {
    canViewDashboard: true,
    canViewStrategicObjectives: true,
    canEditObjectives: false,
    canManageUsers: false,
    canViewReports: true,
    canResetPasswords: false,
    canCreateUsers: false,
    canAccessAllDepartments: false,
    canApproveReject: false,
    canEnterStrategy: false,
    canEnterUnitOfMeasure: false,
    canViewOwnBranchOnly: false,
    canDownloadEvidence: false
  };

  if (role === ROLES.ADMIN) {
    return {
      ...basePermissions,
      canEditObjectives: true,
      canManageUsers: true,
      canAccessAllDepartments: true,
      canResetPasswords: true,
      canCreateUsers: true,
      canApproveReject: true,
      canEnterStrategy: true,
      canEnterUnitOfMeasure: true,
      canDownloadEvidence: true
    };
  }

  if (role === ROLES.INSTRUCTOR) {
    return {
      ...basePermissions,
      canEditObjectives: true,
      canEnterStrategy: true,
      canApproveReject: false, // Can approve Unit of Measure but not strategy/criteria
      canDownloadEvidence: true,
      canAccessAllDepartments: true
    };
  }

  if (role === ROLES.CEO) {
    return {
      ...basePermissions,
      canViewAllEntries: true,
      canApproveReject: true,
      canAddComments: true,
      canUnlockEntries: true,
      canAccessAllDepartments: true
    };
  }

  if (role === ROLES.HEAD_OF_DEPARTMENT) {
    return {
      ...basePermissions,
      canEnterUnitOfMeasure: true,
      canViewOwnBranchOnly: true,
      canDownloadEvidence: true,
      canAddComments: true
    };
  }

  return basePermissions;
};

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock users database - in real app, this would be stored in backend
  const [mockUsers, setMockUsers] = useState([
    {
      id: 1,
      username: 'admin@hospital.com',
      email: 'admin@hospital.com',
      password: 'admin123',
      department: DEPARTMENTS.ADMIN,
      role: ROLES.ADMIN,
      name: 'System Administrator',
      branch: null,
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date(),
      permissions: null // Will be set after initialization
    },
    {
      id: 2,
      username: 'finance@hospital.com',
      email: 'finance@hospital.com',
      password: 'password123',
      department: DEPARTMENTS.FINANCE,
      role: ROLES.INSTRUCTOR,
      name: 'Finance Instructor',
      branch: 'Finance',
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date(),
      permissions: getUserPermissions(ROLES.INSTRUCTOR)
    },
    {
      id: 3,
      username: 'medical@hospital.com',
      email: 'medical@hospital.com',
      password: 'password123',
      department: DEPARTMENTS.MEDICAL_SERVICES,
      role: ROLES.HEAD_OF_DEPARTMENT,
      name: 'Medical Services Head',
      branch: 'Medical Services',
      createdAt: new Date('2024-01-20'),
      lastLogin: new Date(),
      permissions: getUserPermissions(ROLES.HEAD_OF_DEPARTMENT)
    },
    {
      id: 4,
      username: 'ceo@hospital.com',
      email: 'ceo@hospital.com',
      password: 'password123',
      department: DEPARTMENTS.ADMIN,
      role: ROLES.CEO,
      name: 'Chief Executive Officer',
      branch: null,
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date(),
      permissions: getUserPermissions(ROLES.CEO)
    }
  ]);

  // Initialize user state - for testing, directly set admin user
  const adminUser = {
    id: 1,
    username: 'admin@hospital.com',
    email: 'admin@hospital.com',
    password: 'admin123',
    department: DEPARTMENTS.ADMIN,
    role: ROLES.ADMIN, // Use the imported ROLES constant
    name: 'System Administrator',
    branch: null,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    permissions: getRolePermissions(ROLES.ADMIN)
  };
  
  const [user, setUser] = useState(adminUser);

  useEffect(() => {
    console.log('AuthContext: Initial user set:', adminUser);
    console.log('AuthContext: User role:', adminUser.role);
    console.log('AuthContext: Admin permissions:', getRolePermissions(adminUser.role));
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      // This would typically be an API call
      const { username, password } = credentials;
      
      // Find user in mock database by username/email and password
      const foundUser = mockUsers.find(u => 
        (u.username === username || u.email === username) && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid username/email or password');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update last login
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date()
      };
      
      setUser(updatedUser);
      localStorage.setItem('hospital_user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Admin function to create new user
  const createUser = async (userData) => {
    const userPermissions = getRolePermissions(user?.role);
    
    if (!user?.role || !userPermissions.includes(PERMISSIONS.MANAGE_USERS)) {
      throw new Error('Insufficient permissions to create users');
    }
    
    try {
      setIsLoading(true);
      
      // Check if user already exists in local mock data
      const existingUser = mockUsers.find(u => u.username === userData.username || u.email === userData.email);
      if (existingUser) {
        throw new Error('User with this username or email already exists');
      }
      
      // Try to create user in backend API
      try {
        const response = await fetch('http://127.0.0.1:8000/api/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: userData.username,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            department: userData.department,
            branch: userData.branch || null
          })
        });
        
        if (response.ok) {
          const backendUser = await response.json();
          console.log('User created in backend:', backendUser);
        } else {
          console.warn('Backend user creation failed, continuing with frontend only');
        }
      } catch (backendError) {
        console.warn('Backend API not available, continuing with frontend only:', backendError);
      }
      
      // Create new user in frontend mock data
      const newUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        password: userData.password || 'temp123', // Default temp password
        department: userData.department,
        role: userData.role || ROLES.HEAD_OF_DEPARTMENT,
        name: userData.name,
        branch: userData.branch,
        createdAt: new Date(),
        lastLogin: null,
        permissions: getUserPermissions(userData.role || ROLES.HEAD_OF_DEPARTMENT)
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to mock database
      setMockUsers(prev => [...prev, newUser]);
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Admin function to reset user password
  const resetUserPassword = async (userId, newPassword) => {
    if (!user?.permissions?.canResetPasswords) {
      throw new Error('Insufficient permissions to reset passwords');
    }
    
    try {
      setIsLoading(true);
      
      // Find user to update
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update password
      setMockUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, password: newPassword } : u
      ));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Admin function to get all users
  const getAllUsers = () => {
    if (!user?.permissions?.canManageUsers) {
      return [];
    }
    return mockUsers.filter(u => u.department !== DEPARTMENTS.ADMIN); // Don't show other admins
  };

  // Admin function to update user
  const updateUser = async (userId, updates) => {
    if (!user?.permissions?.canManageUsers) {
      throw new Error('Insufficient permissions to update users');
    }
    
    try {
      setIsLoading(true);
      
      // Find user to update
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user
      setMockUsers(prev => prev.map(u => 
        u.id === userId ? { 
          ...u, 
          ...updates,
          permissions: updates.department || updates.role ? 
            getUserPermissions(updates.role || u.role) : 
            u.permissions
        } : u
      ));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Admin function to delete user
  const deleteUser = async (userId) => {
    if (!user?.permissions?.canManageUsers) {
      throw new Error('Insufficient permissions to delete users');
    }
    
    try {
      setIsLoading(true);
      
      // Don't allow deleting admin users
      const userToDelete = mockUsers.find(u => u.id === userId);
      if (userToDelete?.role === ROLES.ADMIN) {
        throw new Error('Cannot delete admin users');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove user
      setMockUsers(prev => prev.filter(u => u.id !== userId));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hospital_user');
  };

  const hasPermission = (permission) => {
    return user?.permissions?.[permission] || false;
  };

  const canAccessDepartment = (department) => {
    if (!user) return false;
    if (user.permissions?.canAccessAllDepartments) return true;
    return user.department === department;
  };

  const getAccessibleDepartments = () => {
    if (!user) return [];
    
    // Admin can access all departments
    if (user.permissions?.canAccessAllDepartments) {
      return Object.values(DEPARTMENTS).filter(dept => dept !== DEPARTMENTS.ADMIN);
    }
    
    // Regular users can only access their own department
    return [user.department];
  };

  const isAdmin = () => {
    return user?.role === ROLES.ADMIN || user?.permissions?.canAccessAllDepartments || false;
  };

  const isInstructor = () => {
    return user?.role === ROLES.INSTRUCTOR;
  };

  const isCEO = () => {
    return user?.role === ROLES.CEO;
  };

  const isHeadOfDepartment = () => {
    return user?.role === ROLES.HEAD_OF_DEPARTMENT;
  };

  const canEnterStrategy = () => {
    return user?.role === ROLES.INSTRUCTOR || user?.role === ROLES.ADMIN;
  };

  const canApproveStrategy = () => {
    return user?.role === ROLES.CEO || user?.role === ROLES.ADMIN;
  };

  const canEnterUnitOfMeasure = () => {
    return user?.role === ROLES.HEAD_OF_DEPARTMENT || user?.role === ROLES.ADMIN;
  };

  const canApproveUnitOfMeasure = () => {
    return user?.role === ROLES.INSTRUCTOR || user?.role === ROLES.ADMIN;
  };

  const canViewOwnBranchOnly = () => {
    return user?.role === ROLES.HEAD_OF_DEPARTMENT && !user?.permissions?.canAccessAllDepartments;
  };

  const canDownloadEvidence = () => {
    return user?.role === ROLES.INSTRUCTOR || user?.role === ROLES.ADMIN || user?.role === ROLES.HEAD_OF_DEPARTMENT;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    createUser,
    resetUserPassword,
    getAllUsers,
    updateUser,
    getAccessibleDepartments,
    isAdmin,
    isInstructor,
    isCEO,
    isHeadOfDepartment,
    canEnterStrategy,
    canApproveStrategy,
    canEnterUnitOfMeasure,
    canApproveUnitOfMeasure,
    canViewOwnBranchOnly,
    canDownloadEvidence,
    canAccessDepartment,
    hasPermission: (permission) => hasPermission(user?.role, permission),
    canViewBranch: (targetBranch) => canViewBranch(user?.role, user?.branch, targetBranch),
    getUserPermissions: () => getRolePermissions(user?.role),
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
