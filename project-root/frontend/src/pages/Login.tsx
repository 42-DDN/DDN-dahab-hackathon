import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Container,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginType, setLoginType] = useState<'admin' | 'seller'>('admin');
    const { login } = useAuth();
    const navigate = useNavigate();

    const API_BASE_URL = 'http://localhost:5200';
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const loginEndpoint = `${API_BASE_URL}/api/auth/login`;
            const response = await axios.post(loginEndpoint, {
                email: username,
                password: password,
            }, {
                withCredentials: true
            });
            const usernameWithRole = `${response.data["user"]["role"]}_${username}`;
            const path = await login(usernameWithRole, password);
            navigate(path);
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: 'admin' | 'seller') => {
        setLoginType(newValue);
        setError('');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        backgroundColor: 'white',
                    }}
                >
                    <Box
                        component="img"
                        src="/unnamed.png"
                        alt="Dahab JO Logo"
                        sx={{
                            height: 100,
                            mb: 2,
                        }}
                    />

                    <Tabs
                        value={loginType}
                        onChange={handleTabChange}
                        sx={{ width: '100%', mb: 3 }}
                    >
                        <Tab
                            value="admin"
                            label="Admin Login"
                            sx={{
                                color: 'primary.main',
                                '&.Mui-selected': {
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                        <Tab
                            value="seller"
                            label="Seller Login"
                            sx={{
                                color: 'primary.main',
                                '&.Mui-selected': {
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                    </Tabs>

                    <Typography
                        component="h2"
                        variant="h5"
                        sx={{
                            color: 'primary.main',
                            marginBottom: 3,
                        }}
                    >
                        {loginType === 'admin' ? 'Admin Sign In' : 'Seller Sign In'}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', marginBottom: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'secondary.main',
                                    },
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'secondary.main',
                                    },
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                },
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Sign In'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login; 