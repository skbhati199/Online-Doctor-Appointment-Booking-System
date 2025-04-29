import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Grid, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, CircularProgress,
  Alert, Chip, FormControl, InputLabel, Select, MenuItem,
  Stack, Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  RemoveRedEye as ViewIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  CheckCircle as CompleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Appointment } from '../../types';
import { toast } from 'react-toastify';

// This would be replaced with actual API calls
const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    userId: 'u1',
    doctorId: 'd1',
    appointmentTime: '2025-05-15T10:30:00.000Z',
    status: 'SCHEDULED',
    notes: 'Regular checkup',
    createdAt: '2025-04-20T14:30:00.000Z',
    updatedAt: '2025-04-20T14:30:00.000Z',
    doctor: {
      id: 'd1',
      name: 'Dr. John Smith',
      specialization: 'Cardiology',
      qualification: 'MD, MBBS',
      experience: '15 years',
      contactNumber: '1234567890',
      email: 'john.smith@example.com',
      isAvailable: true
    }
  },
  {
    id: 'a2',
    userId: 'u2',
    doctorId: 'd2',
    appointmentTime: '2025-05-03T09:00:00.000Z',
    status: 'SCHEDULED',
    createdAt: '2025-04-25T11:15:00.000Z',
    updatedAt: '2025-04-25T11:15:00.000Z',
    doctor: {
      id: 'd2',
      name: 'Dr. Emily Johnson',
      specialization: 'Neurology',
      qualification: 'MD, PhD',
      experience: '10 years',
      contactNumber: '2345678901',
      email: 'emily.johnson@example.com',
      isAvailable: true
    }
  },
  {
    id: 'a3',
    userId: 'u3',
    doctorId: 'd3',
    appointmentTime: '2025-04-28T14:15:00.000Z',
    status: 'COMPLETED',
    notes: 'Follow-up after surgery',
    createdAt: '2025-04-15T09:45:00.000Z',
    updatedAt: '2025-04-28T15:30:00.000Z',
    doctor: {
      id: 'd3',
      name: 'Dr. Michael Chen',
      specialization: 'Orthopedics',
      qualification: 'MBBS, MS',
      experience: '8 years',
      contactNumber: '3456789012',
      email: 'michael.chen@example.com',
      isAvailable: false
    }
  },
  {
    id: 'a4',
    userId: 'u2',
    doctorId: 'd1',
    appointmentTime: '2025-04-22T11:00:00.000Z',
    status: 'CANCELLED',
    createdAt: '2025-04-10T16:20:00.000Z',
    updatedAt: '2025-04-20T09:15:00.000Z',
    doctor: {
      id: 'd1',
      name: 'Dr. John Smith',
      specialization: 'Cardiology',
      qualification: 'MD, MBBS',
      experience: '15 years',
      contactNumber: '1234567890',
      email: 'john.smith@example.com',
      isAvailable: true
    }
  }
];

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'complete' | 'cancel'>('complete');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // In a real implementation, this would fetch data from the backend
    const loadAppointments = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAppointments(mockAppointments);
        setError(null);
      } catch (err: any) {
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openViewDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedAppointment(null);
  };

  const openActionDialog = (appointment: Appointment, action: 'complete' | 'cancel') => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const closeActionDialog = () => {
    setActionDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleAppointmentAction = async () => {
    if (!selectedAppointment) return;
    
    try {
      setSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update appointment status
      const updatedAppointments = appointments.map(app =>
        app.id === selectedAppointment.id
          ? { ...app, status: actionType === 'complete' ? 'COMPLETED' : 'CANCELLED' }
          : app
      );
      setAppointments(updatedAppointments);
      
      toast.success(`Appointment ${actionType === 'complete' ? 'completed' : 'cancelled'} successfully`);
      closeActionDialog();
    } catch (error) {
      toast.error('Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Apply filters to appointments
  const filteredAppointments = appointments.filter(appointment => {
    // Search filter
    const searchMatch = 
      appointment.doctor?.name.toLowerCase().includes(search.toLowerCase()) ||
      appointment.id.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const statusMatch = statusFilter === 'all' || appointment.status === statusFilter;
    
    // Date filter
    let dateMatch = true;
    if (dateFilter) {
      const appointmentDate = new Date(appointment.appointmentTime).toDateString();
      const filterDate = dateFilter.toDateString();
      dateMatch = appointmentDate === filterDate;
    }
    
    return searchMatch && statusMatch && dateMatch;
  });

  // Paginate results
  const paginatedAppointments = filteredAppointments.slice(
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
      <Typography variant="h4" gutterBottom>Appointment Management</Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : null}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by doctor name or appointment ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Filter by Date"
                value={dateFilter}
                onChange={setDateFilter}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setDateFilter(null);
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Appointments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No appointments found</TableCell>
              </TableRow>
            ) : (
              paginatedAppointments.map((appointment) => {
                const appointmentDate = new Date(appointment.appointmentTime);
                const isPast = appointmentDate < new Date();
                
                return (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.id}</TableCell>
                    <TableCell>{appointment.doctor?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      {format(appointmentDate, 'MMM dd, yyyy')}<br />
                      {format(appointmentDate, 'hh:mm a')}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={appointment.status} 
                        color={
                          appointment.status === 'SCHEDULED' ? 'primary' :
                          appointment.status === 'COMPLETED' ? 'success' :
                          'error'
                        } 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => openViewDialog(appointment)} color="primary">
                        <ViewIcon />
                      </IconButton>
                      
                      {appointment.status === 'SCHEDULED' && (
                        <>
                          {!isPast && (
                            <IconButton 
                              onClick={() => openActionDialog(appointment, 'complete')} 
                              color="success"
                            >
                              <CompleteIcon />
                            </IconButton>
                          )}
                          <IconButton 
                            onClick={() => openActionDialog(appointment, 'cancel')} 
                            color="error"
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAppointments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* View Appointment Dialog */}
      <Dialog open={viewDialogOpen} onClose={closeViewDialog} maxWidth="md" fullWidth>
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ mt: 2 }}>
              <Stack spacing={2}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Appointment Information</Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Appointment ID:</Typography>
                      <Typography variant="body1" gutterBottom>{selectedAppointment.id}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Status:</Typography>
                      <Chip 
                        label={selectedAppointment.status} 
                        color={
                          selectedAppointment.status === 'SCHEDULED' ? 'primary' :
                          selectedAppointment.status === 'COMPLETED' ? 'success' :
                          'error'
                        } 
                        size="small" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Date:</Typography>
                      <Typography variant="body1" gutterBottom>
                        {format(new Date(selectedAppointment.appointmentTime), 'MMMM dd, yyyy')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Time:</Typography>
                      <Typography variant="body1" gutterBottom>
                        {format(new Date(selectedAppointment.appointmentTime), 'hh:mm a')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Notes:</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedAppointment.notes || 'No notes provided'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Doctor Information</Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Name:</Typography>
                      <Typography variant="body1" gutterBottom>{selectedAppointment.doctor?.name || 'Unknown'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Specialization:</Typography>
                      <Typography variant="body1" gutterBottom>{selectedAppointment.doctor?.specialization || 'Unknown'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Email:</Typography>
                      <Typography variant="body1" gutterBottom>{selectedAppointment.doctor?.email || 'Unknown'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Contact:</Typography>
                      <Typography variant="body1" gutterBottom>{selectedAppointment.doctor?.contactNumber || 'Unknown'}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Complete/Cancel Dialog */}
      <Dialog open={actionDialogOpen} onClose={closeActionDialog}>
        <DialogTitle>
          {actionType === 'complete' ? 'Mark Appointment as Completed' : 'Cancel Appointment'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {actionType === 'complete' ? 'mark this appointment as completed' : 'cancel this appointment'}?
          </Typography>
          {selectedAppointment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Doctor:</strong> {selectedAppointment.doctor?.name}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {format(new Date(selectedAppointment.appointmentTime), 'MMMM dd, yyyy')}
              </Typography>
              <Typography variant="body2">
                <strong>Time:</strong> {format(new Date(selectedAppointment.appointmentTime), 'hh:mm a')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeActionDialog} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleAppointmentAction} 
            color={actionType === 'complete' ? 'success' : 'error'} 
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentManagement;
