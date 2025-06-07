import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './Screens/Onboarding/Onboarding';
import MainGrid from './muiTemplates/dashboard/components/MainGrid';
import CreateBorrower from './Screens/Borrowers/CreateBorrower';
import AllBorrowers from './Screens/Borrowers/AllBorrowers';
import ViewBorrower from './Screens/Borrowers/ViewBorrower/ViewBorrower';
import CustomFieldsManager from './Screens/AdminScreens/CustomFields/CustomFieldsManager';
import Dashboard from './Screens/Dashboard/Dashboard';
import Home from './Screens/Home';

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

              // Borrowers routes
              <Route path="allBorrowers" element={<AllBorrowers />} />
              <Route path="addBorrower" element={<CreateBorrower />} />
              <Route path="viewBorrower/:borrowerId" element={<ViewBorrower />} />
              <Route path="customFields" element={<CustomFieldsManager />} />
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