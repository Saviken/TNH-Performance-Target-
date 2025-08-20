import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox,
    Alert,
    CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.jsx';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';

const AuthLogin = ({ title, subtitle, subtext }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        if (error) setError(''); // Clear error when user types
    };

    const handleCheckboxChange = (event) => {
        setFormData(prev => ({
            ...prev,
            rememberMe: event.target.checked
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate required fields
            if (!formData.username || !formData.password) {
                setError('Please fill in all required fields');
                setLoading(false);
                return;
            }

            // Login without department - the user's department is already assigned
            const result = await login({
                username: formData.username,
                password: formData.password
            });
            
            if (result.success) {
                // Redirect based on user role/department
                if (result.user.role === 'admin') {
                    navigate('/dashboard'); // Admin sees main dashboard with all departments
                } else {
                    // Regular users go to their department page or dashboard
                    navigate('/dashboard');
                }
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Quick login buttons for demo purposes
    const quickLoginOptions = [
        { label: 'Admin Login', username: 'admin@hospital.com', password: 'admin123' },
        { label: 'Medical Services', username: 'medical@hospital.com', password: 'password123' },
        { label: 'Finance Manager', username: 'finance@hospital.com', password: 'password123' }
    ];

    const handleQuickLogin = (option) => {
        setFormData({
            username: option.username,
            password: option.password,
            rememberMe: false
        });
    };

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='username' mb="5px">
                            Username *
                        </Typography>
                        <CustomTextField 
                            id="username" 
                            variant="outlined" 
                            fullWidth 
                            value={formData.username}
                            onChange={handleInputChange('username')}
                            placeholder="Enter your username"
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='password' mb="5px">
                            Password *
                        </Typography>
                        <CustomTextField 
                            id="password" 
                            type="password" 
                            variant="outlined" 
                            fullWidth 
                            value={formData.password}
                            onChange={handleInputChange('password')}
                            placeholder="Enter your password"
                        />
                    </Box>

                    <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        checked={formData.rememberMe}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label="Remember this Device"
                            />
                        </FormGroup>
                        <Typography
                            component={Link}
                            to="#"
                            fontWeight="500"
                            sx={{
                                textDecoration: 'none',
                                color: 'primary.main',
                            }}
                        >
                            Forgot Password ?
                        </Typography>
                    </Stack>

                    <Box>
                        <Button
                            color="primary"
                            variant="contained"
                            size="large"
                            fullWidth
                            type="submit"
                            disabled={loading}
                            sx={{ position: 'relative' }}
                        >
                            {loading && (
                                <CircularProgress 
                                    size={20} 
                                    sx={{ 
                                        position: 'absolute',
                                        left: '50%',
                                        marginLeft: '-10px'
                                    }} 
                                />
                            )}
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </Box>

                    {/* Quick Login Demo Buttons */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" color="textSecondary" mb={1}>
                            Quick Login (Demo):
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                            {quickLoginOptions.map((option) => (
                                <Button
                                    key={option.label}
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleQuickLogin(option)}
                                    sx={{ fontSize: '0.75rem' }}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </Stack>
                        <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                            Password: password123
                        </Typography>
                    </Box>
                </Stack>
            </form>
            
            {subtitle}
        </>
    );
};

export default AuthLogin;
