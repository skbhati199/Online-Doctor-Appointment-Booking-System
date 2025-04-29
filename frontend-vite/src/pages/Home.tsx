import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { MedicalServices, CalendarMonth, Person } from '@mui/icons-material';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
          borderRadius: 2,
          mb: 6
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Online Doctor Appointment
          </Typography>
          <Typography variant="h5" paragraph>
            Book appointments with top doctors anytime, anywhere
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={Link}
            to="/doctors"
            sx={{ mt: 2, fontWeight: 'bold', py: 1.5, px: 4 }}
          >
            Find Doctors
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Why Choose Our Platform?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <MedicalServices fontSize="large" color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                Expert Doctors
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Connect with experienced specialists across various medical fields
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <CalendarMonth fontSize="large" color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                Easy Scheduling
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Book, reschedule, or cancel appointments with just a few clicks
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Person fontSize="large" color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                User-Friendly
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Simple and intuitive interface for the best booking experience
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8, borderRadius: 2 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Ready to book your appointment?
          </Typography>
          <Typography variant="body1" paragraph>
            Join thousands of patients who have simplified their healthcare journey
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              component={Link}
              to="/register"
              sx={{ mx: 1, py: 1.5, px: 4 }}
            >
              Sign Up Now
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              component={Link}
              to="/doctors"
              sx={{ mx: 1, py: 1.5, px: 4 }}
            >
              Browse Doctors
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
