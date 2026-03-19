import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Orders } from './components/Orders';
import { Earnings } from './components/Earnings';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { RiderProvider, useRiderStore } from './store';

function AppContent() {
  const { isAuthenticated } = useRiderStore();

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/earnings" element={<Earnings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          }
        />
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <RiderProvider>
      <Router>
        <Toaster position="top-center" />
        <AppContent />
      </Router>
    </RiderProvider>
  );
}
