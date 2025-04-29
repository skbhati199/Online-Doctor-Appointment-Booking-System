import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Box, Alert, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, setLoading, error, setError } = useAuthStore();
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from || '/dashboard';
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call an API
      // Simulating API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login - would be replaced with actual API call
      const mockUser = {
        id: 'u1',
        name: 'Test User',
        email: data.email,
        role: data.email.includes('admin') ? 'ADMIN' : 'PATIENT'
      };
      
      const mockToken = 'mock-jwt-token';
      
      login(mockToken, mockUser as any);
      toast.success('Login successful!');
      navigate(from);
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            rules={{ 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'primary.main' }}>
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
