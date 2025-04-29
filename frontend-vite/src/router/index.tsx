import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Layout from '../components/layout/Layout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Public Pages
import Home from '../pages/Home';
import DoctorList from '../pages/doctors/DoctorList';

// Patient Pages
import Dashboard from '../pages/dashboard/Dashboard';
import BookAppointment from '../pages/booking/BookAppointment';

// Admin Pages
import AdminPanel from '../pages/admin/AdminPanel';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role if roles are specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      {children}
    </ProtectedRoute>
  );
};

// Layout with outlet for nested routes
const MainLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Public routes
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'doctors', element: <DoctorList /> },
      
      // Protected routes for patients
      { 
        path: 'dashboard', 
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      },
      { 
        path: 'booking/:doctorId', 
        element: <ProtectedRoute><BookAppointment /></ProtectedRoute>
      },
      
      // Admin routes
      {
        path: 'admin/*',
        element: <AdminRoute><AdminPanel /></AdminRoute>
      },
      
      // Fallback route
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
