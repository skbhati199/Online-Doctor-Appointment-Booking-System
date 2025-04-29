import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, TextField, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, CircularProgress,
  Alert, Chip, MenuItem, Select, FormControl, InputLabel,
  FormHelperText
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { User } from '../../types';
import { toast } from 'react-toastify';

// This would be replaced with actual API calls in a real implementation
const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'PATIENT',
  },
  {
    id: 'u2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'PATIENT',
  },
  {
    id: 'u3',
    name: 'Dr. Emily Wilson',
    email: 'emily.wilson@example.com',
    role: 'DOCTOR',
  },
  {
    id: 'u4',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
  }
];

interface UserFormData {
  name: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      role: 'PATIENT'
    }
  });

  useEffect(() => {
    // In a real implementation, this would fetch data from the backend
    const loadUsers = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
        setError(null);
      } catch (err: any) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    // Set form values
    Object.keys(user).forEach(key => {
      if (key !== 'id') {
        setValue(key as keyof UserFormData, user[key as keyof User] as any);
      }
    });
    setOpenDialog(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    reset();
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const onSubmit = async (data: UserFormData) => {
    if (!selectedUser) return;
    
    try {
      setSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user
      const updatedUsers = users.map(user =>
        user.id === selectedUser.id ? { ...user, ...data } : user
      );
      setUsers(updatedUsers);
      toast.success('User updated successfully');
      
      closeDialog();
    } catch (error) {
      toast.error('Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Delete user
      const updatedUsers = users.filter(user => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      toast.success('User deleted successfully');
      
      closeDeleteDialog();
    } catch (error) {
      toast.error('Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate results
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>User Management</Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : null}

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <SearchIcon color="action" />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="standard"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No users found</TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={
                        user.role === 'ADMIN' ? 'error' :
                        user.role === 'DOCTOR' ? 'primary' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openEditDialog(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => openDeleteDialog(user)} 
                      color="error"
                      disabled={user.role === 'ADMIN'} // Prevent deletion of admin users
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Edit User Dialog */}
      <Dialog open={openDialog} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Name is required' }}
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
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: 'Role is required' }}
                  render={({ field }) => (
                    <FormControl 
                      fullWidth 
                      margin="normal"
                      error={!!errors.role}
                    >
                      <InputLabel id="role-label">Role</InputLabel>
                      <Select
                        {...field}
                        labelId="role-label"
                        label="Role"
                      >
                        <MenuItem value="PATIENT">Patient</MenuItem>
                        <MenuItem value="DOCTOR">Doctor</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                      </Select>
                      {errors.role && (
                        <FormHelperText>{errors.role.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} disabled={submitting}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user {selectedUser?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleDeleteUser} 
            color="error" 
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
