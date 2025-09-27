# Employee Management System

A comprehensive employee management system built with React, Material-UI, and AWS Amplify GraphQL. This system provides enterprise-grade functionality for managing employees with a Salesforce-like experience.

## Features

### Core Functionality

- ✅ **Employee DataGrid**: View all employees in a sortable, filterable table
- ✅ **Create Employee**: Comprehensive form for adding new employees
- ✅ **Employee Details**: Detailed view with tabbed interface
- ✅ **Edit Employee**: In-place editing with validation
- ✅ **Delete Employee**: Secure deletion with confirmation
- ✅ **Search & Filter**: Quick search and advanced filtering
- ✅ **Export**: Export employee data to CSV/Excel

### Advanced Features

- ✅ **Tabbed Interface**: Details, Custom Fields, and Files tabs
- ✅ **Custom Fields**: Dynamic custom fields with various field types
- ✅ **File Management**: Upload, view, and manage employee files
- ✅ **Optimized API**: Single query with pagination for all employees
- ✅ **No Re-fetch**: Switching between employees doesn't trigger API calls
- ✅ **Enterprise UI**: Professional Salesforce-like interface

## Components

### Main Components

#### EmployeeDataGrid

The primary component that displays all employees in a data grid with:

- Search and filtering capabilities
- Inline actions (view, edit, delete)
- Clickable employee names
- Status chips and indicators
- Export functionality
- Pagination support

#### CreateEmployee

Comprehensive form for creating new employees with sections for:

- Personal Information
- Address Information
- Employment Information
- Next of Kin Information
- Banking & Tax Information

#### EmployeeDetails

Modal dialog with tabbed interface showing:

- Complete employee details
- Custom fields management
- File attachments
- Edit mode with save/cancel functionality

### Tab Components

#### EmployeeDetailsTab

Displays and allows editing of all employee information in organized sections:

- Personal details
- Address information
- Employment data
- Next of kin details
- Banking information

#### EmployeeCustomFieldsTab

Dynamic custom fields management:

- Add/edit/delete custom fields
- Various field types (text, number, date, select, etc.)
- JSON storage in customFieldsData field
- Drag and drop reordering

#### EmployeeFilesTab

File management system:

- Upload files with drag and drop
- Categorize files
- View/download files
- File statistics
- S3 integration ready

## API Integration

### GraphQL Queries

- `listEmployees`: Fetch all employees with pagination
- `getEmployee`: Fetch single employee with full details

### GraphQL Mutations

- `createEmployee`: Create new employee
- `updateEmployee`: Update existing employee
- `deleteEmployee`: Delete employee

### Optimizations

- **Single API Call**: All employees fetched once with nextToken looping
- **No Re-fetch**: Employee switching uses cached data
- **Pagination**: Handles large datasets efficiently
- **Error Handling**: Comprehensive error handling and user feedback

## Custom Hook

### useEmployeeOperations

Centralized hook for all employee operations:

- `fetchAllEmployees()`: Get all employees with pagination
- `fetchEmployee(id)`: Get single employee details
- `createNewEmployee(data)`: Create new employee
- `updateExistingEmployee(id, data)`: Update employee
- `deleteExistingEmployee(id)`: Delete employee
- `searchEmployees(term)`: Search employees
- `getEmployeesByStatus(status)`: Filter by status
- `getEmployeesByDepartment(dept)`: Filter by department

## Usage

### Basic Import

```jsx
import EmployeeDataGrid from "./Screens/Employees";
// or
import { EmployeeDataGrid } from "./Screens/Employees";
```

### Using Individual Components

```jsx
import {
  EmployeeDataGrid,
  CreateEmployee,
  EmployeeDetails,
  useEmployeeOperations,
} from "./Screens/Employees";
```

### Using the Hook

```jsx
import { useEmployeeOperations } from "./Screens/Employees/useEmployeeOperations";

function MyComponent() {
  const {
    loading,
    error,
    fetchAllEmployees,
    createNewEmployee,
    updateExistingEmployee,
    deleteExistingEmployee,
  } = useEmployeeOperations();

  // Use the operations...
}
```

## Employee Data Structure

### Core Fields

- Personal: firstName, lastName, middleName, dateOfBirth, etc.
- Contact: email, phoneNumber1, phoneNumber2, address fields
- Employment: position, department, status, salary, dates
- Identity: nationalID, passportNumber, nationality
- Banking: bankAccountNumber, bankName, taxID
- Custom: customFieldsData (JSON), status flags

### Relationships

- Branch: Employee belongs to a branch
- Supervisor: Employee can have a supervisor
- Documents: Many-to-many with documents
- Loans: Various loan-related relationships

## File Structure

```
src/Screens/Employees/
├── index.js                    # Main exports
├── EmployeeDataGrid.jsx        # Main data grid component
├── CreateEmployee.jsx          # Employee creation form
├── EmployeeDetails.jsx         # Employee details modal
├── EmployeeDetailsTab.jsx      # Details tab content
├── EmployeeCustomFieldsTab.jsx # Custom fields tab
├── EmployeeFilesTab.jsx        # Files tab content
├── useEmployeeOperations.js    # Custom hook for API operations
└── README.md                   # This documentation
```

## Styling & Theme

The components use Material-UI with consistent styling:

- Primary colors for headers and actions
- Proper spacing and typography
- Responsive design
- Professional appearance
- Status chips with color coding
- Loading states and error handling

## Error Handling

Comprehensive error handling throughout:

- Network errors with retry options
- Validation errors with field-specific messages
- User-friendly error messages
- Loading states during operations
- Success confirmations

## Performance Optimizations

- **Lazy Loading**: Components load as needed
- **Memoization**: Expensive calculations memoized
- **Pagination**: Large datasets handled efficiently
- **Caching**: Employee data cached between views
- **Debounced Search**: Search input debounced for performance
- **Optimistic Updates**: UI updates before API confirmation

## Security Features

- Input validation and sanitization
- Secure file upload handling
- Permission-based actions
- Data encryption support
- Audit trail ready

## Future Enhancements

Potential improvements and features:

- [ ] Bulk operations (bulk edit, delete)
- [ ] Advanced filtering UI
- [ ] Employee hierarchy visualization
- [ ] Performance review integration
- [ ] Calendar integration
- [ ] Notifications system
- [ ] Mobile responsive improvements
- [ ] Offline support
- [ ] Advanced analytics dashboard

## Dependencies

Core dependencies:

- React 18+
- Material-UI (MUI) 5+
- AWS Amplify GraphQL
- @mui/x-data-grid
- @mui/x-date-pickers
- date-fns (for date handling)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

When contributing to this employee management system:

1. Follow the existing code patterns
2. Add proper error handling
3. Include loading states
4. Test with various data scenarios
5. Update documentation as needed
6. Ensure responsive design
7. Follow Material-UI best practices
