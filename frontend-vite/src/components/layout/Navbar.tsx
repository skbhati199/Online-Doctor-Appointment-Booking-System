import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box, Avatar } from '@mui/material';
import { Menu as MenuIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'primary.main' }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          MedBook
        </Typography>

        {/* Mobile menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-mobile"
            anchorEl={mobileMenuAnchorEl}
            keepMounted
            open={Boolean(mobileMenuAnchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} to="/doctors" onClick={handleClose}>Find Doctors</MenuItem>
            {isAuthenticated ? (
              <>
                {user?.role === 'PATIENT' && (
                  <MenuItem component={Link} to="/dashboard" onClick={handleClose}>Dashboard</MenuItem>
                )}
                {user?.role === 'ADMIN' && (
                  <MenuItem component={Link} to="/admin" onClick={handleClose}>Admin Panel</MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </>
            ) : (
              <>
                <MenuItem component={Link} to="/login" onClick={handleClose}>Login</MenuItem>
                <MenuItem component={Link} to="/register" onClick={handleClose}>Register</MenuItem>
              </>
            )}
          </Menu>
        </Box>

        {/* Desktop menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={Link} to="/doctors">Find Doctors</Button>
          
          {isAuthenticated ? (
            <>
              {user?.role === 'PATIENT' && (
                <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
              )}
              {user?.role === 'ADMIN' && (
                <Button color="inherit" component={Link} to="/admin">Admin Panel</Button>
              )}
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="primary" variant="contained" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
