import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Onboarding from "./Screens/Onboarding/Onboarding";
import MainGrid from "./muiTemplates/dashboard/components/MainGrid";
import CreateBorrower from "./Screens/Borrowers/CreateBorrower";
import AllBorrowers from "./Screens/Borrowers/AllBorrowers";
import ViewBorrower from "./Screens/Borrowers/ViewBorrower/ViewBorrower";
import CustomFieldsManager from "./Screens/AdminScreens/CustomFields/CustomFieldsManager";
import Dashboard from "./Screens/Dashboard/Dashboard";
import CreateLoanFeesForm from "./Screens/LoanFees/CreateLoanFeesForm"; // Add this import
import CreateLoanProductFormOptimized from "./Screens/LoanProducts/CreateLoanProductFormOptimized"; // Add this import
import AdminPage from "./Screens/AdminScreens/AdminPage";
import LoanFees from "./Screens/LoanFees/LoanFees"; // Add this import
import CreateBranchesForm from "./Screens/Branches/CreateBranchesForm";
import Branches from "./Screens/Branches/Branches";

export default function AppRoutes({ userExists }) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={userExists ? <Dashboard /> : <Onboarding />}>
          {userExists && (
            <>
              <Route index element={<MainGrid />} />
              <Route path="reports" element={<MainGrid />} />
              <Route path="settings" element={<Onboarding />} />

              {/* Borrowers routes */}
              <Route path="allBorrowers" element={<AllBorrowers />} />
              <Route path="addBorrower" element={<CreateBorrower />} />
              <Route
                path="viewBorrower/:borrowerId"
                element={<ViewBorrower />}
              />
              <Route path="customFields" element={<CustomFieldsManager />} />
              {/* Add more routes as needed */}

              {/* Loan Products route */}
              <Route
                path="admin/add-loan-product"
                element={<CreateLoanProductFormOptimized />}
              />

              {/* Loan Fees route */}
              <Route
                path="admin/add-loan-fee"
                element={<CreateLoanFeesForm />}
              />
              <Route path="admin/loan-fees" element={<LoanFees />} />

              {/* Branches routes */}
              <Route path="admin/branches" element={<Branches />} />
              <Route path="admin/add-branch" element={<CreateBranchesForm />} />

              {/* Admin main page route */}
              <Route path="admin" element={<AdminPage />} />
            </>
          )}
        </Route>
        {/* Optionally, redirect any unknown route to "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
