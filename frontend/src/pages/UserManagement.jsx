import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Typography,
  Stack,
  Alert
} from '@mui/material';
import axios from 'axios';

const ROLES = [
  { value: 'Instructor', label: 'Instructor' },
  { value: 'CEO', label: 'CEO' },
  { value: 'HeadOfDepartment', label: 'Head of Department' },
  { value: 'Admin', label: 'Admin' }
];

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: '',
    branch: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/');
      setUsers(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch users' });
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/branches/');
      setBranches(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch branches' });
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.profile?.role || '',
        branch: user.profile?.branch || '',
        password: ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        role: '',
        branch: '',
        password: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      role: '',
      branch: '',
      password: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        profile: {
          role: formData.role,
          branch: formData.branch
        }
      };

      if (formData.password) {
        userData.password = formData.password;
      }

      if (editingUser) {
        await axios.put(`http://localhost:8000/api/users/${editingUser.id}/`, userData);
        setMessage({ type: 'success', text: 'User updated successfully' });
      } else {
        await axios.post('http://localhost:8000/api/users/', userData);
        setMessage({ type: 'success', text: 'User created successfully' });
      }

      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save user' });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${userId}/`);
        setMessage({ type: 'success', text: 'User deleted successfully' });
        fetchUsers();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete user' });
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'CEO': return 'error';
      case 'Admin': return 'warning';
      case 'Instructor': return 'primary';
      case 'HeadOfDepartment': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add New User
        </Button>
      </Box>

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
                <TableCell>
                  <Chip 
                    label={user.profile?.role || 'No Role'} 
                    color={getRoleColor(user.profile?.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.profile?.branch_name || 'No Branch'}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => handleOpenDialog(user)}>
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="first_name"
                label="First Name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="password"
                label={editingUser ? "New Password (leave blank to keep current)" : "Password"}
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!editingUser}
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Role"
                >
                  {ROLES.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {(formData.role === 'HeadOfDepartment' || formData.role === 'Admin') && (
                <FormControl fullWidth required>
                  <InputLabel>Branch</InputLabel>
                  <Select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    label="Branch"
                  >
                    {branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default UserManagement;
