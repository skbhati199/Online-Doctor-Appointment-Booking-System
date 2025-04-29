import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SettingsIcon from '@mui/icons-material/Settings';
import InsightsIcon from '@mui/icons-material/Insights';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Store
import { useAuthStore } from '../../store/authStore';

// Admin Pages
import AdminDashboard from './AdminDashboard';
import DoctorManagement from './DoctorManagement';
import UserManagement from './UserManagement';
import AppointmentManagement from './AppointmentManagement';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  [theme.breakpoints.up('sm')]: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
  },
}));

// Use regular ListItem with additional styling
const SidebarItem = ({ className, ...props }: { className?: string } & React.ComponentProps<typeof ListItem>) => {
  return (
    <ListItem
      {...props}
      className={className}
      sx={{
        borderRadius: 1,
        mb: 0.5,
        ...(className?.includes('active') && {
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          '& .MuiListItemIcon-root': {
            color: 'primary.contrastText',
          },
        }),
        '&:hover': {
          backgroundColor: 'action.hover',
          ...(className?.includes('active') && {
            backgroundColor: 'primary.dark',
          }),
        },
        ...props.sx,
      }}
    />
  );
};

const AdminPanel: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Doctors', icon: <LocalHospitalIcon />, path: '/admin/doctors' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Appointments', icon: <EventNoteIcon />, path: '/admin/appointments' },
    { text: 'Analytics', icon: <InsightsIcon />, path: '/admin/analytics' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => currentPath === item.path || currentPath.startsWith(`${item.path}/`));
    return currentItem ? currentItem.text : 'Admin Panel';
  };

  // Determine if menu item is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Admin Portal
        </Typography>
      </Box>
      <Divider />
      <List sx={{ p: 2, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <Link to={item.path} key={item.text} style={{ textDecoration: 'none', color: 'inherit' }}>
            <SidebarItem
              className={isActive(item.path) ? 'active' : ''}
              sx={{ mb: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </SidebarItem>
          </Link>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" sx={{ p: 1 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {user?.name || 'Admin User'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {user?.email || 'admin@example.com'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 1,
        }}
        color="default"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Breadcrumbs aria-label="breadcrumb">
              <MuiLink
                component={Link}
                to="/admin"
                color="inherit"
                underline="hover"
              >
                Admin
              </MuiLink>
              <Typography color="text.primary">{getCurrentPageTitle()}</Typography>
            </Breadcrumbs>
          </Box>
          
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="admin sections"
      >
        <Paper
          variant="elevation"
          elevation={6}
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: drawerWidth,
            height: '100%',
            position: 'fixed',
            borderRadius: 0,
          }}
        >
          {drawer}
        </Paper>
      </Box>
      
      <Main open={mobileOpen}>
        <Toolbar /> {/* Spacer for fixed app bar */}
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/doctors" element={<DoctorManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/appointments" element={<AppointmentManagement />} />
            <Route path="/analytics" element={
              <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Analytics</Typography>
                <Typography>Analytics feature coming soon!</Typography>
              </Box>
            } />
            <Route path="/settings" element={
              <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Settings</Typography>
                <Typography>Settings feature coming soon!</Typography>
              </Box>
            } />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Container>
      </Main>
    </Box>
  );
};

export default AdminPanel;
