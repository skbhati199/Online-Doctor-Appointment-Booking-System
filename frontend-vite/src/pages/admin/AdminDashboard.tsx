import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  LinearProgress,
  Chip
} from '@mui/material';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DateRangeIcon from '@mui/icons-material/DateRange';
import StarIcon from '@mui/icons-material/Star';

// Store
import { useAuthStore } from '../../store/authStore';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => {
  return (
    <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  // Mock stats data - would come from API
  const stats = {
    totalDoctors: 24,
    totalPatients: 752,
    totalAppointments: 1463,
    completedAppointments: 1180,
    pendingAppointments: 283,
    recentDoctors: [
      { name: 'Dr. Sarah Johnson', specialty: 'Cardiology', patients: 42 },
      { name: 'Dr. Michael Chen', specialty: 'Neurology', patients: 38 },
      { name: 'Dr. Emily Rodriguez', specialty: 'Pediatrics', patients: 50 },
      { name: 'Dr. James Wilson', specialty: 'Orthopedics', patients: 31 },
    ],
    recentAppointments: [
      { patient: 'Alex Thompson', doctor: 'Dr. Sarah Johnson', date: 'Today, 2:30 PM', status: 'Confirmed' },
      { patient: 'Emma Davis', doctor: 'Dr. Michael Chen', date: 'Today, 4:00 PM', status: 'Pending' },
      { patient: 'Noah Williams', doctor: 'Dr. Emily Rodriguez', date: 'Tomorrow, 10:15 AM', status: 'Confirmed' },
      { patient: 'Olivia Martinez', doctor: 'Dr. James Wilson', date: 'Tomorrow, 1:45 PM', status: 'Cancelled' },
    ],
    popularSpecialties: [
      { name: 'Cardiology', count: 187, percentage: 80 },
      { name: 'Neurology', count: 165, percentage: 70 },
      { name: 'Pediatrics', count: 142, percentage: 60 },
      { name: 'Orthopedics', count: 118, percentage: 50 },
      { name: 'Dermatology', count: 94, percentage: 40 },
    ]
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome back, {user?.name || 'Admin'}! Here's what's happening today.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Stats Cards */}
        <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <StatCard
            title="Total Doctors"
            value={stats.totalDoctors}
            icon={<LocalHospitalIcon />}
            color="#4caf50"
          />
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<PeopleIcon />}
            color="#2196f3"
          />
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<EventNoteIcon />}
            color="#ff9800"
            subtitle={`${stats.completedAppointments} completed, ${stats.pendingAppointments} pending`}
          />
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <StatCard
            title="Completion Rate"
            value={`${Math.round((stats.completedAppointments / stats.totalAppointments) * 100)}%`}
            icon={<TrendingUpIcon />}
            color="#f44336"
          />
        </Grid>

        {/* Recent Doctors */}
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Doctors
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {stats.recentDoctors.map((doctor, index) => (
                  <ListItem key={index} divider={index < stats.recentDoctors.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <LocalHospitalIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={doctor.name}
                      secondary={`${doctor.specialty} | ${doctor.patients} patients`}
                    />
                    <Chip label={`${doctor.patients} patients`} size="small" color="primary" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Appointments */}
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Appointments
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {stats.recentAppointments.map((appointment, index) => (
                  <ListItem key={index} divider={index < stats.recentAppointments.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        <DateRangeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${appointment.patient} with ${appointment.doctor}`}
                      secondary={appointment.date}
                    />
                    <Chip 
                      label={appointment.status} 
                      size="small" 
                      color={
                        appointment.status === 'Confirmed' ? 'success' :
                        appointment.status === 'Pending' ? 'warning' : 'error'
                      } 
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Popular Specialties */}
        <Grid sx={{ gridColumn: 'span 12' }}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Popular Specialties
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box>
                {stats.popularSpecialties.map((specialty, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">
                        {specialty.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {specialty.count} appointments
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={specialty.percentage} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 5,
                        mt: 1, 
                        bgcolor: 'background.paper',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: index === 0 ? 'success.main' :
                                  index === 1 ? 'primary.main' :
                                  index === 2 ? 'secondary.main' :
                                  index === 3 ? 'warning.main' : 'error.main',
                        }
                      }} 
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
