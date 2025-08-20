import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VpnKey as ResetPasswordIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { DEPARTMENTS, DEPARTMENT_LABELS } from '../../contexts/AuthContext';
import { PERMISSIONS, getRolePermissions, ROLES, hasPermission } from '../../utils/permissions';

const AdminUserManagement = () => {
  const { 
    user, 
    isLoading, 
    createUser, 
    resetUserPassword, 
    getAllUsers, 
    updateUser, 
    deleteUser,
    hasPermission
  } = useAuth();

  const [users, setUsers] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    department: '',
    role: ROLES.INSTRUCTOR, // Default to Instructor
    password: ''
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user?.permissions?.canManageUsers) {
      setUsers(getAllUsers());
    }
  }, [user, getAllUsers]);

  const handleCreateUser = async () => {
    if (!formData.username || !formData.email || !formData.name || !formData.department) {
      setSnackbar({ open: true, message: 'Please fill in all required fields', severity: 'error' });
      return;
    }

    setActionLoading(true);
    const result = await createUser(formData);
    setActionLoading(false);

    if (result.success) {
      setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
      setOpenCreateDialog(false);
      setFormData({ username: '', email: '', name: '', department: '', role: ROLES.INSTRUCTOR, password: '' });
      setUsers(getAllUsers());
    } else {
      setSnackbar({ open: true, message: result.error, severity: 'error' });
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    const result = await updateUser(selectedUser.id, {
      name: formData.name,
      department: formData.department,
      role: formData.role
    });
    setActionLoading(false);

    if (result.success) {
      setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
      setOpenEditDialog(false);
      setSelectedUser(null);
      setUsers(getAllUsers());
    } else {
      setSnackbar({ open: true, message: result.error, severity: 'error' });
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match', severity: 'error' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setSnackbar({ open: true, message: 'Password must be at least 6 characters', severity: 'error' });
      return;
    }

    setActionLoading(true);
    const result = await resetUserPassword(selectedUser.id, passwordData.newPassword);
    setActionLoading(false);

    if (result.success) {
      setSnackbar({ open: true, message: 'Password reset successfully', severity: 'success' });
      setOpenPasswordDialog(false);
      setSelectedUser(null);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } else {
      setSnackbar({ open: true, message: result.error, severity: 'error' });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    const result = await deleteUser(selectedUser.id);
    setActionLoading(false);

    if (result.success) {
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
      setOpenDeleteDialog(false);
      setSelectedUser(null);
      setUsers(getAllUsers());
    } else {
      setSnackbar({ open: true, message: result.error, severity: 'error' });
    }
  };

  const openEditUserDialog = (userToEdit) => {
    setSelectedUser(userToEdit);
    setFormData({
      username: userToEdit.username,
      email: userToEdit.email,
      name: userToEdit.name,
      department: userToEdit.department,
      role: userToEdit.role,
      password: ''
    });
    setOpenEditDialog(true);
  };

  const openResetPasswordDialog = (userToReset) => {
    setSelectedUser(userToReset);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setOpenPasswordDialog(true);
  };

  const openDeleteUserDialog = (userToDelete) => {
    setSelectedUser(userToDelete);
    setOpenDeleteDialog(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.ADMIN: return 'error'; // Red for admin
      case ROLES.CEO: return 'secondary'; // Purple for CEO  
      case ROLES.HEAD_OF_DEPARTMENT: return 'warning'; // Orange for Head of Department
      case ROLES.INSTRUCTOR: return 'primary'; // Blue for Instructor
      default: return 'default';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Debug: Check user and permissions
  const userPermissions = user ? getRolePermissions(user.role) : [];
  const hasManageUsersPermission = userPermissions.includes(PERMISSIONS.MANAGE_USERS);

  console.log('UserManagement Debug:', {
    user,
    userRole: user?.role,
    isAdmin: user?.role === 'Admin',
    userPermissions: userPermissions,
    PERMISSIONS_MANAGE_USERS: PERMISSIONS.MANAGE_USERS,
    hasManageUsersPermission: hasManageUsersPermission,
    directCheck: userPermissions.includes('manage_users'),
    permissionsArray: userPermissions
  });

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Loading user information...
        </Alert>
      </Box>
    );
  }

  // For testing: Force admin access if user role is Admin
  const isAdminUser = user.role === 'Admin';
  
  if (!isAdminUser && !hasManageUsersPermission) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You do not have permission to access user management.
          <br />
          Current role: {user?.role || 'Unknown'}
          <br />
          Expected: 'Admin', Got: '{user?.role}'
          <br />
          Has MANAGE_USERS permission: {hasManageUsersPermission ? 'Yes' : 'No'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          User Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage hospital staff accounts and permissions
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <GroupIcon sx={{ color: '#1976d2', mr: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {users.length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon sx={{ color: '#f57c00', mr: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {users.filter(u => u.role === ROLES.CEO).length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                CEOs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ color: '#388e3c', mr: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {users.filter(u => u.role === ROLES.HEAD_OF_DEPARTMENT).length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Department Heads
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ViewIcon sx={{ color: '#7b1fa2', mr: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {users.filter(u => u.role === ROLES.INSTRUCTOR).length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Instructors
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions Bar */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          User Accounts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{ 
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
            }
          }}
        >
          Create User
        </Button>
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Department</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Created</strong></TableCell>
              <TableCell><strong>Last Login</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((userItem) => (
              <TableRow key={userItem.id} hover>
                <TableCell>{userItem.name}</TableCell>
                <TableCell>{userItem.email}</TableCell>
                <TableCell>{DEPARTMENT_LABELS[userItem.department]}</TableCell>
                <TableCell>
                  <Chip 
                    label={userItem.role.toUpperCase()} 
                    color={getRoleColor(userItem.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(userItem.createdAt)}</TableCell>
                <TableCell>
                  {userItem.lastLogin ? formatDate(userItem.lastLogin) : 'Never'}
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => openEditUserDialog(userItem)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => openResetPasswordDialog(userItem)}
                    color="warning"
                    size="small"
                  >
                    <ResetPasswordIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => openDeleteUserDialog(userItem)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create User Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                label="Department"
              >
                {Object.entries(DEPARTMENTS)
                  .map(([key, value]) => (
                    <MenuItem key={value} value={value}>
                      {DEPARTMENT_LABELS[value]}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                label="Role"
              >
                <MenuItem value={ROLES.INSTRUCTOR}>Instructor</MenuItem>
                <MenuItem value={ROLES.HEAD_OF_DEPARTMENT}>Head of Department</MenuItem>
                <MenuItem value={ROLES.CEO}>CEO</MenuItem>
                <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Temporary Password (optional)"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              fullWidth
              helperText="If not provided, default password 'temp123' will be set"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateUser}
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Username"
              value={formData.username}
              fullWidth
              disabled
              helperText="Username cannot be changed"
            />
            <TextField
              label="Email"
              value={formData.email}
              fullWidth
              disabled
              helperText="Email cannot be changed"
            />
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                label="Department"
              >
                {Object.entries(DEPARTMENTS)
                  .map(([key, value]) => (
                    <MenuItem key={value} value={value}>
                      {DEPARTMENT_LABELS[value]}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                label="Role"
              >
                <MenuItem value={ROLES.INSTRUCTOR}>Instructor</MenuItem>
                <MenuItem value={ROLES.HEAD_OF_DEPARTMENT}>Head of Department</MenuItem>
                <MenuItem value={ROLES.CEO}>CEO</MenuItem>
                <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateUser}
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Update User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info">
              Resetting password for: <strong>{selectedUser?.name}</strong>
            </Alert>
            <TextField
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleResetPassword}
            variant="contained"
            color="warning"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedUser?.name}</strong>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteUser}
            variant="contained"
            color="error"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Delete User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminUserManagement;
