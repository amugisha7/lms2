import { useState, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listEmployees, getEmployee } from '../../graphql/queries';
import { createEmployee, updateEmployee, deleteEmployee } from '../../graphql/mutations';

const client = generateClient();

export const useEmployeeOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all employees with pagination handling
  const fetchAllEmployees = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      let allEmployees = [];
      let nextToken = null;
      
      do {
        const variables = {
          limit: 1000, // Max items per request
          ...(nextToken && { nextToken }),
          ...(Object.keys(filters).length > 0 && { filter: filters })
        };
        
        const result = await client.graphql({
          query: listEmployees,
          variables
        });
        
        const { items, nextToken: newNextToken } = result.data.listEmployees;
        allEmployees = [...allEmployees, ...items];
        nextToken = newNextToken;
        
      } while (nextToken);
      
      return allEmployees;
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single employee with full details
  const fetchEmployee = useCallback(async (employeeId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.graphql({
        query: getEmployee,
        variables: { id: employeeId }
      });
      
      return result.data.getEmployee;
    } catch (err) {
      console.error('Error fetching employee:', err);
      setError('Failed to load employee details. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new employee
  const createNewEmployee = useCallback(async (employeeData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare the input data
      const input = { ...employeeData };
      
      // Convert dates to ISO string format
      if (input.dateOfBirth && input.dateOfBirth.format) {
        input.dateOfBirth = input.dateOfBirth.format('YYYY-MM-DD');
      }
      if (input.employmentStartDate && input.employmentStartDate.format) {
        input.employmentStartDate = input.employmentStartDate.format('YYYY-MM-DD');
      }
      if (input.employmentEndDate && input.employmentEndDate.format) {
        input.employmentEndDate = input.employmentEndDate.format('YYYY-MM-DD');
      }
      
      // Convert salary to float
      if (input.grossSalary) {
        input.grossSalary = parseFloat(input.grossSalary);
      }

      // Remove empty strings and null values
      Object.keys(input).forEach(key => {
        if (input[key] === '' || input[key] === null) {
          delete input[key];
        }
      });

      const result = await client.graphql({
        query: createEmployee,
        variables: { input }
      });

      return result.data.createEmployee;
    } catch (err) {
      console.error('Error creating employee:', err);
      setError('Failed to create employee. Please check your input and try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing employee
  const updateExistingEmployee = useCallback(async (employeeId, updateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const input = {
        id: employeeId,
        ...updateData
      };

      // Convert dates to ISO string format
      if (input.dateOfBirth && input.dateOfBirth.format) {
        input.dateOfBirth = input.dateOfBirth.format('YYYY-MM-DD');
      }
      if (input.employmentStartDate && input.employmentStartDate.format) {
        input.employmentStartDate = input.employmentStartDate.format('YYYY-MM-DD');
      }
      if (input.employmentEndDate && input.employmentEndDate.format) {
        input.employmentEndDate = input.employmentEndDate.format('YYYY-MM-DD');
      }
      
      // Convert salary to float
      if (input.grossSalary) {
        input.grossSalary = parseFloat(input.grossSalary);
      }

      // Remove fields that shouldn't be updated
      delete input.createdAt;
      delete input.updatedAt;
      delete input.__typename;
      delete input.branch;
      delete input.payroll;
      delete input.approvedLoans;
      delete input.approvedExpenses;
      delete input.approvedApplications;
      delete input.approvedCreditScores;
      delete input.approvedMoneyTransactions;
      delete input.approvedPayments;
      delete input.borrowers;
      delete input.supervisor;
      delete input.subordinates;
      delete input.creditScore;
      delete input.applications;
      delete input.documents;
      delete input.expenses;
      delete input.payments;
      delete input.loans;
      delete input.moneyTransactions;
      delete input.accounts;

      const result = await client.graphql({
        query: updateEmployee,
        variables: { input }
      });

      return result.data.updateEmployee;
    } catch (err) {
      console.error('Error updating employee:', err);
      setError('Failed to update employee. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete employee
  const deleteExistingEmployee = useCallback(async (employeeId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.graphql({
        query: deleteEmployee,
        variables: {
          input: { id: employeeId }
        }
      });

      return result.data.deleteEmployee;
    } catch (err) {
      console.error('Error deleting employee:', err);
      setError('Failed to delete employee. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search employees
  const searchEmployees = useCallback(async (searchTerm, filters = {}) => {
    try {
      const searchFilters = {
        ...filters,
        or: [
          { firstName: { contains: searchTerm } },
          { lastName: { contains: searchTerm } },
          { email: { contains: searchTerm } },
          { employmentPosition: { contains: searchTerm } },
          { employmentDepartment: { contains: searchTerm } }
        ]
      };

      return await fetchAllEmployees(searchFilters);
    } catch (err) {
      console.error('Error searching employees:', err);
      throw err;
    }
  }, [fetchAllEmployees]);

  // Get employees by status
  const getEmployeesByStatus = useCallback(async (status) => {
    try {
      const filters = { status: { eq: status } };
      return await fetchAllEmployees(filters);
    } catch (err) {
      console.error('Error fetching employees by status:', err);
      throw err;
    }
  }, [fetchAllEmployees]);

  // Get employees by department
  const getEmployeesByDepartment = useCallback(async (department) => {
    try {
      const filters = { employmentDepartment: { eq: department } };
      return await fetchAllEmployees(filters);
    } catch (err) {
      console.error('Error fetching employees by department:', err);
      throw err;
    }
  }, [fetchAllEmployees]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    clearError,
    fetchAllEmployees,
    fetchEmployee,
    createNewEmployee,
    updateExistingEmployee,
    deleteExistingEmployee,
    searchEmployees,
    getEmployeesByStatus,
    getEmployeesByDepartment
  };
};

export default useEmployeeOperations;