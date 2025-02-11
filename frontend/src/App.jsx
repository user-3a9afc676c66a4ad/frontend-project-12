import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './contexts/AuthCont';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import SignupPage from './pages/SignupPage';
import ErrorBoundary from './ErrorBoundary';
import { initializeSocket } from './api/socket';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    initializeSocket({ dispatch });
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="h-100 d-flex flex-column">
            <Header />
            <div className="container h-100 my-4 overflow-hidden rounded shadow">
              <Routes>
                <Route
                  path="/login"
                  element={
                    <ProtectedRoute redirectTo="/chat" inverse>
                      <LoginPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <ProtectedRoute redirectTo="/chat" inverse>
                      <SignupPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute redirectTo="/login">
                      <ChatPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

const Header = () => {
  const { logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">
          {t('header.brand')}
        </a>
        {isAuthenticated && (
          <button type="button" className="btn btn-outline-danger ml-auto" onClick={logout}>
            {t('header.logout')}
          </button>
        )}
      </div>
    </nav>
  );
};

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, redirectTo, inverse = false }) => {
  const { isAuthenticated } = useAuth();
  const shouldRedirect = inverse ? isAuthenticated : !isAuthenticated;

  return shouldRedirect ? <Navigate to={redirectTo} replace /> : children;
};

export default App;
