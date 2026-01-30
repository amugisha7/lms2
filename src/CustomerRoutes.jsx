import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CustomerDashboard from "./Screens/CustomerPortal/CustomerDashboard";
import CustomerProfile from "./Screens/CustomerPortal/CustomerProfile";
import CustomerLoanApplication from "./Screens/CustomerPortal/CustomerLoanApplicationTabs";
import CustomerLoans from "./Screens/CustomerPortal/CustomerLoans";
import CustomerLoanDetail from "./Screens/CustomerPortal/CustomerLoanDetail";
import CustomerLoanCalculator from "./Screens/CustomerPortal/CustomerLoanCalculator";
import CustomerApplications from "./Screens/CustomerPortal/CustomerApplications";

export default function CustomerRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/client/:institutionId" element={<CustomerDashboard />}>
          <Route index element={<CustomerProfile />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="calculator" element={<CustomerLoanCalculator />} />
          <Route path="apply" element={<CustomerLoanApplication />} />
          <Route path="applications" element={<CustomerApplications />} />
          <Route path="loans" element={<CustomerLoans />} />
          <Route path="loans/:loanId" element={<CustomerLoanDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
