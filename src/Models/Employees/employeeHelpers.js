import {
  listBranches,
  employeesByRelatedUserID,
  borrowerLoanOfficersByBorrowerId,
} from "../../graphql/queries";
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  createBorrowerLoanOfficer,
  deleteBorrowerLoanOfficer,
} from "../../graphql/mutations";
import loggedClient from "../../loggedClient";

const client = loggedClient;

const EMPLOYEE_FIELDS = `
  id
  firstName
  lastName
  middleName
  dateOfBirth
  phoneNumber1
  phoneNumber2
  email
  title
  addressLine1
  addressLine2
  city
  stateProvince
  postalCode
  nextOfKinName
  nextOfKinPhoneNumber
  nextOfKinEmail
  nextOfKinRelationship
  nextOfKinAddress
  nationalID
  passportNumber
  nationality
  status
  employmentType
  employmentStatus
  employmentStartDate
  employmentEndDate
  employmentPosition
  employmentDepartment
  employmentGrade
  employmentLocation
  grossSalary
  bankAccountNumber
  bankName
  bankBranchCode
  socialSecurityNumber
  taxIdentificationNumber
  taxExemptStatus
  customFieldsData
  relatedUserID
  relatedBorrowerID
  supervisorID
  createdAt
  updatedAt
  branchEmployeesId
  branch {
    id
    name
    institutionBranchesId
  }
`;

const LIST_EMPLOYEES_WITH_BRANCH_QUERY = `
  query ListEmployeesWithBranch(
    $filter: ModelEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEmployees(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ${EMPLOYEE_FIELDS}
      }
      nextToken
    }
  }
`;

const GET_EMPLOYEE_WITH_BRANCH_QUERY = `
  query GetEmployeeWithBranch($id: ID!) {
    getEmployee(id: $id) {
      ${EMPLOYEE_FIELDS}
    }
  }
`;

const CREATE_ONBOARDING_EMPLOYEE_MUTATION = `
  mutation MyMutation($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      id
      branchEmployeesId
      email
      relatedUserID
    }
  }
`;

const sanitizeEmployeeInput = (input = {}) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "middleName",
    "dateOfBirth",
    "phoneNumber1",
    "phoneNumber2",
    "email",
    "title",
    "addressLine1",
    "addressLine2",
    "city",
    "stateProvince",
    "postalCode",
    "nextOfKinName",
    "nextOfKinPhoneNumber",
    "nextOfKinEmail",
    "nextOfKinRelationship",
    "nextOfKinAddress",
    "nationalID",
    "passportNumber",
    "nationality",
    "status",
    "employmentType",
    "employmentStatus",
    "employmentStartDate",
    "employmentEndDate",
    "employmentPosition",
    "employmentDepartment",
    "employmentGrade",
    "employmentLocation",
    "grossSalary",
    "bankAccountNumber",
    "bankName",
    "bankBranchCode",
    "socialSecurityNumber",
    "taxIdentificationNumber",
    "taxExemptStatus",
    "customFieldsData",
    "relatedUserID",
    "relatedBorrowerID",
    "supervisorID",
    "branchEmployeesId",
  ];

  return allowedFields.reduce((acc, field) => {
    const value = input[field];

    if (value === undefined) {
      return acc;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      acc[field] = trimmed === "" ? null : trimmed;
      return acc;
    }

    acc[field] = value;
    return acc;
  }, {});
};

const sortEmployees = (employees = []) => {
  return [...employees].sort((left, right) => {
    const leftTime = new Date(left?.createdAt || 0).getTime();
    const rightTime = new Date(right?.createdAt || 0).getTime();
    return leftTime - rightTime;
  });
};

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const fetchAllPages = async (query, variables, accessor) => {
  const results = [];
  let nextToken = null;

  do {
    const response = await client.graphql({
      query,
      variables: {
        ...variables,
        nextToken,
      },
    });

    const page = accessor(response) || {};
    results.push(...(page.items || []));
    nextToken = page.nextToken || null;
  } while (nextToken);

  return results;
};

export const getEmployeeDisplayName = (employee) => {
  if (!employee) return "Unassigned";

  const fullName = [employee.firstName, employee.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || employee.email || employee.id || "Unnamed Employee";
};

export const getEmployeeOptionLabel = (employee) => {
  const displayName = getEmployeeDisplayName(employee);
  const title = employee?.employmentPosition || employee?.title;
  return title ? `${displayName} (${title})` : displayName;
};

export const fetchEmployeeById = async (employeeId) => {
  if (!employeeId) return null;

  const response = await client.graphql({
    query: GET_EMPLOYEE_WITH_BRANCH_QUERY,
    variables: { id: employeeId },
  });

  return response?.data?.getEmployee || null;
};

export const listEmployeesByBranch = async (branchId) => {
  if (!branchId) return [];

  const employees = await fetchAllPages(
    LIST_EMPLOYEES_WITH_BRANCH_QUERY,
    {
      filter: {
        branchEmployeesId: { eq: branchId },
      },
      limit: 100,
    },
    (response) => response?.data?.listEmployees,
  );

  return sortEmployees(employees);
};

export const listEmployeesForUserContext = async (userDetails) => {
  if (!userDetails) return [];

  const normalizedUserType = String(userDetails.userType || "").toLowerCase();
  if (normalizedUserType !== "admin") {
    return listEmployeesByBranch(userDetails.branchUsersId || userDetails.branch?.id);
  }

  const institutionId = userDetails.institutionUsersId || userDetails.institution?.id;
  if (!institutionId) return [];

  const branchesResponse = await fetchAllPages(
    listBranches,
    {
      filter: { institutionBranchesId: { eq: institutionId } },
      limit: 100,
    },
    (response) => response?.data?.listBranches,
  );

  const branchIds = new Set((branchesResponse || []).map((branch) => branch.id));
  if (branchIds.size === 0) return [];

  const employees = await fetchAllPages(
    LIST_EMPLOYEES_WITH_BRANCH_QUERY,
    {
      limit: 200,
    },
    (response) => response?.data?.listEmployees,
  );

  return sortEmployees(
    employees.filter((employee) => branchIds.has(employee.branchEmployeesId)),
  );
};

export const fetchEmployeeByRelatedUserId = async (relatedUserID, branchId) => {
  if (!relatedUserID) return null;

  const response = await client.graphql({
    query: employeesByRelatedUserID,
    variables: {
      relatedUserID,
      limit: 25,
    },
  });

  const items = response?.data?.employeesByRelatedUserID?.items || [];
  const filtered = branchId
    ? items.filter((employee) => employee.branchEmployeesId === branchId)
    : items;

  return sortEmployees(filtered)[0] || sortEmployees(items)[0] || null;
};

export const getDefaultEmployeeForUserContext = async (userDetails) => {
  if (!userDetails) return null;

  const branchId = userDetails.branchUsersId || userDetails.branch?.id || null;
  const linkedEmployee = await fetchEmployeeByRelatedUserId(userDetails.id, branchId);
  if (linkedEmployee) {
    return linkedEmployee;
  }

  const employees = await listEmployeesByBranch(branchId);
  return employees[0] || null;
};

export const resolveEmployeeIdForUser = async ({
  userDetails,
  preferredEmployeeId,
  branchId,
}) => {
  if (preferredEmployeeId) {
    return preferredEmployeeId;
  }

  const resolved = await getDefaultEmployeeForUserContext({
    ...userDetails,
    branchUsersId: branchId || userDetails?.branchUsersId,
  });

  return resolved?.id || null;
};

export const createEmployeeRecord = async (input) => {
  const sanitizedInput = sanitizeEmployeeInput(input);
  const response = await client.graphql({
    query: createEmployee,
    variables: {
      input: {
        ...sanitizedInput,
        status: sanitizedInput.status || "active",
      },
    },
  });

  return response?.data?.createEmployee || null;
};

export const ensureDefaultEmployeeForUser = async ({
  userId,
  branchId,
  email,
}) => {
  if (!userId) {
    throw new Error("Cannot create a default employee without a user id.");
  }

  if (!branchId) {
    throw new Error("Cannot create a default employee without a branch id.");
  }

  const existingEmployee = await fetchEmployeeByRelatedUserId(userId, branchId);
  if (existingEmployee) {
    console.log("Default employee already exists for onboarding:", existingEmployee);
    return {
      employee: existingEmployee,
      created: false,
    };
  }

  const response = await client.graphql({
    query: CREATE_ONBOARDING_EMPLOYEE_MUTATION,
    variables: {
      input: {
        branchEmployeesId: branchId,
        email,
        relatedUserID: userId,
      },
    },
  });

  const createdEmployee = response?.data?.createEmployee || null;

  if (!createdEmployee?.id) {
    throw new Error("Default employee creation did not return an employee id.");
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const linkedEmployee = await fetchEmployeeByRelatedUserId(userId, branchId);

    if (linkedEmployee?.id) {
      console.log("Default employee verified after onboarding:", linkedEmployee);
      return {
        employee: linkedEmployee,
        created: true,
      };
    }

    await wait(300 * (attempt + 1));
  }

  console.warn(
    "Default employee mutation succeeded but related-user lookup has not hydrated yet; returning the created record.",
    createdEmployee,
  );

  return {
    employee: createdEmployee,
    created: true,
  };
};

export const updateEmployeeRecord = async (input) => {
  const sanitizedInput = sanitizeEmployeeInput(input);
  const response = await client.graphql({
    query: updateEmployee,
    variables: {
      input: sanitizedInput,
    },
  });

  return response?.data?.updateEmployee || null;
};

export const deleteEmployeeRecord = async (id) => {
  if (!id) return null;

  const response = await client.graphql({
    query: deleteEmployee,
    variables: {
      input: { id },
    },
  });

  return response?.data?.deleteEmployee || null;
};

export const getBorrowerAssignedEmployeeId = async (borrowerId) => {
  if (!borrowerId) return null;

  const response = await client.graphql({
    query: borrowerLoanOfficersByBorrowerId,
    variables: {
      borrowerId,
      limit: 100,
    },
  });

  const items = response?.data?.borrowerLoanOfficersByBorrowerId?.items || [];
  return items[0]?.employeeId || null;
};

export const syncBorrowerEmployeeAssignment = async ({
  borrowerId,
  employeeId,
}) => {
  if (!borrowerId) return null;

  const existingResponse = await client.graphql({
    query: borrowerLoanOfficersByBorrowerId,
    variables: {
      borrowerId,
      limit: 100,
    },
  });

  const existingItems =
    existingResponse?.data?.borrowerLoanOfficersByBorrowerId?.items || [];

  const itemsToDelete = existingItems.filter(
    (item) => !employeeId || item.employeeId !== employeeId,
  );

  await Promise.all(
    itemsToDelete.map((item) =>
      client.graphql({
        query: deleteBorrowerLoanOfficer,
        variables: {
          input: { id: item.id },
        },
      }),
    ),
  );

  if (!employeeId) {
    return null;
  }

  const alreadyLinked = existingItems.some((item) => item.employeeId === employeeId);
  if (alreadyLinked) {
    return existingItems.find((item) => item.employeeId === employeeId) || null;
  }

  const created = await client.graphql({
    query: createBorrowerLoanOfficer,
    variables: {
      input: {
        borrowerId,
        employeeId,
      },
    },
  });

  return created?.data?.createBorrowerLoanOfficer || null;
};