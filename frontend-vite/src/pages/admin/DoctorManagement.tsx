import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, TextField, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, CircularProgress,
  Alert, FormControlLabel, Switch, Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { Doctor } from '../../types';
import { toast } from 'react-toastify';

// This would be replaced with actual API calls in a real implementation
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
  }
];

interface DoctorFormData {
  name: string;
  specialization: string;
  qualification: string;
  experience: string;
  contactNumber: string;
  email: string;
  isAvailable: boolean;
}

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<DoctorFormData>({
    defaultValues: {
      name: '',
      specialization: '',
      qualification: '',
      experience: '',
      contactNumber: '',
      email: '',
      isAvailable: true
    }
  });

  useEffect(() => {
    // In a real implementation, this would fetch data from the backend
    const loadDoctors = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDoctors(mockDoctors);
        setError(null);
      } catch (err: any) {
        setError('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openAddDialog = () => {
    setDialogMode('add');
    reset(); // Reset form
    setOpenDialog(true);
  };

  const openEditDialog = (doctor: Doctor) => {
    setDialogMode('edit');
    setSelectedDoctor(doctor);
    // Set form values
    Object.keys(doctor).forEach(key => {
      setValue(key as keyof DoctorFormData, doctor[key as keyof Doctor] as any);
    });
    setOpenDialog(true);
  };

  const openDeleteDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDeleteDialogOpen(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedDoctor(null);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedDoctor(null);
  };

  const onSubmit = async (data: DoctorFormData) => {
    try {
      setSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (dialogMode === 'add') {
        // Add new doctor
        const newDoctor: Doctor = {
          id: `d${Date.now()}`, // Generate a temporary ID
          ...data
        };
        setDoctors([...doctors, newDoctor]);
        toast.success('Doctor added successfully');
      } else {
        // Edit existing doctor
        const updatedDoctors = doctors.map(doc =>
          doc.id === selectedDoctor?.id ? { ...doc, ...data } : doc
        );
        setDoctors(updatedDoctors);
        toast.success('Doctor updated successfully');
      }
      
      closeDialog();
    } catch (error) {
      toast.error('Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!selectedDoctor) return;
    
    try {
      setSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Delete doctor
      const updatedDoctors = doctors.filter(doc => doc.id !== selectedDoctor.id);
      setDoctors(updatedDoctors);
      toast.success('Doctor deleted successfully');
      
      closeDeleteDialog();
    } catch (error) {
      toast.error('Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(search.toLowerCase()) ||
    doctor.email.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate results
  const paginatedDoctors = filteredDoctors.slice(
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>Doctor Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
        >
          Add Doctor
        </Button>
      </Box>

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
              placeholder="Search by name, specialization or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="standard"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Doctors Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Qualification</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDoctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No doctors found</TableCell>
              </TableRow>
            ) : (
              paginatedDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>{doctor.qualification}</TableCell>
                  <TableCell>{doctor.experience}</TableCell>
                  <TableCell>
                    {doctor.email}<br />
                    {doctor.contactNumber}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={doctor.isAvailable ? 'Available' : 'Not Available'} 
                      color={doctor.isAvailable ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openEditDialog(doctor)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => openDeleteDialog(doctor)} color="error">
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
          count={filteredDoctors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Doctor Dialog */}
      <Dialog open={openDialog} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Doctor' : 'Edit Doctor'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <Controller
                  name="specialization"
                  control={control}
                  rules={{ required: 'Specialization is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Specialization"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.specialization}
                      helperText={errors.specialization?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="qualification"
                  control={control}
                  rules={{ required: 'Qualification is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Qualification"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.qualification}
                      helperText={errors.qualification?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="experience"
                  control={control}
                  rules={{ required: 'Experience is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Experience"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.experience}
                      helperText={errors.experience?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              </Grid>
              <Grid item xs={12} sm={6}>
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
                  name="isAvailable"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="Available for Appointments"
                    />
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
              {submitting ? 'Saving...' : (dialogMode === 'add' ? 'Add Doctor' : 'Save Changes')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete Dr. {selectedDoctor?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleDeleteDoctor} 
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

export default DoctorManagement;
