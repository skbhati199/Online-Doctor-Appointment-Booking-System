import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, CardActions, Button, 
  FormControl, InputLabel, Select, MenuItem, CircularProgress,
  Chip, Avatar, Divider, Paper, SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';

// Define Doctor interface
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: string;
  contactNumber: string;
  email: string;
  isAvailable: boolean;
}

// Mock data for demonstration
const mockDoctors: Doctor[] = [
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
  },
  {
    id: 'd3',
    name: 'Dr. Michael Chen',
    specialization: 'Orthopedics',
    qualification: 'MBBS, MS',
    experience: '8 years',
    contactNumber: '3456789012',
    email: 'michael.chen@example.com',
    isAvailable: false
  },
  {
    id: 'd4',
    name: 'Dr. Sarah Williams',
    specialization: 'Dermatology',
    qualification: 'MD',
    experience: '12 years',
    contactNumber: '4567890123',
    email: 'sarah.williams@example.com',
    isAvailable: true
  }
];

const mockSpecializations: string[] = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Dermatology',
  'General Medicine',
  'Pediatrics',
  'Gynecology'
];

const DoctorList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Simulate API call to fetch doctors
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDoctors(mockDoctors);
        setSpecializations(mockSpecializations);
        setError(null);
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);

  const handleSpecializationChange = (event: SelectChangeEvent) => {
    setSelectedSpecialization(event.target.value);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleBookAppointment = (doctorId: string) => {
    navigate(`/booking/${doctorId}`);
  };

  // Filter doctors based on selected specialization
  const filteredDoctors = doctors.filter((doctor: Doctor) => {
    if (!selectedSpecialization) return true;
    return doctor.specialization === selectedSpecialization;
  });

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Find Doctors
      </Typography>
      
      {/* Filter Section */}
      <Paper sx={{ mb: 4, p: 3, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 5' } }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="specialization-label">Specialization</InputLabel>
              <Select
                labelId="specialization-label"
                value={selectedSpecialization}
                onChange={handleSpecializationChange}
                label="Specialization"
              >
                <MenuItem value="">All Specializations</MenuItem>
                {specializations.map((spec) => (
                  <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 5' } }}>
            <DatePicker
              label="Appointment Date"
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
            />
          </Grid>
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 2' } }}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={() => {
                setSelectedSpecialization('');
                setSelectedDate(new Date());
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Results Section */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ my: 4 }}>{error}</Typography>
      ) : filteredDoctors.length === 0 ? (
        <Typography sx={{ my: 4 }}>No doctors found matching your criteria.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredDoctors.map((doctor) => (
            <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }} key={doctor.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {doctor.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" component="h2">
                      {doctor.name}
                    </Typography>
                  </Box>
                  
                  <Chip 
                    label={doctor.specialization} 
                    color="primary" 
                    size="small" 
                    sx={{ mb: 2 }} 
                  />
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Qualification:</strong> {doctor.qualification}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Experience:</strong> {doctor.experience}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {doctor.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Contact:</strong> {doctor.contactNumber}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary"
                    disabled={!doctor.isAvailable}
                    onClick={() => handleBookAppointment(doctor.id)}
                  >
                    {doctor.isAvailable ? 'Book Appointment' : 'Not Available'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DoctorList;
