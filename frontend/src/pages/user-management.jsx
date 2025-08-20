import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Typography,
  IconButton,
  Alert
} from '@mui/material';
import { Edit, Add, Visibility } from '@mui/icons-material';
import axios from 'axios';

const USER_ROLES = {
  'Instructor': {
    label: 'Instructor',
    color: 'primary',
    permissions: [
      'Enter and edit strategy, criteria, and branch',
      'Submit entries for approval to CEO',
      'Edit entries if rejected by CEO',
      'Approve/reject Unit of Measure',
      'Enter Weight, Annual Target, Cumulative target, Raw Score, Wtd Score',
      'View all submitted entries and download evidence'
    ]
  },
  'CEO': {
    label: 'CEO',
    color: 'error',
    permissions: [
      'View all submitted entries',
      'Approve or reject entries',
      'Add rejection comments',
      'Unlock entries for editing if rejected'
    ]
  },
  'HeadOfDepartment': {
    label: 'Head of Department',
    color: 'success',
    permissions: [
      'See only assigned branch information',
      'Enter Unit of Measure, Cumulative Actual, Statistical explanation',
      'Comment on rejected entries',
      'View and download historical data'
    ]
  },
  'Admin': {
    label: 'Admin',
    color: 'warning',
    permissions: [
      'Manage users and permissions',
      'View all data and logs',
      'All Instructor permissions',
      'All CEO permissions',
      'All Head of Department permissions'
    ]
  }
};

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPermissions, setOpenPermissions] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: '',
    branch: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/branches/');
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setUserForm({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role || '',
        branch: user.branch || '',
        password: ''
      });
      setSelectedUser(user);
      setEditMode(true);
    } else {
      setUserForm({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        role: '',
        branch: '',
        password: ''
      });
      setSelectedUser(null);
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setEditMode(false);
  };

  const handleFormChange = (field, value) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await axios.patch(`http://localhost:8000/api/users/${selectedUser.id}/`, userForm);
        setAlert({ open: true, message: 'User updated successfully', severity: 'success' });
      } else {
        await axios.post('http://localhost:8000/api/users/', userForm);
        setAlert({ open: true, message: 'User created successfully', severity: 'success' });
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      setAlert({ open: true, message: 'Error saving user', severity: 'error' });
    }
  };

  const handleViewPermissions = (role) => {
    setSelectedRole(role);
    setOpenPermissions(true);
  };

  const getRoleChip = (role) => {
    const roleConfig = USER_ROLES[role] || { label: role, color: 'default' };
    return (
      <Chip 
        label={roleConfig.label} 
        color={roleConfig.color} 
        size="small"
        onClick={() => handleViewPermissions(role)}
        style={{ cursor: 'pointer' }}
      />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
      </Box>

      {alert.open && (
        <Alert 
          severity={alert.severity} 
          onClose={() => setAlert({ ...alert, open: false })}
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleChip(user.role)}</TableCell>
                <TableCell>{user.branch_name || 'Not Assigned'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(user)} size="small">
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Username"
              value={userForm.username}
              onChange={(e) => handleFormChange('username', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="First Name"
              value={userForm.first_name}
              onChange={(e) => handleFormChange('first_name', e.target.value)}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={userForm.last_name}
              onChange={(e) => handleFormChange('last_name', e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                value={userForm.role}
                onChange={(e) => handleFormChange('role', e.target.value)}
                label="Role"
              >
                {Object.entries(USER_ROLES).map(([key, role]) => (
                  <MenuItem key={key} value={key}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Branch</InputLabel>
              <Select
                value={userForm.branch}
                onChange={(e) => handleFormChange('branch', e.target.value)}
                label="Branch"
              >
                <MenuItem value="">No Branch</MenuItem>
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {!editMode && (
              <TextField
                label="Password"
                type="password"
                value={userForm.password}
                onChange={(e) => handleFormChange('password', e.target.value)}
                fullWidth
                required
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={openPermissions} onClose={() => setOpenPermissions(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {USER_ROLES[selectedRole]?.label} Permissions
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Typography variant="h6" color="success.main" gutterBottom>
              Can Do:
            </Typography>
            {USER_ROLES[selectedRole]?.permissions.map((permission, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1, pl: 2 }}>
                • {permission}
              </Typography>
            ))}
            
            <Typography variant="h6" color="error.main" sx={{ mt: 3 }} gutterBottom>
              Cannot Do:
            </Typography>
            {selectedRole === 'Instructor' && (
              <>
                <Typography variant="body2" sx={{ mb: 1, pl: 2 }}>
                  • Approve or reject strategy, criteria, and branch entries
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, pl: 2 }}>
                  • Edit locked entries awaiting approval
                </Typography>
              </>
            )}
            {selectedRole === 'CEO' && (
              <Typography variant="body2" sx={{ mb: 1, pl: 2 }}>
                • Edit strategy or criteria directly
              </Typography>
            )}
            {selectedRole === 'HeadOfDepartment' && (
              <>
                <Typography variant="body2" sx={{ mb: 1, pl: 2 }}>
                  • Approve or reject entries
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, pl: 2 }}>
                  • Edit locked entries awaiting approval
                </Typography>
              </>
            )}
            {selectedRole === 'Admin' && (
              <Typography variant="body2" sx={{ mb: 1, pl: 2 }}>
                • Delete content entered
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPermissions(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagement;
