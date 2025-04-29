import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Box, Alert, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      contactNumber: ''
    }
  });
  
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call an API
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create an Account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Full name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Name"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          
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
            name="contactNumber"
            control={control}
            rules={{ 
              required: 'Contact number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit phone number'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Contact Number"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.contactNumber}
                helperText={errors.contactNumber?.message}
              />
            )}
          />
          
          <Controller
            name="password"
            control={control}
            rules={{ 
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            }}
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
          
          <Controller
            name="confirmPassword"
            control={control}
            rules={{ 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
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
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </form>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'primary.main' }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
