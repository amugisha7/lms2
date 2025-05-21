import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './Screens/Onboarding/Onboarding';
import Dashboard from './muiTemplates/dashboard/Dashboard';
import MainGrid from './muiTemplates/dashboard/components/MainGrid';
import CreateBorrowerForm from './Screens/Borrowers/CreateBorrower';

export default function AppRoutes({ userExists }) {

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={userExists ? <Dashboard /> : <Onboarding />}
        >
          {userExists && (
            <>
              <Route index element={<MainGrid />} />
              <Route path="reports" element={<MainGrid />} />
              <Route path="settings" element={<Onboarding />} />
              <Route path="addBorrower" element={<CreateBorrowerForm />} />
              <Route path="manageBorrowers" element={<CreateBorrowerForm />} />
              {/* Add more routes as needed */}
            </>
          )}
        </Route>
        {/* Optionally, redirect any unknown route to "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}