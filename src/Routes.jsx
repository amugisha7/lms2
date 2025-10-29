import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Onboarding from "./Screens/Onboarding/Onboarding";
import MainGrid from "./muiTemplates/dashboard/components/MainGrid";
import CustomFieldsManager from "./Screens/AdminScreens/CustomFields/CustomFieldsManager";
import Dashboard from "./Screens/Dashboard/Dashboard";
import CreateLoanFeesForm from "./Screens/LoanFees/CreateLoanFeesForm"; // Add this import
import CreateLoanProduct from "./Models/LoanProducts/CreateLoanProduct/CreateLoanProduct"; // Add this import
import AdminPage from "./Screens/AdminScreens/AdminPage";
import LoanFees from "./Screens/LoanFees/LoanFees"; // Add this import
import CreateBranches from "./Screens/Branches/CreateBranches/CreateBranch";
import Branches from "./Screens/Branches/Branches";
import LoanProducts from "./Models/LoanProducts/LoanProducts";
import FormTemplate from "./temp/FormTemplate";
import Securities from "./Screens/Securities/Securities";
import CreateSecurities from "./Screens/Securities/CreateSecurities/CreateSecurities";
// import Borrowers from "./Screens/Borrowers/Borrowers";
import Borrowers from "./Models/Borrowers/Borrowers";
import Temp from "./temp/Temp";
import BorrowerManagement from "./Models/Borrowers/BorrowerManagement";
import UserManagement from "./Models/Users/UserManagement";
import Users from "./Models/Users/Users";
import UserSettings from "./Screens/AdminScreens/Settings/UserSettings";
import NotificationsDashboard from "./Screens/Notifications/NotificationsDashboard";
import Notifications from "./Screens/Notifications/Notifications";

//old loan products
import OLoanProducts from "./Screens/LoanProducts/OLoanProducts";

export default function AppRoutes({ userExists }) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={userExists ? <Dashboard /> : <Onboarding />}>
          {userExists && (
            <>
              <Route index element={<MainGrid />} />
              <Route path="reports" element={<MainGrid />} />
              <Route path="settings" element={<UserSettings />} />
              <Route
                path="notifications"
                element={<NotificationsDashboard />}
              />
              <Route path="messages" element={<Notifications />} />

              {/* Borrowers routes */}
              <Route path="borrowers" element={<Borrowers />} />
              <Route
                path="borrowers/id/:borrowerId/view"
                element={<BorrowerManagement />}
              />

              {/* Users routes */}
              <Route path="users" element={<Users />} />
              <Route path="users/id/:id/view" element={<UserManagement />} />

              <Route path="customFields" element={<CustomFieldsManager />} />
              {/* Add more routes as needed */}

              {/* Loan Products route */}
              <Route
                path="admin/add-loan-product"
                element={<CreateLoanProduct />}
              />
              {/* Loan Products list route */}
              <Route path="admin/loan-products" element={<LoanProducts />} />
              <Route
                path="admin/old-loan-products"
                element={<OLoanProducts />}
              />

              {/* Loan Fees route */}
              <Route
                path="admin/add-loan-fee"
                element={<CreateLoanFeesForm />}
              />
              <Route path="admin/loan-fees" element={<LoanFees />} />

              {/* Branches routes */}
              <Route path="admin/branches" element={<Branches />} />
              <Route
                path="admin/add-branch"
                element={<CreateBranches hideCancel />}
              />

              {/* Securities routes */}
              <Route path="admin/securities" element={<Securities />} />
              <Route
                path="admin/add-security"
                element={<CreateSecurities hideCancel />}
              />

              {/* Admin main page route */}
              <Route path="admin" element={<AdminPage />} />
              {/* Add the /c1 route for FormTemplate */}
              <Route path="c1" element={<FormTemplate />} />
              {/* Add Temp route */}
              <Route path="temp" element={<Temp />} />
            </>
          )}
        </Route>
        {/* Optionally, redirect any unknown route to "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
