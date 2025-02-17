import { useEffect } from 'react';
import {
  // prettier-ignore
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './contexts/AuthCont';
import routes from './routes';
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
  // prettier-ignore
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="h-100 d-flex flex-column">
            <Header />
            <div className="container h-100 my-4 overflow-hidden rounded shadow">
              <Routes>
                <Route
                  path={routes.login()}
                  element={
                    (
                      <GuestRoute redirectTo={routes.chat()}>
                        <LoginPage />
                      </GuestRoute>
                    )
                  }
                />
                <Route
                  path={routes.signup()}
                  element={
                    (
                      <GuestRoute redirectTo={routes.chat()}>
                        <SignupPage />
                      </GuestRoute>
                    )
                  }
                />
                <Route
                  path={routes.chat()}
                  element={
                    (
                      <PrivateRoute redirectTo={routes.login()}>
                        <ChatPage />
                      </PrivateRoute>
                    )
                  }
                />
                <Route path={routes.home()} element={<Navigate to={routes.login()} replace />} />
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
const PrivateRoute = ({ children, redirectTo }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
};

// eslint-disable-next-line react/prop-types
const GuestRoute = ({ children, redirectTo }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to={redirectTo} replace /> : children;
};

export default App;
