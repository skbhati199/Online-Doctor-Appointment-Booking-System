import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          mt: 'auto', 
          backgroundColor: 'primary.main', 
          color: 'white',
          textAlign: 'center' 
        }}
      >
        <Container>
          © {new Date().getFullYear()} MedBook - Online Appointment Booking System
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
