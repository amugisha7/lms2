// Employee Management System Configuration

export const EMPLOYEE_CONFIG = {
  // Pagination settings
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
  
  // File upload settings
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    '.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', 
    '.txt', '.xlsx', '.xls', '.csv', '.zip'
  ],
  
  // Custom field limits
  MAX_CUSTOM_FIELDS: 20,
  
  // Status options
  EMPLOYEE_STATUSES: [
    { value: 'ACTIVE', label: 'Active', color: 'success' },
    { value: 'INACTIVE', label: 'Inactive', color: 'default' },
    { value: 'PENDING', label: 'Pending', color: 'warning' },
    { value: 'SUSPENDED', label: 'Suspended', color: 'error' },
    { value: 'TERMINATED', label: 'Terminated', color: 'error' }
  ],
  
  // Employment types
  EMPLOYMENT_TYPES: [
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERN', label: 'Intern' },
    { value: 'CONSULTANT', label: 'Consultant' }
  ],
  
  // Employment statuses
  EMPLOYMENT_STATUSES: [
    { value: 'ACTIVE', label: 'Active', color: 'primary' },
    { value: 'INACTIVE', label: 'Inactive', color: 'default' },
    { value: 'SUSPENDED', label: 'Suspended', color: 'warning' },
    { value: 'TERMINATED', label: 'Terminated', color: 'error' }
  ],
  
  // Next of kin relationships
  RELATIONSHIPS: [
    { value: 'SPOUSE', label: 'Spouse' },
    { value: 'PARENT', label: 'Parent' },
    { value: 'CHILD', label: 'Child' },
    { value: 'SIBLING', label: 'Sibling' },
    { value: 'FRIEND', label: 'Friend' },
    { value: 'OTHER', label: 'Other' }
  ],
  
  // File categories
  FILE_CATEGORIES: [
    'HR Documents',
    'Identification',
    'Contracts',
    'Certificates',
    'Performance Reviews',
    'Training Materials',
    'Personal Files',
    'Other'
  ],
  
  // Custom field types
  CUSTOM_FIELD_TYPES: [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Dropdown' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'url', label: 'URL' }
  ],
  
  // Table column settings
  DEFAULT_COLUMNS: [
    'avatar',
    'fullName',
    'employmentPosition',
    'email',
    'phoneNumber1',
    'employmentDepartment',
    'employmentStatus',
    'status',
    'employmentStartDate',
    'actions'
  ],
  
  // Search settings
  SEARCH_DEBOUNCE_MS: 300,
  MIN_SEARCH_LENGTH: 2,
  
  // UI settings
  DIALOG_MAX_WIDTH: 'lg',
  SUCCESS_MESSAGE_DURATION: 3000,
  
  // Validation rules
  VALIDATION: {
    firstName: { required: true, minLength: 1, maxLength: 50 },
    lastName: { required: true, minLength: 1, maxLength: 50 },
    email: { required: true, format: 'email' },
    phoneNumber1: { required: true, minLength: 10 },
    employmentPosition: { required: true, minLength: 1, maxLength: 100 },
    grossSalary: { min: 0, max: 999999999 }
  }
};

export default EMPLOYEE_CONFIG;