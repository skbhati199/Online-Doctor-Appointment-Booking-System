import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Paper, TextField, Button, 
  FormControl, FormHelperText, CircularProgress, Alert
} from '@mui/material';
import { Grid } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';

// Mock doctor data for demonstration
const mockDoctors = [
  {
    id: 'd1',
    name: 'Dr. John Smith',
    specialization: 'Cardiology',
    qualification: 'MD, MBBS',
    experience: '15 years',
    contactNumber: '1234567890',
    email: 'john.smith@example.com',
    isAvailable: true
  },
  {
    id: 'd2',
    name: 'Dr. Emily Johnson',
    specialization: 'Neurology',
    qualification: 'MD, PhD',
    experience: '10 years',
    contactNumber: '2345678901',
    email: 'emily.johnson@example.com',
    isAvailable: true
  }
];

interface BookingFormData {
  appointmentTime: Date;
  notes: string;
}

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
    defaultValues: {
      appointmentTime: new Date(),
      notes: ''
    }
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast.info('Please log in to book an appointment');
      navigate('/login', { state: { from: `/booking/${doctorId}` } });
      return;
    }
    
    // Fetch doctor details
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const foundDoctor = mockDoctors.find(doc => doc.id === doctorId);
        if (foundDoctor) {
          setDoctor(foundDoctor);
        } else {
          setError('Doctor not found');
        }
      } catch (err) {
        setError('Failed to load doctor details');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId, isAuthenticated, navigate]);

  const onSubmit = async (_data: BookingFormData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Appointment booked successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to book appointment');
      toast.error('Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/doctors')}
        >
          Back to Doctors
        </Button>
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert severity="warning">Doctor not found</Alert>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/doctors')}
        >
          Back to Doctors
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Book Appointment
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Grid component="div" container spacing={3}>
        <Grid component="div" xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Doctor Details
            </Typography>
            <Typography variant="body1">
              <strong>Name:</strong> {doctor.name}
            </Typography>
            <Typography variant="body1">
              <strong>Specialization:</strong> {doctor.specialization}
            </Typography>
            <Typography variant="body1">
              <strong>Qualification:</strong> {doctor.qualification}
            </Typography>
            <Typography variant="body1">
              <strong>Experience:</strong> {doctor.experience}
            </Typography>
          </Grid>
          
          <Grid component="div" xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Appointment Details
            </Typography>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="appointmentTime"
                control={control}
                rules={{ required: 'Appointment time is required' }}
                render={({ field }) => (
                  <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.appointmentTime}>
                    <DateTimePicker
                      label="Appointment Date & Time"
                      value={field.value}
                      onChange={(date) => date && field.onChange(date)}
                      slotProps={{ 
                        textField: { 
                          fullWidth: true,
                          variant: 'outlined', 
                          error: !!errors.appointmentTime
                        } 
                      }}
                    />
                    {errors.appointmentTime && (
                      <FormHelperText>{errors.appointmentTime.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Additional Notes"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    placeholder="Any specific concerns or information for the doctor?"
                    sx={{ mb: 3 }}
                  />
                )}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={submitting}
                sx={{ py: 1.5 }}
              >
                {submitting ? <CircularProgress size={24} /> : 'Book Appointment'}
              </Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default BookAppointment;
