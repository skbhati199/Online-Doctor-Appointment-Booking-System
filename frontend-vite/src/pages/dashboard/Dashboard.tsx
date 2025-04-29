import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Tabs, 
  Tab, 
  Chip, 
  Divider,
  Avatar,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

// Icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

// Store
import { useAuthStore } from '../../store/authStore';

// Services
import { getAppointments, cancelAppointment } from '../../services/appointmentService';
import { toast } from 'react-toastify';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const StyledChip = styled(Chip)(() => ({
  fontWeight: 'bold',
}));

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return 'primary';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    case 'rescheduled':
      return 'warning';
    default:
      return 'default';
  }
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [value, setValue] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [pastAppointments, setPastAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getAppointments();
        
        // Filter appointments into upcoming and past
        const now = new Date();
        const upcoming = data.filter((app: any) => new Date(app.appointmentDate) >= now);
        const past = data.filter((app: any) => new Date(app.appointmentDate) < now);
        
        // Sort by date (newest first for upcoming, oldest first for past)
        upcoming.sort((a: any, b: any) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
        past.sort((a: any, b: any) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
        
        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
      } catch (err: any) {
        setError(err.message || 'Failed to load appointments');
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment(appointmentId);
        toast.success('Appointment cancelled successfully');
        
        // Update the local state to reflect the cancellation
        setUpcomingAppointments(prev => 
          prev.map(app => 
            app.id === appointmentId ? { ...app, status: 'CANCELLED' } : app
          )
        );
      } catch (err: any) {
        toast.error(err.message || 'Failed to cancel appointment');
      }
    }
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    navigate(`/booking?reschedule=${appointmentId}`);
  };

  const renderAppointmentCard = (appointment: any, isUpcoming: boolean) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const formattedDate = format(appointmentDate, 'PPP'); // Monday, October 12, 2023
    const formattedTime = format(appointmentDate, 'p'); // 8:00 PM
    
    return (
      <Card key={appointment.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid sx={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" component="div">
                <Box display="flex" alignItems="center">
                  <LocalHospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
                  {appointment.doctor?.name || 'Doctor'}
                </Box>
              </Typography>
              <StyledChip 
                label={appointment.status} 
                color={getStatusColor(appointment.status)} 
                size="small" 
              />
            </Grid>
            
            <Grid sx={{ gridColumn: 'span 12' }}>
              <Divider />
            </Grid>
            
            <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
              <Box display="flex" alignItems="center">
                <CalendarMonthIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">{formattedDate}</Typography>
              </Box>
            </Grid>
            
            <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
              <Box display="flex" alignItems="center">
                <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">{formattedTime}</Typography>
              </Box>
            </Grid>
            
            <Grid sx={{ gridColumn: 'span 12' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Specialty:</strong> {appointment.doctor?.specialization || 'General Medicine'}
              </Typography>
            </Grid>
            
            <Grid sx={{ gridColumn: 'span 12' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Reason:</strong> {appointment.reason || 'General checkup'}
              </Typography>
            </Grid>
            
            {isUpcoming && appointment.status !== 'CANCELLED' && (
              <Grid sx={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Tooltip title="Reschedule">
                  <Button
                    startIcon={<MoreTimeIcon />}
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleRescheduleAppointment(appointment.id)}
                  >
                    Reschedule
                  </Button>
                </Tooltip>
                
                <Tooltip title="Cancel">
                  <Button
                    startIcon={<CancelIcon />}
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    Cancel
                  </Button>
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>Loading dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h5" component="h1" color="error" gutterBottom>Error loading dashboard</Typography>
          <Typography color="error">{error}</Typography>
          <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid sx={{ gridColumn: 'span 12' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome, {user?.name || 'Patient'}!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage your appointments and health information
            </Typography>
          </Grid>
          
          {/* Quick Actions */}
          <Grid sx={{ gridColumn: 'span 12' }}>
            <Grid container spacing={2}>
              <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    height: '100%',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
                  }}
                  onClick={() => navigate('/doctors')}
                >
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mb: 2 }}>
                    <PersonIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" align="center">Find Doctors</Typography>
                </Paper>
              </Grid>
              
              <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    height: '100%',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
                  }}
                  onClick={() => navigate('/booking')}
                >
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56, mb: 2 }}>
                    <CalendarMonthIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" align="center">Book Appointment</Typography>
                </Paper>
              </Grid>
              
              <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    height: '100%',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
                  }}
                  onClick={() => toast.info('Notifications feature coming soon!')}
                >
                  <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56, mb: 2 }}>
                    <NotificationsIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" align="center">Notifications</Typography>
                  <Chip label="New" color="error" size="small" sx={{ mt: 1 }} />
                </Paper>
              </Grid>
              
              <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    height: '100%',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
                  }}
                  onClick={() => toast.info('Medical records feature coming soon!')}
                >
                  <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56, mb: 2 }}>
                    <MedicalInformationIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" align="center">Medical Records</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          
          {/* Appointments */}
          <Grid sx={{ gridColumn: 'span 12' }}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={value} 
                  onChange={handleChange} 
                  aria-label="appointment tabs"
                  variant="fullWidth"
                >
                  <Tab label={`Upcoming (${upcomingAppointments.length})`} id="dashboard-tab-0" />
                  <Tab label={`Past (${pastAppointments.length})`} id="dashboard-tab-1" />
                </Tabs>
              </Box>
              
              <TabPanel value={value} index={0}>
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map(appointment => renderAppointmentCard(appointment, true))
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No upcoming appointments
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<CalendarMonthIcon />}
                      onClick={() => navigate('/booking')}
                      sx={{ mt: 2 }}
                    >
                      Book an Appointment
                    </Button>
                  </Box>
                )}
              </TabPanel>
              
              <TabPanel value={value} index={1}>
                {pastAppointments.length > 0 ? (
                  pastAppointments.map(appointment => renderAppointmentCard(appointment, false))
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="h6" color="text.secondary">
                      No past appointments
                    </Typography>
                  </Box>
                )}
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
