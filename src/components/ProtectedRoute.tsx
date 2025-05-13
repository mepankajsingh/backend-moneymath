import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Log authentication state for debugging
    console.log('Protected route - Auth state:', { 
      isLoading: loading, 
      hasUser: !!user, 
      hasSession: !!session,
      userEmail: user?.email
    });
  }, [loading, user, session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  if (!user || !session) {
    console.log('No authenticated user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
