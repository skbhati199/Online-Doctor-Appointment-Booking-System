import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Box, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { login, setLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  
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
      
      const response = await authService.login(data);
      
      login(response.token, response.user);
      toast.success('Login successful!');
      
      // Redirect based on user role
      if (response.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (response.user.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex items-center justify-center min-h-[80vh]">
      <Paper elevation={3} className="p-8 max-w-md w-full">
        <Typography variant="h4" component="h1" className="mb-6 text-center font-bold text-primary-600">
          Login to MedBook
        </Typography>
        
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            className="mt-4 py-3"
          >
            Login
          </Button>
        </form>
        
        <Box className="mt-4 text-center">
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:underline">
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
