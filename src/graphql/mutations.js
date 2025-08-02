/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createInstitution = /* GraphQL */ `
  mutation CreateInstitution(
    $input: CreateInstitutionInput!
    $condition: ModelInstitutionConditionInput
  ) {
    createInstitution(input: $input, condition: $condition) {
      id
      name
      currencyCode
      subscriptionTier
      subscriptionStatus
      trialEndDate
      nextBillingDate
      stripeCustomerID
      stripeSubscriptionID
      defaultDateFormat
      defaultCurrencyFormat
      defaultLanguage
      regulatoryRegion
      maxUsers
      maxBranches
      maxStaffPerBranch
      saccoFeaturesEnabled
      staffManagementEnabled
      payrollEnabled
      collectionsModuleEnabled
      customWorkflowsEnabled
      advancedReportingEnabled
      apiIntegrationSettings
      users {
        nextToken
        __typename
      }
      branches {
        nextToken
        __typename
      }
      loanProducts {
        nextToken
        __typename
      }
      customFormFields {
        nextToken
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateInstitution = /* GraphQL */ `
  mutation UpdateInstitution(
    $input: UpdateInstitutionInput!
    $condition: ModelInstitutionConditionInput
  ) {
    updateInstitution(input: $input, condition: $condition) {
      id
      name
      currencyCode
      subscriptionTier
      subscriptionStatus
      trialEndDate
      nextBillingDate
      stripeCustomerID
      stripeSubscriptionID
      defaultDateFormat
      defaultCurrencyFormat
      defaultLanguage
      regulatoryRegion
      maxUsers
      maxBranches
      maxStaffPerBranch
      saccoFeaturesEnabled
      staffManagementEnabled
      payrollEnabled
      collectionsModuleEnabled
      customWorkflowsEnabled
      advancedReportingEnabled
      apiIntegrationSettings
      users {
        nextToken
        __typename
      }
      branches {
        nextToken
        __typename
      }
      loanProducts {
        nextToken
        __typename
      }
      customFormFields {
        nextToken
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteInstitution = /* GraphQL */ `
  mutation DeleteInstitution(
    $input: DeleteInstitutionInput!
    $condition: ModelInstitutionConditionInput
  ) {
    deleteInstitution(input: $input, condition: $condition) {
      id
      name
      currencyCode
      subscriptionTier
      subscriptionStatus
      trialEndDate
      nextBillingDate
      stripeCustomerID
      stripeSubscriptionID
      defaultDateFormat
      defaultCurrencyFormat
      defaultLanguage
      regulatoryRegion
      maxUsers
      maxBranches
      maxStaffPerBranch
      saccoFeaturesEnabled
      staffManagementEnabled
      payrollEnabled
      collectionsModuleEnabled
      customWorkflowsEnabled
      advancedReportingEnabled
      apiIntegrationSettings
      users {
        nextToken
        __typename
      }
      branches {
        nextToken
        __typename
      }
      loanProducts {
        nextToken
        __typename
      }
      customFormFields {
        nextToken
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createBranch = /* GraphQL */ `
  mutation CreateBranch(
    $input: CreateBranchInput!
    $condition: ModelBranchConditionInput
  ) {
    createBranch(input: $input, condition: $condition) {
      id
      name
      branchCode
      address
      status
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      users {
        nextToken
        __typename
      }
      borrowers {
        nextToken
        __typename
      }
      employees {
        nextToken
        __typename
      }
      accounts {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      loanProducts {
        nextToken
        __typename
      }
      payrolls {
        nextToken
        __typename
      }
      financialReports {
        nextToken
        __typename
      }
      customFormFields {
        nextToken
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      institutionBranchesId
      __typename
    }
  }
`;
export const updateBranch = /* GraphQL */ `
  mutation UpdateBranch(
    $input: UpdateBranchInput!
    $condition: ModelBranchConditionInput
  ) {
    updateBranch(input: $input, condition: $condition) {
      id
      name
      branchCode
      address
      status
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      users {
        nextToken
        __typename
      }
      borrowers {
        nextToken
        __typename
      }
      employees {
        nextToken
        __typename
      }
      accounts {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      loanProducts {
        nextToken
        __typename
      }
      payrolls {
        nextToken
        __typename
      }
      financialReports {
        nextToken
        __typename
      }
      customFormFields {
        nextToken
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      institutionBranchesId
      __typename
    }
  }
`;
export const deleteBranch = /* GraphQL */ `
  mutation DeleteBranch(
    $input: DeleteBranchInput!
    $condition: ModelBranchConditionInput
  ) {
    deleteBranch(input: $input, condition: $condition) {
      id
      name
      branchCode
      address
      status
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      users {
        nextToken
        __typename
      }
      borrowers {
        nextToken
        __typename
      }
      employees {
        nextToken
        __typename
      }
      accounts {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      loanProducts {
        nextToken
        __typename
      }
      payrolls {
        nextToken
        __typename
      }
      financialReports {
        nextToken
        __typename
      }
      customFormFields {
        nextToken
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      institutionBranchesId
      __typename
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      firstName
      lastName
      middleName
      dateOfBirth
      phoneNumber1
      phoneNumber2
      email
      addressLine1
      addressLine2
      city
      stateProvince
      postalCode
      nationalID
      passportNumber
      nationality
      status
      userType
      description
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      userNotifications {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      institutionUsersId
      branchUsersId
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      firstName
      lastName
      middleName
      dateOfBirth
      phoneNumber1
      phoneNumber2
      email
      addressLine1
      addressLine2
      city
      stateProvince
      postalCode
      nationalID
      passportNumber
      nationality
      status
      userType
      description
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      userNotifications {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      institutionUsersId
      branchUsersId
      __typename
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      firstName
      lastName
      middleName
      dateOfBirth
      phoneNumber1
      phoneNumber2
      email
      addressLine1
      addressLine2
      city
      stateProvince
      postalCode
      nationalID
      passportNumber
      nationality
      status
      userType
      description
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      userNotifications {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      institutionUsersId
      branchUsersId
      __typename
    }
  }
`;
export const createEmployee = /* GraphQL */ `
  mutation CreateEmployee(
    $input: CreateEmployeeInput!
    $condition: ModelEmployeeConditionInput
  ) {
    createEmployee(input: $input, condition: $condition) {
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
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      relatedUserID
      relatedBorrowerID
      payroll {
        nextToken
        __typename
      }
      approvedLoans {
        nextToken
        __typename
      }
      approvedExpenses {
        nextToken
        __typename
      }
      approvedApplications {
        nextToken
        __typename
      }
      approvedCreditScores {
        nextToken
        __typename
      }
      approvedMoneyTransactions {
        nextToken
        __typename
      }
      approvedPayments {
        nextToken
        __typename
      }
      borrowers {
        nextToken
        __typename
      }
      supervisorID
      supervisor {
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
        __typename
      }
      subordinates {
        nextToken
        __typename
      }
      creditScore {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      payments {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      moneyTransactions {
        nextToken
        __typename
      }
      accounts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      branchEmployeesId
      __typename
    }
  }
`;
export const updateEmployee = /* GraphQL */ `
  mutation UpdateEmployee(
    $input: UpdateEmployeeInput!
    $condition: ModelEmployeeConditionInput
  ) {
    updateEmployee(input: $input, condition: $condition) {
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
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      relatedUserID
      relatedBorrowerID
      payroll {
        nextToken
        __typename
      }
      approvedLoans {
        nextToken
        __typename
      }
      approvedExpenses {
        nextToken
        __typename
      }
      approvedApplications {
        nextToken
        __typename
      }
      approvedCreditScores {
        nextToken
        __typename
      }
      approvedMoneyTransactions {
        nextToken
        __typename
      }
      approvedPayments {
        nextToken
        __typename
      }
      borrowers {
        nextToken
        __typename
      }
      supervisorID
      supervisor {
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
        __typename
      }
      subordinates {
        nextToken
        __typename
      }
      creditScore {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      payments {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      moneyTransactions {
        nextToken
        __typename
      }
      accounts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      branchEmployeesId
      __typename
    }
  }
`;
export const deleteEmployee = /* GraphQL */ `
  mutation DeleteEmployee(
    $input: DeleteEmployeeInput!
    $condition: ModelEmployeeConditionInput
  ) {
    deleteEmployee(input: $input, condition: $condition) {
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
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      relatedUserID
      relatedBorrowerID
      payroll {
        nextToken
        __typename
      }
      approvedLoans {
        nextToken
        __typename
      }
      approvedExpenses {
        nextToken
        __typename
      }
      approvedApplications {
        nextToken
        __typename
      }
      approvedCreditScores {
        nextToken
        __typename
      }
      approvedMoneyTransactions {
        nextToken
        __typename
      }
      approvedPayments {
        nextToken
        __typename
      }
      borrowers {
        nextToken
        __typename
      }
      supervisorID
      supervisor {
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
        __typename
      }
      subordinates {
        nextToken
        __typename
      }
      creditScore {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      payments {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      moneyTransactions {
        nextToken
        __typename
      }
      accounts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      branchEmployeesId
      __typename
    }
  }
`;
export const createBorrower = /* GraphQL */ `
  mutation CreateBorrower(
    $input: CreateBorrowerInput!
    $condition: ModelBorrowerConditionInput
  ) {
    createBorrower(input: $input, condition: $condition) {
      id
      firstname
      othername
      businessName
      typeOfBusiness
      uniqueIdNumber
      phoneNumber
      otherPhoneNumber
      email
      gender
      dateOfBirth
      nationality
      nationalIdPicture
      passportPicture
      address
      points
      borrowerOpeningBalance
      borrowerClosingBalance
      borrowerInterestRate
      city
      state
      title
      zipcode
      employmentStatus
      employerName
      creditScore
      additionalNote1
      additionalNote2
      borrowerDocument1
      borrowerDocument1URL
      borrowerDocument2
      borrowerDocument2URL
      borrowerDocument3
      borrowerDocument3URL
      borrowerDocument4
      borrowerDocument4URL
      borrowerStatus
      borrowertype
      borrowerAttribute1
      borrowerAttribute2
      customFieldsData
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      loans {
        nextToken
        __typename
      }
      guarantors {
        nextToken
        __typename
      }
      securities {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      employees {
        nextToken
        __typename
      }
      collaterals {
        nextToken
        __typename
      }
      creditScores {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      branchBorrowersId
      __typename
    }
  }
`;
export const updateBorrower = /* GraphQL */ `
  mutation UpdateBorrower(
    $input: UpdateBorrowerInput!
    $condition: ModelBorrowerConditionInput
  ) {
    updateBorrower(input: $input, condition: $condition) {
      id
      firstname
      othername
      businessName
      typeOfBusiness
      uniqueIdNumber
      phoneNumber
      otherPhoneNumber
      email
      gender
      dateOfBirth
      nationality
      nationalIdPicture
      passportPicture
      address
      points
      borrowerOpeningBalance
      borrowerClosingBalance
      borrowerInterestRate
      city
      state
      title
      zipcode
      employmentStatus
      employerName
      creditScore
      additionalNote1
      additionalNote2
      borrowerDocument1
      borrowerDocument1URL
      borrowerDocument2
      borrowerDocument2URL
      borrowerDocument3
      borrowerDocument3URL
      borrowerDocument4
      borrowerDocument4URL
      borrowerStatus
      borrowertype
      borrowerAttribute1
      borrowerAttribute2
      customFieldsData
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      loans {
        nextToken
        __typename
      }
      guarantors {
        nextToken
        __typename
      }
      securities {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      employees {
        nextToken
        __typename
      }
      collaterals {
        nextToken
        __typename
      }
      creditScores {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      branchBorrowersId
      __typename
    }
  }
`;
export const deleteBorrower = /* GraphQL */ `
  mutation DeleteBorrower(
    $input: DeleteBorrowerInput!
    $condition: ModelBorrowerConditionInput
  ) {
    deleteBorrower(input: $input, condition: $condition) {
      id
      firstname
      othername
      businessName
      typeOfBusiness
      uniqueIdNumber
      phoneNumber
      otherPhoneNumber
      email
      gender
      dateOfBirth
      nationality
      nationalIdPicture
      passportPicture
      address
      points
      borrowerOpeningBalance
      borrowerClosingBalance
      borrowerInterestRate
      city
      state
      title
      zipcode
      employmentStatus
      employerName
      creditScore
      additionalNote1
      additionalNote2
      borrowerDocument1
      borrowerDocument1URL
      borrowerDocument2
      borrowerDocument2URL
      borrowerDocument3
      borrowerDocument3URL
      borrowerDocument4
      borrowerDocument4URL
      borrowerStatus
      borrowertype
      borrowerAttribute1
      borrowerAttribute2
      customFieldsData
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      loans {
        nextToken
        __typename
      }
      guarantors {
        nextToken
        __typename
      }
      securities {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      employees {
        nextToken
        __typename
      }
      collaterals {
        nextToken
        __typename
      }
      creditScores {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      branchBorrowersId
      __typename
    }
  }
`;
export const createGuarantor = /* GraphQL */ `
  mutation CreateGuarantor(
    $input: CreateGuarantorInput!
    $condition: ModelGuarantorConditionInput
  ) {
    createGuarantor(input: $input, condition: $condition) {
      id
      name
      relationship
      phoneNumber
      email
      address
      customFieldsData
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      loans {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      borrowerGuarantorsId
      __typename
    }
  }
`;
export const updateGuarantor = /* GraphQL */ `
  mutation UpdateGuarantor(
    $input: UpdateGuarantorInput!
    $condition: ModelGuarantorConditionInput
  ) {
    updateGuarantor(input: $input, condition: $condition) {
      id
      name
      relationship
      phoneNumber
      email
      address
      customFieldsData
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      loans {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      borrowerGuarantorsId
      __typename
    }
  }
`;
export const deleteGuarantor = /* GraphQL */ `
  mutation DeleteGuarantor(
    $input: DeleteGuarantorInput!
    $condition: ModelGuarantorConditionInput
  ) {
    deleteGuarantor(input: $input, condition: $condition) {
      id
      name
      relationship
      phoneNumber
      email
      address
      customFieldsData
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      loans {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      borrowerGuarantorsId
      __typename
    }
  }
`;
export const createSecurity = /* GraphQL */ `
  mutation CreateSecurity(
    $input: CreateSecurityInput!
    $condition: ModelSecurityConditionInput
  ) {
    createSecurity(input: $input, condition: $condition) {
      id
      name
      type
      description
      value
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      createdAt
      updatedAt
      borrowerSecuritiesId
      __typename
    }
  }
`;
export const updateSecurity = /* GraphQL */ `
  mutation UpdateSecurity(
    $input: UpdateSecurityInput!
    $condition: ModelSecurityConditionInput
  ) {
    updateSecurity(input: $input, condition: $condition) {
      id
      name
      type
      description
      value
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      createdAt
      updatedAt
      borrowerSecuritiesId
      __typename
    }
  }
`;
export const deleteSecurity = /* GraphQL */ `
  mutation DeleteSecurity(
    $input: DeleteSecurityInput!
    $condition: ModelSecurityConditionInput
  ) {
    deleteSecurity(input: $input, condition: $condition) {
      id
      name
      type
      description
      value
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      createdAt
      updatedAt
      borrowerSecuritiesId
      __typename
    }
  }
`;
export const createUserNotification = /* GraphQL */ `
  mutation CreateUserNotification(
    $input: CreateUserNotificationInput!
    $condition: ModelUserNotificationConditionInput
  ) {
    createUserNotification(input: $input, condition: $condition) {
      id
      eventType
      name
      description
      reference
      message
      status
      user {
        id
        firstName
        lastName
        middleName
        dateOfBirth
        phoneNumber1
        phoneNumber2
        email
        addressLine1
        addressLine2
        city
        stateProvince
        postalCode
        nationalID
        passportNumber
        nationality
        status
        userType
        description
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      createdAt
      updatedAt
      userUserNotificationsId
      __typename
    }
  }
`;
export const updateUserNotification = /* GraphQL */ `
  mutation UpdateUserNotification(
    $input: UpdateUserNotificationInput!
    $condition: ModelUserNotificationConditionInput
  ) {
    updateUserNotification(input: $input, condition: $condition) {
      id
      eventType
      name
      description
      reference
      message
      status
      user {
        id
        firstName
        lastName
        middleName
        dateOfBirth
        phoneNumber1
        phoneNumber2
        email
        addressLine1
        addressLine2
        city
        stateProvince
        postalCode
        nationalID
        passportNumber
        nationality
        status
        userType
        description
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      createdAt
      updatedAt
      userUserNotificationsId
      __typename
    }
  }
`;
export const deleteUserNotification = /* GraphQL */ `
  mutation DeleteUserNotification(
    $input: DeleteUserNotificationInput!
    $condition: ModelUserNotificationConditionInput
  ) {
    deleteUserNotification(input: $input, condition: $condition) {
      id
      eventType
      name
      description
      reference
      message
      status
      user {
        id
        firstName
        lastName
        middleName
        dateOfBirth
        phoneNumber1
        phoneNumber2
        email
        addressLine1
        addressLine2
        city
        stateProvince
        postalCode
        nationalID
        passportNumber
        nationality
        status
        userType
        description
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      createdAt
      updatedAt
      userUserNotificationsId
      __typename
    }
  }
`;
export const createLoanProduct = /* GraphQL */ `
  mutation CreateLoanProduct(
    $input: CreateLoanProductInput!
    $condition: ModelLoanProductConditionInput
  ) {
    createLoanProduct(input: $input, condition: $condition) {
      id
      name
      description
      principalAmountMin
      principalAmountMax
      principalAmountDefault
      interestRateMin
      interestRateMax
      interestRateDefault
      interestCalculationMethod
      interestType
      interestPeriod
      termDurationMin
      termDurationMax
      termDurationDefault
      durationPeriod
      repaymentFrequency
      repaymentOrder
      extendLoanAfterMaturity
      interestTypeMaturity
      calculateInterestOn
      loanInterestRateAfterMaturity
      recurringPeriodAfterMaturityUnit
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      branches {
        nextToken
        __typename
      }
      loanFees {
        nextToken
        __typename
      }
      loanPenalties {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      institutionLoanProductsId
      __typename
    }
  }
`;
export const updateLoanProduct = /* GraphQL */ `
  mutation UpdateLoanProduct(
    $input: UpdateLoanProductInput!
    $condition: ModelLoanProductConditionInput
  ) {
    updateLoanProduct(input: $input, condition: $condition) {
      id
      name
      description
      principalAmountMin
      principalAmountMax
      principalAmountDefault
      interestRateMin
      interestRateMax
      interestRateDefault
      interestCalculationMethod
      interestType
      interestPeriod
      termDurationMin
      termDurationMax
      termDurationDefault
      durationPeriod
      repaymentFrequency
      repaymentOrder
      extendLoanAfterMaturity
      interestTypeMaturity
      calculateInterestOn
      loanInterestRateAfterMaturity
      recurringPeriodAfterMaturityUnit
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      branches {
        nextToken
        __typename
      }
      loanFees {
        nextToken
        __typename
      }
      loanPenalties {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      institutionLoanProductsId
      __typename
    }
  }
`;
export const deleteLoanProduct = /* GraphQL */ `
  mutation DeleteLoanProduct(
    $input: DeleteLoanProductInput!
    $condition: ModelLoanProductConditionInput
  ) {
    deleteLoanProduct(input: $input, condition: $condition) {
      id
      name
      description
      principalAmountMin
      principalAmountMax
      principalAmountDefault
      interestRateMin
      interestRateMax
      interestRateDefault
      interestCalculationMethod
      interestType
      interestPeriod
      termDurationMin
      termDurationMax
      termDurationDefault
      durationPeriod
      repaymentFrequency
      repaymentOrder
      extendLoanAfterMaturity
      interestTypeMaturity
      calculateInterestOn
      loanInterestRateAfterMaturity
      recurringPeriodAfterMaturityUnit
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      branches {
        nextToken
        __typename
      }
      loanFees {
        nextToken
        __typename
      }
      loanPenalties {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      institutionLoanProductsId
      __typename
    }
  }
`;
export const createCreditScore = /* GraphQL */ `
  mutation CreateCreditScore(
    $input: CreateCreditScoreInput!
    $condition: ModelCreditScoreConditionInput
  ) {
    createCreditScore(input: $input, condition: $condition) {
      id
      name
      description
      score
      scoreDate
      scoreSource
      scoreStatus
      approvedByEmployees {
        nextToken
        __typename
      }
      borrowerID
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateCreditScore = /* GraphQL */ `
  mutation UpdateCreditScore(
    $input: UpdateCreditScoreInput!
    $condition: ModelCreditScoreConditionInput
  ) {
    updateCreditScore(input: $input, condition: $condition) {
      id
      name
      description
      score
      scoreDate
      scoreSource
      scoreStatus
      approvedByEmployees {
        nextToken
        __typename
      }
      borrowerID
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteCreditScore = /* GraphQL */ `
  mutation DeleteCreditScore(
    $input: DeleteCreditScoreInput!
    $condition: ModelCreditScoreConditionInput
  ) {
    deleteCreditScore(input: $input, condition: $condition) {
      id
      name
      description
      score
      scoreDate
      scoreSource
      scoreStatus
      approvedByEmployees {
        nextToken
        __typename
      }
      borrowerID
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createDocument = /* GraphQL */ `
  mutation CreateDocument(
    $input: CreateDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    createDocument(input: $input, condition: $condition) {
      id
      documentType
      documentName
      documentDescription
      serialNumber
      documentDate
      s3Key
      fileName
      contentType
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      borrowers {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      payments {
        nextToken
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      branchDocumentsId
      __typename
    }
  }
`;
export const updateDocument = /* GraphQL */ `
  mutation UpdateDocument(
    $input: UpdateDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    updateDocument(input: $input, condition: $condition) {
      id
      documentType
      documentName
      documentDescription
      serialNumber
      documentDate
      s3Key
      fileName
      contentType
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      borrowers {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      payments {
        nextToken
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      branchDocumentsId
      __typename
    }
  }
`;
export const deleteDocument = /* GraphQL */ `
  mutation DeleteDocument(
    $input: DeleteDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    deleteDocument(input: $input, condition: $condition) {
      id
      documentType
      documentName
      documentDescription
      serialNumber
      documentDate
      s3Key
      fileName
      contentType
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      borrowers {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      payments {
        nextToken
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      branchDocumentsId
      __typename
    }
  }
`;
export const createContract = /* GraphQL */ `
  mutation CreateContract(
    $input: CreateContractInput!
    $condition: ModelContractConditionInput
  ) {
    createContract(input: $input, condition: $condition) {
      id
      contractNumber
      contractType
      contractDate
      contractStatus
      contractRecord
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      applications {
        nextToken
        __typename
      }
      collaterals {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      borrowerContractsId
      __typename
    }
  }
`;
export const updateContract = /* GraphQL */ `
  mutation UpdateContract(
    $input: UpdateContractInput!
    $condition: ModelContractConditionInput
  ) {
    updateContract(input: $input, condition: $condition) {
      id
      contractNumber
      contractType
      contractDate
      contractStatus
      contractRecord
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      applications {
        nextToken
        __typename
      }
      collaterals {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      borrowerContractsId
      __typename
    }
  }
`;
export const deleteContract = /* GraphQL */ `
  mutation DeleteContract(
    $input: DeleteContractInput!
    $condition: ModelContractConditionInput
  ) {
    deleteContract(input: $input, condition: $condition) {
      id
      contractNumber
      contractType
      contractDate
      contractStatus
      contractRecord
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      applications {
        nextToken
        __typename
      }
      collaterals {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      borrowerContractsId
      __typename
    }
  }
`;
export const createApplication = /* GraphQL */ `
  mutation CreateApplication(
    $input: CreateApplicationInput!
    $condition: ModelApplicationConditionInput
  ) {
    createApplication(input: $input, condition: $condition) {
      id
      name
      description
      applicationNumber
      requestedPrincipalAmount
      requestedTermMonths
      requestedFrequency
      applicationDate
      status
      applicationRecord
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      guarantors {
        nextToken
        __typename
      }
      collateral {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      loanProductID
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      customFieldsData
      createdAt
      updatedAt
      borrowerApplicationsId
      __typename
    }
  }
`;
export const updateApplication = /* GraphQL */ `
  mutation UpdateApplication(
    $input: UpdateApplicationInput!
    $condition: ModelApplicationConditionInput
  ) {
    updateApplication(input: $input, condition: $condition) {
      id
      name
      description
      applicationNumber
      requestedPrincipalAmount
      requestedTermMonths
      requestedFrequency
      applicationDate
      status
      applicationRecord
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      guarantors {
        nextToken
        __typename
      }
      collateral {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      loanProductID
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      customFieldsData
      createdAt
      updatedAt
      borrowerApplicationsId
      __typename
    }
  }
`;
export const deleteApplication = /* GraphQL */ `
  mutation DeleteApplication(
    $input: DeleteApplicationInput!
    $condition: ModelApplicationConditionInput
  ) {
    deleteApplication(input: $input, condition: $condition) {
      id
      name
      description
      applicationNumber
      requestedPrincipalAmount
      requestedTermMonths
      requestedFrequency
      applicationDate
      status
      applicationRecord
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      guarantors {
        nextToken
        __typename
      }
      collateral {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      loanProductID
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      customFieldsData
      createdAt
      updatedAt
      borrowerApplicationsId
      __typename
    }
  }
`;
export const createCollateral = /* GraphQL */ `
  mutation CreateCollateral(
    $input: CreateCollateralInput!
    $condition: ModelCollateralConditionInput
  ) {
    createCollateral(input: $input, condition: $condition) {
      id
      name
      type
      description
      location
      value
      serialNumber
      registrationNumber
      insuranceDetails
      insuranceExpiryDate
      insuranceCompany
      storedAt
      customFieldsData
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      loans {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      borrowerCollateralsId
      __typename
    }
  }
`;
export const updateCollateral = /* GraphQL */ `
  mutation UpdateCollateral(
    $input: UpdateCollateralInput!
    $condition: ModelCollateralConditionInput
  ) {
    updateCollateral(input: $input, condition: $condition) {
      id
      name
      type
      description
      location
      value
      serialNumber
      registrationNumber
      insuranceDetails
      insuranceExpiryDate
      insuranceCompany
      storedAt
      customFieldsData
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      loans {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      borrowerCollateralsId
      __typename
    }
  }
`;
export const deleteCollateral = /* GraphQL */ `
  mutation DeleteCollateral(
    $input: DeleteCollateralInput!
    $condition: ModelCollateralConditionInput
  ) {
    deleteCollateral(input: $input, condition: $condition) {
      id
      name
      type
      description
      location
      value
      serialNumber
      registrationNumber
      insuranceDetails
      insuranceExpiryDate
      insuranceCompany
      storedAt
      customFieldsData
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      loans {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      borrowerCollateralsId
      __typename
    }
  }
`;
export const createLoan = /* GraphQL */ `
  mutation CreateLoan(
    $input: CreateLoanInput!
    $condition: ModelLoanConditionInput
  ) {
    createLoan(input: $input, condition: $condition) {
      id
      approvalStatus
      approvedDate
      principal
      fees
      interestRate
      startDate
      maturityDate
      stopDate
      extensionPeriod
      duration
      durationInterval
      loanType
      rateInterval
      loanStatus
      loanCurrency
      loanPurpose
      loanComputationRecord
      loanAttribute1
      loanAttribute2
      numberOfPayments
      paymentFrequency
      customFieldsData
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      payments {
        nextToken
        __typename
      }
      loanFees {
        nextToken
        __typename
      }
      penalties {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      accounts {
        nextToken
        __typename
      }
      guarantors {
        nextToken
        __typename
      }
      collateral {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      loanProductID
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      borrowerLoansId
      __typename
    }
  }
`;
export const updateLoan = /* GraphQL */ `
  mutation UpdateLoan(
    $input: UpdateLoanInput!
    $condition: ModelLoanConditionInput
  ) {
    updateLoan(input: $input, condition: $condition) {
      id
      approvalStatus
      approvedDate
      principal
      fees
      interestRate
      startDate
      maturityDate
      stopDate
      extensionPeriod
      duration
      durationInterval
      loanType
      rateInterval
      loanStatus
      loanCurrency
      loanPurpose
      loanComputationRecord
      loanAttribute1
      loanAttribute2
      numberOfPayments
      paymentFrequency
      customFieldsData
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      payments {
        nextToken
        __typename
      }
      loanFees {
        nextToken
        __typename
      }
      penalties {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      accounts {
        nextToken
        __typename
      }
      guarantors {
        nextToken
        __typename
      }
      collateral {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      loanProductID
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      borrowerLoansId
      __typename
    }
  }
`;
export const deleteLoan = /* GraphQL */ `
  mutation DeleteLoan(
    $input: DeleteLoanInput!
    $condition: ModelLoanConditionInput
  ) {
    deleteLoan(input: $input, condition: $condition) {
      id
      approvalStatus
      approvedDate
      principal
      fees
      interestRate
      startDate
      maturityDate
      stopDate
      extensionPeriod
      duration
      durationInterval
      loanType
      rateInterval
      loanStatus
      loanCurrency
      loanPurpose
      loanComputationRecord
      loanAttribute1
      loanAttribute2
      numberOfPayments
      paymentFrequency
      customFieldsData
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      payments {
        nextToken
        __typename
      }
      loanFees {
        nextToken
        __typename
      }
      penalties {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      accounts {
        nextToken
        __typename
      }
      guarantors {
        nextToken
        __typename
      }
      collateral {
        nextToken
        __typename
      }
      contracts {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      loanProductID
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      borrowerLoansId
      __typename
    }
  }
`;
export const createInvestment = /* GraphQL */ `
  mutation CreateInvestment(
    $input: CreateInvestmentInput!
    $condition: ModelInvestmentConditionInput
  ) {
    createInvestment(input: $input, condition: $condition) {
      id
      principal
      description
      fees
      interestRate
      startDate
      maturityDate
      stopDate
      extensionPeriod
      duration
      durationInterval
      type
      rateInterval
      investmentStatus
      investmentAttribute1
      investmentAttribute2
      numberOfPayments
      paymentFrequency
      accounts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateInvestment = /* GraphQL */ `
  mutation UpdateInvestment(
    $input: UpdateInvestmentInput!
    $condition: ModelInvestmentConditionInput
  ) {
    updateInvestment(input: $input, condition: $condition) {
      id
      principal
      description
      fees
      interestRate
      startDate
      maturityDate
      stopDate
      extensionPeriod
      duration
      durationInterval
      type
      rateInterval
      investmentStatus
      investmentAttribute1
      investmentAttribute2
      numberOfPayments
      paymentFrequency
      accounts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteInvestment = /* GraphQL */ `
  mutation DeleteInvestment(
    $input: DeleteInvestmentInput!
    $condition: ModelInvestmentConditionInput
  ) {
    deleteInvestment(input: $input, condition: $condition) {
      id
      principal
      description
      fees
      interestRate
      startDate
      maturityDate
      stopDate
      extensionPeriod
      duration
      durationInterval
      type
      rateInterval
      investmentStatus
      investmentAttribute1
      investmentAttribute2
      numberOfPayments
      paymentFrequency
      accounts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLoanFees = /* GraphQL */ `
  mutation CreateLoanFees(
    $input: CreateLoanFeesInput!
    $condition: ModelLoanFeesConditionInput
  ) {
    createLoanFees(input: $input, condition: $condition) {
      id
      amount
      loanFeesName
      loanFeesCategory
      loanFeesCalculationMethod
      loanFeesRate
      loanFeesDate
      loanFeesStatus
      notes
      loanFeesType
      loanFeesDescription
      loanFeesAttribute1
      loanFeesAttribute2
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      loanProducts {
        nextToken
        __typename
      }
      accountID
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      loanLoanFeesId
      __typename
    }
  }
`;
export const updateLoanFees = /* GraphQL */ `
  mutation UpdateLoanFees(
    $input: UpdateLoanFeesInput!
    $condition: ModelLoanFeesConditionInput
  ) {
    updateLoanFees(input: $input, condition: $condition) {
      id
      amount
      loanFeesName
      loanFeesCategory
      loanFeesCalculationMethod
      loanFeesRate
      loanFeesDate
      loanFeesStatus
      notes
      loanFeesType
      loanFeesDescription
      loanFeesAttribute1
      loanFeesAttribute2
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      loanProducts {
        nextToken
        __typename
      }
      accountID
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      loanLoanFeesId
      __typename
    }
  }
`;
export const deleteLoanFees = /* GraphQL */ `
  mutation DeleteLoanFees(
    $input: DeleteLoanFeesInput!
    $condition: ModelLoanFeesConditionInput
  ) {
    deleteLoanFees(input: $input, condition: $condition) {
      id
      amount
      loanFeesName
      loanFeesCategory
      loanFeesCalculationMethod
      loanFeesRate
      loanFeesDate
      loanFeesStatus
      notes
      loanFeesType
      loanFeesDescription
      loanFeesAttribute1
      loanFeesAttribute2
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      loanProducts {
        nextToken
        __typename
      }
      accountID
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      loanLoanFeesId
      __typename
    }
  }
`;
export const createPenalty = /* GraphQL */ `
  mutation CreatePenalty(
    $input: CreatePenaltyInput!
    $condition: ModelPenaltyConditionInput
  ) {
    createPenalty(input: $input, condition: $condition) {
      id
      amount
      penaltyName
      penaltyCategory
      penaltyCalculationMethod
      penaltyRate
      penaltyDate
      penaltyStatus
      notes
      penaltyType
      penaltyDescription
      penaltyAttribute1
      penaltyAttribute2
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      loanProducts {
        nextToken
        __typename
      }
      accountID
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      createdAt
      updatedAt
      loanPenaltiesId
      __typename
    }
  }
`;
export const updatePenalty = /* GraphQL */ `
  mutation UpdatePenalty(
    $input: UpdatePenaltyInput!
    $condition: ModelPenaltyConditionInput
  ) {
    updatePenalty(input: $input, condition: $condition) {
      id
      amount
      penaltyName
      penaltyCategory
      penaltyCalculationMethod
      penaltyRate
      penaltyDate
      penaltyStatus
      notes
      penaltyType
      penaltyDescription
      penaltyAttribute1
      penaltyAttribute2
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      loanProducts {
        nextToken
        __typename
      }
      accountID
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      createdAt
      updatedAt
      loanPenaltiesId
      __typename
    }
  }
`;
export const deletePenalty = /* GraphQL */ `
  mutation DeletePenalty(
    $input: DeletePenaltyInput!
    $condition: ModelPenaltyConditionInput
  ) {
    deletePenalty(input: $input, condition: $condition) {
      id
      amount
      penaltyName
      penaltyCategory
      penaltyCalculationMethod
      penaltyRate
      penaltyDate
      penaltyStatus
      notes
      penaltyType
      penaltyDescription
      penaltyAttribute1
      penaltyAttribute2
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      loanProducts {
        nextToken
        __typename
      }
      accountID
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      createdAt
      updatedAt
      loanPenaltiesId
      __typename
    }
  }
`;
export const createPayroll = /* GraphQL */ `
  mutation CreatePayroll(
    $input: CreatePayrollInput!
    $condition: ModelPayrollConditionInput
  ) {
    createPayroll(input: $input, condition: $condition) {
      id
      periodStartDate
      periodEndDate
      payDate
      status
      processedByUserID
      totalGrossPay
      totalLoanDeductions
      totalSavingsDeductions
      totalShareDeductions
      totalNetPay
      details
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      employees {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      branchPayrollsId
      __typename
    }
  }
`;
export const updatePayroll = /* GraphQL */ `
  mutation UpdatePayroll(
    $input: UpdatePayrollInput!
    $condition: ModelPayrollConditionInput
  ) {
    updatePayroll(input: $input, condition: $condition) {
      id
      periodStartDate
      periodEndDate
      payDate
      status
      processedByUserID
      totalGrossPay
      totalLoanDeductions
      totalSavingsDeductions
      totalShareDeductions
      totalNetPay
      details
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      employees {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      branchPayrollsId
      __typename
    }
  }
`;
export const deletePayroll = /* GraphQL */ `
  mutation DeletePayroll(
    $input: DeletePayrollInput!
    $condition: ModelPayrollConditionInput
  ) {
    deletePayroll(input: $input, condition: $condition) {
      id
      periodStartDate
      periodEndDate
      payDate
      status
      processedByUserID
      totalGrossPay
      totalLoanDeductions
      totalSavingsDeductions
      totalShareDeductions
      totalNetPay
      details
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      employees {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      branchPayrollsId
      __typename
    }
  }
`;
export const createAccount = /* GraphQL */ `
  mutation CreateAccount(
    $input: CreateAccountInput!
    $condition: ModelAccountConditionInput
  ) {
    createAccount(input: $input, condition: $condition) {
      id
      name
      accountType
      accountNumber
      description
      currency
      currentBalance
      openingBalance
      interestRate
      interestCalculationMethod
      interestPostingFrequency
      interestPostingDate
      interestAccrued
      interestAccruedDate
      accountStatus
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      moneyTransactions {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      investments {
        nextToken
        __typename
      }
      otherIncomes {
        nextToken
        __typename
      }
      loanFees {
        nextToken
        __typename
      }
      payments {
        nextToken
        __typename
      }
      penalties {
        nextToken
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      branchAccountsId
      __typename
    }
  }
`;
export const updateAccount = /* GraphQL */ `
  mutation UpdateAccount(
    $input: UpdateAccountInput!
    $condition: ModelAccountConditionInput
  ) {
    updateAccount(input: $input, condition: $condition) {
      id
      name
      accountType
      accountNumber
      description
      currency
      currentBalance
      openingBalance
      interestRate
      interestCalculationMethod
      interestPostingFrequency
      interestPostingDate
      interestAccrued
      interestAccruedDate
      accountStatus
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      moneyTransactions {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      investments {
        nextToken
        __typename
      }
      otherIncomes {
        nextToken
        __typename
      }
      loanFees {
        nextToken
        __typename
      }
      payments {
        nextToken
        __typename
      }
      penalties {
        nextToken
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      branchAccountsId
      __typename
    }
  }
`;
export const deleteAccount = /* GraphQL */ `
  mutation DeleteAccount(
    $input: DeleteAccountInput!
    $condition: ModelAccountConditionInput
  ) {
    deleteAccount(input: $input, condition: $condition) {
      id
      name
      accountType
      accountNumber
      description
      currency
      currentBalance
      openingBalance
      interestRate
      interestCalculationMethod
      interestPostingFrequency
      interestPostingDate
      interestAccrued
      interestAccruedDate
      accountStatus
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      moneyTransactions {
        nextToken
        __typename
      }
      expenses {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      investments {
        nextToken
        __typename
      }
      otherIncomes {
        nextToken
        __typename
      }
      loanFees {
        nextToken
        __typename
      }
      payments {
        nextToken
        __typename
      }
      penalties {
        nextToken
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      branchAccountsId
      __typename
    }
  }
`;
export const createMoneyTransaction = /* GraphQL */ `
  mutation CreateMoneyTransaction(
    $input: CreateMoneyTransactionInput!
    $condition: ModelMoneyTransactionConditionInput
  ) {
    createMoneyTransaction(input: $input, condition: $condition) {
      id
      transactionType
      transactionDate
      amount
      description
      referenceNumber
      relatedEntityType
      approvalStatus
      approvedDate
      category
      notes
      paymentMethod
      deviceInfo
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      accountMoneyTransactionsId
      __typename
    }
  }
`;
export const updateMoneyTransaction = /* GraphQL */ `
  mutation UpdateMoneyTransaction(
    $input: UpdateMoneyTransactionInput!
    $condition: ModelMoneyTransactionConditionInput
  ) {
    updateMoneyTransaction(input: $input, condition: $condition) {
      id
      transactionType
      transactionDate
      amount
      description
      referenceNumber
      relatedEntityType
      approvalStatus
      approvedDate
      category
      notes
      paymentMethod
      deviceInfo
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      accountMoneyTransactionsId
      __typename
    }
  }
`;
export const deleteMoneyTransaction = /* GraphQL */ `
  mutation DeleteMoneyTransaction(
    $input: DeleteMoneyTransactionInput!
    $condition: ModelMoneyTransactionConditionInput
  ) {
    deleteMoneyTransaction(input: $input, condition: $condition) {
      id
      transactionType
      transactionDate
      amount
      description
      referenceNumber
      relatedEntityType
      approvalStatus
      approvedDate
      category
      notes
      paymentMethod
      deviceInfo
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      accountMoneyTransactionsId
      __typename
    }
  }
`;
export const createPayment = /* GraphQL */ `
  mutation CreatePayment(
    $input: CreatePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    createPayment(input: $input, condition: $condition) {
      id
      paymentDate
      paymentType
      amount
      description
      referenceNumber
      paymentMethod
      status
      notes
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      accountID
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      receivingEmployeeID
      receivingEmployee {
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
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      loanPaymentsId
      __typename
    }
  }
`;
export const updatePayment = /* GraphQL */ `
  mutation UpdatePayment(
    $input: UpdatePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    updatePayment(input: $input, condition: $condition) {
      id
      paymentDate
      paymentType
      amount
      description
      referenceNumber
      paymentMethod
      status
      notes
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      accountID
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      receivingEmployeeID
      receivingEmployee {
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
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      loanPaymentsId
      __typename
    }
  }
`;
export const deletePayment = /* GraphQL */ `
  mutation DeletePayment(
    $input: DeletePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    deletePayment(input: $input, condition: $condition) {
      id
      paymentDate
      paymentType
      amount
      description
      referenceNumber
      paymentMethod
      status
      notes
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      accountID
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      receivingEmployeeID
      receivingEmployee {
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
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      loanPaymentsId
      __typename
    }
  }
`;
export const createExpense = /* GraphQL */ `
  mutation CreateExpense(
    $input: CreateExpenseInput!
    $condition: ModelExpenseConditionInput
  ) {
    createExpense(input: $input, condition: $condition) {
      id
      transactionDate
      amount
      description
      referenceNumber
      receiptDocumentS3Key
      status
      notes
      payee
      paymentMethod
      checkNumber
      approvedDate
      type
      category
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      loans {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      accountExpensesId
      __typename
    }
  }
`;
export const updateExpense = /* GraphQL */ `
  mutation UpdateExpense(
    $input: UpdateExpenseInput!
    $condition: ModelExpenseConditionInput
  ) {
    updateExpense(input: $input, condition: $condition) {
      id
      transactionDate
      amount
      description
      referenceNumber
      receiptDocumentS3Key
      status
      notes
      payee
      paymentMethod
      checkNumber
      approvedDate
      type
      category
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      loans {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      accountExpensesId
      __typename
    }
  }
`;
export const deleteExpense = /* GraphQL */ `
  mutation DeleteExpense(
    $input: DeleteExpenseInput!
    $condition: ModelExpenseConditionInput
  ) {
    deleteExpense(input: $input, condition: $condition) {
      id
      transactionDate
      amount
      description
      referenceNumber
      receiptDocumentS3Key
      status
      notes
      payee
      paymentMethod
      checkNumber
      approvedDate
      type
      category
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      loans {
        nextToken
        __typename
      }
      applications {
        nextToken
        __typename
      }
      approvedByEmployees {
        nextToken
        __typename
      }
      documents {
        nextToken
        __typename
      }
      createdByEmployeeID
      createdByEmployee {
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
        __typename
      }
      createdAt
      updatedAt
      accountExpensesId
      __typename
    }
  }
`;
export const createOtherIncome = /* GraphQL */ `
  mutation CreateOtherIncome(
    $input: CreateOtherIncomeInput!
    $condition: ModelOtherIncomeConditionInput
  ) {
    createOtherIncome(input: $input, condition: $condition) {
      id
      name
      description
      amount
      incomeDate
      incomeType
      accounts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateOtherIncome = /* GraphQL */ `
  mutation UpdateOtherIncome(
    $input: UpdateOtherIncomeInput!
    $condition: ModelOtherIncomeConditionInput
  ) {
    updateOtherIncome(input: $input, condition: $condition) {
      id
      name
      description
      amount
      incomeDate
      incomeType
      accounts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteOtherIncome = /* GraphQL */ `
  mutation DeleteOtherIncome(
    $input: DeleteOtherIncomeInput!
    $condition: ModelOtherIncomeConditionInput
  ) {
    deleteOtherIncome(input: $input, condition: $condition) {
      id
      name
      description
      amount
      incomeDate
      incomeType
      accounts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createFinancialReport = /* GraphQL */ `
  mutation CreateFinancialReport(
    $input: CreateFinancialReportInput!
    $condition: ModelFinancialReportConditionInput
  ) {
    createFinancialReport(input: $input, condition: $condition) {
      id
      reportName
      reportType
      reportDate
      startDate
      endDate
      reportData
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      createdAt
      updatedAt
      branchFinancialReportsId
      __typename
    }
  }
`;
export const updateFinancialReport = /* GraphQL */ `
  mutation UpdateFinancialReport(
    $input: UpdateFinancialReportInput!
    $condition: ModelFinancialReportConditionInput
  ) {
    updateFinancialReport(input: $input, condition: $condition) {
      id
      reportName
      reportType
      reportDate
      startDate
      endDate
      reportData
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      createdAt
      updatedAt
      branchFinancialReportsId
      __typename
    }
  }
`;
export const deleteFinancialReport = /* GraphQL */ `
  mutation DeleteFinancialReport(
    $input: DeleteFinancialReportInput!
    $condition: ModelFinancialReportConditionInput
  ) {
    deleteFinancialReport(input: $input, condition: $condition) {
      id
      reportName
      reportType
      reportDate
      startDate
      endDate
      reportData
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      createdAt
      updatedAt
      branchFinancialReportsId
      __typename
    }
  }
`;
export const createCustomFormField = /* GraphQL */ `
  mutation CreateCustomFormField(
    $input: CreateCustomFormFieldInput!
    $condition: ModelCustomFormFieldConditionInput
  ) {
    createCustomFormField(input: $input, condition: $condition) {
      id
      formKey
      label
      fieldType
      options
      required
      order
      createdBy
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      institutionCustomFormFieldsId
      branchCustomFormFieldsId
      __typename
    }
  }
`;
export const updateCustomFormField = /* GraphQL */ `
  mutation UpdateCustomFormField(
    $input: UpdateCustomFormFieldInput!
    $condition: ModelCustomFormFieldConditionInput
  ) {
    updateCustomFormField(input: $input, condition: $condition) {
      id
      formKey
      label
      fieldType
      options
      required
      order
      createdBy
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      institutionCustomFormFieldsId
      branchCustomFormFieldsId
      __typename
    }
  }
`;
export const deleteCustomFormField = /* GraphQL */ `
  mutation DeleteCustomFormField(
    $input: DeleteCustomFormFieldInput!
    $condition: ModelCustomFormFieldConditionInput
  ) {
    deleteCustomFormField(input: $input, condition: $condition) {
      id
      formKey
      label
      fieldType
      options
      required
      order
      createdBy
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      institutionCustomFormFieldsId
      branchCustomFormFieldsId
      __typename
    }
  }
`;
export const createLoanFeesConfig = /* GraphQL */ `
  mutation CreateLoanFeesConfig(
    $input: CreateLoanFeesConfigInput!
    $condition: ModelLoanFeesConfigConditionInput
  ) {
    createLoanFeesConfig(input: $input, condition: $condition) {
      id
      name
      category
      calculationMethod
      description
      percentageBase
      rate
      status
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      branches {
        nextToken
        __typename
      }
      loanFees {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      institutionLoanFeesConfigsId
      __typename
    }
  }
`;
export const updateLoanFeesConfig = /* GraphQL */ `
  mutation UpdateLoanFeesConfig(
    $input: UpdateLoanFeesConfigInput!
    $condition: ModelLoanFeesConfigConditionInput
  ) {
    updateLoanFeesConfig(input: $input, condition: $condition) {
      id
      name
      category
      calculationMethod
      description
      percentageBase
      rate
      status
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      branches {
        nextToken
        __typename
      }
      loanFees {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      institutionLoanFeesConfigsId
      __typename
    }
  }
`;
export const deleteLoanFeesConfig = /* GraphQL */ `
  mutation DeleteLoanFeesConfig(
    $input: DeleteLoanFeesConfigInput!
    $condition: ModelLoanFeesConfigConditionInput
  ) {
    deleteLoanFeesConfig(input: $input, condition: $condition) {
      id
      name
      category
      calculationMethod
      description
      percentageBase
      rate
      status
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        createdAt
        updatedAt
        __typename
      }
      branches {
        nextToken
        __typename
      }
      loanFees {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      institutionLoanFeesConfigsId
      __typename
    }
  }
`;
export const createBranchLoanProduct = /* GraphQL */ `
  mutation CreateBranchLoanProduct(
    $input: CreateBranchLoanProductInput!
    $condition: ModelBranchLoanProductConditionInput
  ) {
    createBranchLoanProduct(input: $input, condition: $condition) {
      id
      branchId
      loanProductId
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateBranchLoanProduct = /* GraphQL */ `
  mutation UpdateBranchLoanProduct(
    $input: UpdateBranchLoanProductInput!
    $condition: ModelBranchLoanProductConditionInput
  ) {
    updateBranchLoanProduct(input: $input, condition: $condition) {
      id
      branchId
      loanProductId
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteBranchLoanProduct = /* GraphQL */ `
  mutation DeleteBranchLoanProduct(
    $input: DeleteBranchLoanProductInput!
    $condition: ModelBranchLoanProductConditionInput
  ) {
    deleteBranchLoanProduct(input: $input, condition: $condition) {
      id
      branchId
      loanProductId
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createBranchLoanFeesConfig = /* GraphQL */ `
  mutation CreateBranchLoanFeesConfig(
    $input: CreateBranchLoanFeesConfigInput!
    $condition: ModelBranchLoanFeesConfigConditionInput
  ) {
    createBranchLoanFeesConfig(input: $input, condition: $condition) {
      id
      branchId
      loanFeesConfigId
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      loanFeesConfig {
        id
        name
        category
        calculationMethod
        description
        percentageBase
        rate
        status
        createdAt
        updatedAt
        institutionLoanFeesConfigsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateBranchLoanFeesConfig = /* GraphQL */ `
  mutation UpdateBranchLoanFeesConfig(
    $input: UpdateBranchLoanFeesConfigInput!
    $condition: ModelBranchLoanFeesConfigConditionInput
  ) {
    updateBranchLoanFeesConfig(input: $input, condition: $condition) {
      id
      branchId
      loanFeesConfigId
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      loanFeesConfig {
        id
        name
        category
        calculationMethod
        description
        percentageBase
        rate
        status
        createdAt
        updatedAt
        institutionLoanFeesConfigsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteBranchLoanFeesConfig = /* GraphQL */ `
  mutation DeleteBranchLoanFeesConfig(
    $input: DeleteBranchLoanFeesConfigInput!
    $condition: ModelBranchLoanFeesConfigConditionInput
  ) {
    deleteBranchLoanFeesConfig(input: $input, condition: $condition) {
      id
      branchId
      loanFeesConfigId
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      loanFeesConfig {
        id
        name
        category
        calculationMethod
        description
        percentageBase
        rate
        status
        createdAt
        updatedAt
        institutionLoanFeesConfigsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createPayrollEmployee = /* GraphQL */ `
  mutation CreatePayrollEmployee(
    $input: CreatePayrollEmployeeInput!
    $condition: ModelPayrollEmployeeConditionInput
  ) {
    createPayrollEmployee(input: $input, condition: $condition) {
      id
      employeeId
      payrollId
      employee {
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
        __typename
      }
      payroll {
        id
        periodStartDate
        periodEndDate
        payDate
        status
        processedByUserID
        totalGrossPay
        totalLoanDeductions
        totalSavingsDeductions
        totalShareDeductions
        totalNetPay
        details
        createdAt
        updatedAt
        branchPayrollsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updatePayrollEmployee = /* GraphQL */ `
  mutation UpdatePayrollEmployee(
    $input: UpdatePayrollEmployeeInput!
    $condition: ModelPayrollEmployeeConditionInput
  ) {
    updatePayrollEmployee(input: $input, condition: $condition) {
      id
      employeeId
      payrollId
      employee {
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
        __typename
      }
      payroll {
        id
        periodStartDate
        periodEndDate
        payDate
        status
        processedByUserID
        totalGrossPay
        totalLoanDeductions
        totalSavingsDeductions
        totalShareDeductions
        totalNetPay
        details
        createdAt
        updatedAt
        branchPayrollsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePayrollEmployee = /* GraphQL */ `
  mutation DeletePayrollEmployee(
    $input: DeletePayrollEmployeeInput!
    $condition: ModelPayrollEmployeeConditionInput
  ) {
    deletePayrollEmployee(input: $input, condition: $condition) {
      id
      employeeId
      payrollId
      employee {
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
        __typename
      }
      payroll {
        id
        periodStartDate
        periodEndDate
        payDate
        status
        processedByUserID
        totalGrossPay
        totalLoanDeductions
        totalSavingsDeductions
        totalShareDeductions
        totalNetPay
        details
        createdAt
        updatedAt
        branchPayrollsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLoanApprovedByEmployee = /* GraphQL */ `
  mutation CreateLoanApprovedByEmployee(
    $input: CreateLoanApprovedByEmployeeInput!
    $condition: ModelLoanApprovedByEmployeeConditionInput
  ) {
    createLoanApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      loanId
      employee {
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
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLoanApprovedByEmployee = /* GraphQL */ `
  mutation UpdateLoanApprovedByEmployee(
    $input: UpdateLoanApprovedByEmployeeInput!
    $condition: ModelLoanApprovedByEmployeeConditionInput
  ) {
    updateLoanApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      loanId
      employee {
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
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLoanApprovedByEmployee = /* GraphQL */ `
  mutation DeleteLoanApprovedByEmployee(
    $input: DeleteLoanApprovedByEmployeeInput!
    $condition: ModelLoanApprovedByEmployeeConditionInput
  ) {
    deleteLoanApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      loanId
      employee {
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
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createExpenseApprovedByEmployee = /* GraphQL */ `
  mutation CreateExpenseApprovedByEmployee(
    $input: CreateExpenseApprovedByEmployeeInput!
    $condition: ModelExpenseApprovedByEmployeeConditionInput
  ) {
    createExpenseApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      expenseId
      employee {
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
        __typename
      }
      expense {
        id
        transactionDate
        amount
        description
        referenceNumber
        receiptDocumentS3Key
        status
        notes
        payee
        paymentMethod
        checkNumber
        approvedDate
        type
        category
        createdByEmployeeID
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateExpenseApprovedByEmployee = /* GraphQL */ `
  mutation UpdateExpenseApprovedByEmployee(
    $input: UpdateExpenseApprovedByEmployeeInput!
    $condition: ModelExpenseApprovedByEmployeeConditionInput
  ) {
    updateExpenseApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      expenseId
      employee {
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
        __typename
      }
      expense {
        id
        transactionDate
        amount
        description
        referenceNumber
        receiptDocumentS3Key
        status
        notes
        payee
        paymentMethod
        checkNumber
        approvedDate
        type
        category
        createdByEmployeeID
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteExpenseApprovedByEmployee = /* GraphQL */ `
  mutation DeleteExpenseApprovedByEmployee(
    $input: DeleteExpenseApprovedByEmployeeInput!
    $condition: ModelExpenseApprovedByEmployeeConditionInput
  ) {
    deleteExpenseApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      expenseId
      employee {
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
        __typename
      }
      expense {
        id
        transactionDate
        amount
        description
        referenceNumber
        receiptDocumentS3Key
        status
        notes
        payee
        paymentMethod
        checkNumber
        approvedDate
        type
        category
        createdByEmployeeID
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createApplicationApprovedByEmployee = /* GraphQL */ `
  mutation CreateApplicationApprovedByEmployee(
    $input: CreateApplicationApprovedByEmployeeInput!
    $condition: ModelApplicationApprovedByEmployeeConditionInput
  ) {
    createApplicationApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      applicationId
      employee {
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
        __typename
      }
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateApplicationApprovedByEmployee = /* GraphQL */ `
  mutation UpdateApplicationApprovedByEmployee(
    $input: UpdateApplicationApprovedByEmployeeInput!
    $condition: ModelApplicationApprovedByEmployeeConditionInput
  ) {
    updateApplicationApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      applicationId
      employee {
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
        __typename
      }
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteApplicationApprovedByEmployee = /* GraphQL */ `
  mutation DeleteApplicationApprovedByEmployee(
    $input: DeleteApplicationApprovedByEmployeeInput!
    $condition: ModelApplicationApprovedByEmployeeConditionInput
  ) {
    deleteApplicationApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      applicationId
      employee {
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
        __typename
      }
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createCreditScoreApprovedByEmployee = /* GraphQL */ `
  mutation CreateCreditScoreApprovedByEmployee(
    $input: CreateCreditScoreApprovedByEmployeeInput!
    $condition: ModelCreditScoreApprovedByEmployeeConditionInput
  ) {
    createCreditScoreApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      creditScoreId
      employee {
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
        __typename
      }
      creditScore {
        id
        name
        description
        score
        scoreDate
        scoreSource
        scoreStatus
        borrowerID
        createdByEmployeeID
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateCreditScoreApprovedByEmployee = /* GraphQL */ `
  mutation UpdateCreditScoreApprovedByEmployee(
    $input: UpdateCreditScoreApprovedByEmployeeInput!
    $condition: ModelCreditScoreApprovedByEmployeeConditionInput
  ) {
    updateCreditScoreApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      creditScoreId
      employee {
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
        __typename
      }
      creditScore {
        id
        name
        description
        score
        scoreDate
        scoreSource
        scoreStatus
        borrowerID
        createdByEmployeeID
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteCreditScoreApprovedByEmployee = /* GraphQL */ `
  mutation DeleteCreditScoreApprovedByEmployee(
    $input: DeleteCreditScoreApprovedByEmployeeInput!
    $condition: ModelCreditScoreApprovedByEmployeeConditionInput
  ) {
    deleteCreditScoreApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      creditScoreId
      employee {
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
        __typename
      }
      creditScore {
        id
        name
        description
        score
        scoreDate
        scoreSource
        scoreStatus
        borrowerID
        createdByEmployeeID
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createMoneyTransactionApprovedByEmployee = /* GraphQL */ `
  mutation CreateMoneyTransactionApprovedByEmployee(
    $input: CreateMoneyTransactionApprovedByEmployeeInput!
    $condition: ModelMoneyTransactionApprovedByEmployeeConditionInput
  ) {
    createMoneyTransactionApprovedByEmployee(
      input: $input
      condition: $condition
    ) {
      id
      employeeId
      moneyTransactionId
      employee {
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
        __typename
      }
      moneyTransaction {
        id
        transactionType
        transactionDate
        amount
        description
        referenceNumber
        relatedEntityType
        approvalStatus
        approvedDate
        category
        notes
        paymentMethod
        deviceInfo
        createdByEmployeeID
        createdAt
        updatedAt
        accountMoneyTransactionsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateMoneyTransactionApprovedByEmployee = /* GraphQL */ `
  mutation UpdateMoneyTransactionApprovedByEmployee(
    $input: UpdateMoneyTransactionApprovedByEmployeeInput!
    $condition: ModelMoneyTransactionApprovedByEmployeeConditionInput
  ) {
    updateMoneyTransactionApprovedByEmployee(
      input: $input
      condition: $condition
    ) {
      id
      employeeId
      moneyTransactionId
      employee {
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
        __typename
      }
      moneyTransaction {
        id
        transactionType
        transactionDate
        amount
        description
        referenceNumber
        relatedEntityType
        approvalStatus
        approvedDate
        category
        notes
        paymentMethod
        deviceInfo
        createdByEmployeeID
        createdAt
        updatedAt
        accountMoneyTransactionsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteMoneyTransactionApprovedByEmployee = /* GraphQL */ `
  mutation DeleteMoneyTransactionApprovedByEmployee(
    $input: DeleteMoneyTransactionApprovedByEmployeeInput!
    $condition: ModelMoneyTransactionApprovedByEmployeeConditionInput
  ) {
    deleteMoneyTransactionApprovedByEmployee(
      input: $input
      condition: $condition
    ) {
      id
      employeeId
      moneyTransactionId
      employee {
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
        __typename
      }
      moneyTransaction {
        id
        transactionType
        transactionDate
        amount
        description
        referenceNumber
        relatedEntityType
        approvalStatus
        approvedDate
        category
        notes
        paymentMethod
        deviceInfo
        createdByEmployeeID
        createdAt
        updatedAt
        accountMoneyTransactionsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createPaymentApprovedByEmployee = /* GraphQL */ `
  mutation CreatePaymentApprovedByEmployee(
    $input: CreatePaymentApprovedByEmployeeInput!
    $condition: ModelPaymentApprovedByEmployeeConditionInput
  ) {
    createPaymentApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      paymentId
      employee {
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
        __typename
      }
      payment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        notes
        accountID
        receivingEmployeeID
        createdAt
        updatedAt
        loanPaymentsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updatePaymentApprovedByEmployee = /* GraphQL */ `
  mutation UpdatePaymentApprovedByEmployee(
    $input: UpdatePaymentApprovedByEmployeeInput!
    $condition: ModelPaymentApprovedByEmployeeConditionInput
  ) {
    updatePaymentApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      paymentId
      employee {
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
        __typename
      }
      payment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        notes
        accountID
        receivingEmployeeID
        createdAt
        updatedAt
        loanPaymentsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePaymentApprovedByEmployee = /* GraphQL */ `
  mutation DeletePaymentApprovedByEmployee(
    $input: DeletePaymentApprovedByEmployeeInput!
    $condition: ModelPaymentApprovedByEmployeeConditionInput
  ) {
    deletePaymentApprovedByEmployee(input: $input, condition: $condition) {
      id
      employeeId
      paymentId
      employee {
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
        __typename
      }
      payment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        notes
        accountID
        receivingEmployeeID
        createdAt
        updatedAt
        loanPaymentsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createBorrowerLoanOfficer = /* GraphQL */ `
  mutation CreateBorrowerLoanOfficer(
    $input: CreateBorrowerLoanOfficerInput!
    $condition: ModelBorrowerLoanOfficerConditionInput
  ) {
    createBorrowerLoanOfficer(input: $input, condition: $condition) {
      id
      employeeId
      borrowerId
      employee {
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
        __typename
      }
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateBorrowerLoanOfficer = /* GraphQL */ `
  mutation UpdateBorrowerLoanOfficer(
    $input: UpdateBorrowerLoanOfficerInput!
    $condition: ModelBorrowerLoanOfficerConditionInput
  ) {
    updateBorrowerLoanOfficer(input: $input, condition: $condition) {
      id
      employeeId
      borrowerId
      employee {
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
        __typename
      }
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteBorrowerLoanOfficer = /* GraphQL */ `
  mutation DeleteBorrowerLoanOfficer(
    $input: DeleteBorrowerLoanOfficerInput!
    $condition: ModelBorrowerLoanOfficerConditionInput
  ) {
    deleteBorrowerLoanOfficer(input: $input, condition: $condition) {
      id
      employeeId
      borrowerId
      employee {
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
        __typename
      }
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createBorrowerDocument = /* GraphQL */ `
  mutation CreateBorrowerDocument(
    $input: CreateBorrowerDocumentInput!
    $condition: ModelBorrowerDocumentConditionInput
  ) {
    createBorrowerDocument(input: $input, condition: $condition) {
      id
      borrowerId
      documentId
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateBorrowerDocument = /* GraphQL */ `
  mutation UpdateBorrowerDocument(
    $input: UpdateBorrowerDocumentInput!
    $condition: ModelBorrowerDocumentConditionInput
  ) {
    updateBorrowerDocument(input: $input, condition: $condition) {
      id
      borrowerId
      documentId
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteBorrowerDocument = /* GraphQL */ `
  mutation DeleteBorrowerDocument(
    $input: DeleteBorrowerDocumentInput!
    $condition: ModelBorrowerDocumentConditionInput
  ) {
    deleteBorrowerDocument(input: $input, condition: $condition) {
      id
      borrowerId
      documentId
      borrower {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        nationalIdPicture
        passportPicture
        address
        points
        borrowerOpeningBalance
        borrowerClosingBalance
        borrowerInterestRate
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        additionalNote1
        additionalNote2
        borrowerDocument1
        borrowerDocument1URL
        borrowerDocument2
        borrowerDocument2URL
        borrowerDocument3
        borrowerDocument3URL
        borrowerDocument4
        borrowerDocument4URL
        borrowerStatus
        borrowertype
        borrowerAttribute1
        borrowerAttribute2
        customFieldsData
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLoanGuarantor = /* GraphQL */ `
  mutation CreateLoanGuarantor(
    $input: CreateLoanGuarantorInput!
    $condition: ModelLoanGuarantorConditionInput
  ) {
    createLoanGuarantor(input: $input, condition: $condition) {
      id
      guarantorId
      loanId
      guarantor {
        id
        name
        relationship
        phoneNumber
        email
        address
        customFieldsData
        createdAt
        updatedAt
        borrowerGuarantorsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLoanGuarantor = /* GraphQL */ `
  mutation UpdateLoanGuarantor(
    $input: UpdateLoanGuarantorInput!
    $condition: ModelLoanGuarantorConditionInput
  ) {
    updateLoanGuarantor(input: $input, condition: $condition) {
      id
      guarantorId
      loanId
      guarantor {
        id
        name
        relationship
        phoneNumber
        email
        address
        customFieldsData
        createdAt
        updatedAt
        borrowerGuarantorsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLoanGuarantor = /* GraphQL */ `
  mutation DeleteLoanGuarantor(
    $input: DeleteLoanGuarantorInput!
    $condition: ModelLoanGuarantorConditionInput
  ) {
    deleteLoanGuarantor(input: $input, condition: $condition) {
      id
      guarantorId
      loanId
      guarantor {
        id
        name
        relationship
        phoneNumber
        email
        address
        customFieldsData
        createdAt
        updatedAt
        borrowerGuarantorsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createApplicationGuarantor = /* GraphQL */ `
  mutation CreateApplicationGuarantor(
    $input: CreateApplicationGuarantorInput!
    $condition: ModelApplicationGuarantorConditionInput
  ) {
    createApplicationGuarantor(input: $input, condition: $condition) {
      id
      guarantorId
      applicationId
      guarantor {
        id
        name
        relationship
        phoneNumber
        email
        address
        customFieldsData
        createdAt
        updatedAt
        borrowerGuarantorsId
        __typename
      }
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateApplicationGuarantor = /* GraphQL */ `
  mutation UpdateApplicationGuarantor(
    $input: UpdateApplicationGuarantorInput!
    $condition: ModelApplicationGuarantorConditionInput
  ) {
    updateApplicationGuarantor(input: $input, condition: $condition) {
      id
      guarantorId
      applicationId
      guarantor {
        id
        name
        relationship
        phoneNumber
        email
        address
        customFieldsData
        createdAt
        updatedAt
        borrowerGuarantorsId
        __typename
      }
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteApplicationGuarantor = /* GraphQL */ `
  mutation DeleteApplicationGuarantor(
    $input: DeleteApplicationGuarantorInput!
    $condition: ModelApplicationGuarantorConditionInput
  ) {
    deleteApplicationGuarantor(input: $input, condition: $condition) {
      id
      guarantorId
      applicationId
      guarantor {
        id
        name
        relationship
        phoneNumber
        email
        address
        customFieldsData
        createdAt
        updatedAt
        borrowerGuarantorsId
        __typename
      }
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLoanProductLoanFees = /* GraphQL */ `
  mutation CreateLoanProductLoanFees(
    $input: CreateLoanProductLoanFeesInput!
    $condition: ModelLoanProductLoanFeesConditionInput
  ) {
    createLoanProductLoanFees(input: $input, condition: $condition) {
      id
      loanProductId
      loanFeesId
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      loanFees {
        id
        amount
        loanFeesName
        loanFeesCategory
        loanFeesCalculationMethod
        loanFeesRate
        loanFeesDate
        loanFeesStatus
        notes
        loanFeesType
        loanFeesDescription
        loanFeesAttribute1
        loanFeesAttribute2
        accountID
        createdAt
        updatedAt
        loanLoanFeesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLoanProductLoanFees = /* GraphQL */ `
  mutation UpdateLoanProductLoanFees(
    $input: UpdateLoanProductLoanFeesInput!
    $condition: ModelLoanProductLoanFeesConditionInput
  ) {
    updateLoanProductLoanFees(input: $input, condition: $condition) {
      id
      loanProductId
      loanFeesId
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      loanFees {
        id
        amount
        loanFeesName
        loanFeesCategory
        loanFeesCalculationMethod
        loanFeesRate
        loanFeesDate
        loanFeesStatus
        notes
        loanFeesType
        loanFeesDescription
        loanFeesAttribute1
        loanFeesAttribute2
        accountID
        createdAt
        updatedAt
        loanLoanFeesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLoanProductLoanFees = /* GraphQL */ `
  mutation DeleteLoanProductLoanFees(
    $input: DeleteLoanProductLoanFeesInput!
    $condition: ModelLoanProductLoanFeesConditionInput
  ) {
    deleteLoanProductLoanFees(input: $input, condition: $condition) {
      id
      loanProductId
      loanFeesId
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      loanFees {
        id
        amount
        loanFeesName
        loanFeesCategory
        loanFeesCalculationMethod
        loanFeesRate
        loanFeesDate
        loanFeesStatus
        notes
        loanFeesType
        loanFeesDescription
        loanFeesAttribute1
        loanFeesAttribute2
        accountID
        createdAt
        updatedAt
        loanLoanFeesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLoanProductPenalty = /* GraphQL */ `
  mutation CreateLoanProductPenalty(
    $input: CreateLoanProductPenaltyInput!
    $condition: ModelLoanProductPenaltyConditionInput
  ) {
    createLoanProductPenalty(input: $input, condition: $condition) {
      id
      loanProductId
      penaltyId
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      penalty {
        id
        amount
        penaltyName
        penaltyCategory
        penaltyCalculationMethod
        penaltyRate
        penaltyDate
        penaltyStatus
        notes
        penaltyType
        penaltyDescription
        penaltyAttribute1
        penaltyAttribute2
        accountID
        createdAt
        updatedAt
        loanPenaltiesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLoanProductPenalty = /* GraphQL */ `
  mutation UpdateLoanProductPenalty(
    $input: UpdateLoanProductPenaltyInput!
    $condition: ModelLoanProductPenaltyConditionInput
  ) {
    updateLoanProductPenalty(input: $input, condition: $condition) {
      id
      loanProductId
      penaltyId
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      penalty {
        id
        amount
        penaltyName
        penaltyCategory
        penaltyCalculationMethod
        penaltyRate
        penaltyDate
        penaltyStatus
        notes
        penaltyType
        penaltyDescription
        penaltyAttribute1
        penaltyAttribute2
        accountID
        createdAt
        updatedAt
        loanPenaltiesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLoanProductPenalty = /* GraphQL */ `
  mutation DeleteLoanProductPenalty(
    $input: DeleteLoanProductPenaltyInput!
    $condition: ModelLoanProductPenaltyConditionInput
  ) {
    deleteLoanProductPenalty(input: $input, condition: $condition) {
      id
      loanProductId
      penaltyId
      loanProduct {
        id
        name
        description
        principalAmountMin
        principalAmountMax
        principalAmountDefault
        interestRateMin
        interestRateMax
        interestRateDefault
        interestCalculationMethod
        interestType
        interestPeriod
        termDurationMin
        termDurationMax
        termDurationDefault
        durationPeriod
        repaymentFrequency
        repaymentOrder
        extendLoanAfterMaturity
        interestTypeMaturity
        calculateInterestOn
        loanInterestRateAfterMaturity
        recurringPeriodAfterMaturityUnit
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      penalty {
        id
        amount
        penaltyName
        penaltyCategory
        penaltyCalculationMethod
        penaltyRate
        penaltyDate
        penaltyStatus
        notes
        penaltyType
        penaltyDescription
        penaltyAttribute1
        penaltyAttribute2
        accountID
        createdAt
        updatedAt
        loanPenaltiesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLoanDocument = /* GraphQL */ `
  mutation CreateLoanDocument(
    $input: CreateLoanDocumentInput!
    $condition: ModelLoanDocumentConditionInput
  ) {
    createLoanDocument(input: $input, condition: $condition) {
      id
      documentId
      loanId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLoanDocument = /* GraphQL */ `
  mutation UpdateLoanDocument(
    $input: UpdateLoanDocumentInput!
    $condition: ModelLoanDocumentConditionInput
  ) {
    updateLoanDocument(input: $input, condition: $condition) {
      id
      documentId
      loanId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLoanDocument = /* GraphQL */ `
  mutation DeleteLoanDocument(
    $input: DeleteLoanDocumentInput!
    $condition: ModelLoanDocumentConditionInput
  ) {
    deleteLoanDocument(input: $input, condition: $condition) {
      id
      documentId
      loanId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createApplicationDocument = /* GraphQL */ `
  mutation CreateApplicationDocument(
    $input: CreateApplicationDocumentInput!
    $condition: ModelApplicationDocumentConditionInput
  ) {
    createApplicationDocument(input: $input, condition: $condition) {
      id
      documentId
      applicationId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateApplicationDocument = /* GraphQL */ `
  mutation UpdateApplicationDocument(
    $input: UpdateApplicationDocumentInput!
    $condition: ModelApplicationDocumentConditionInput
  ) {
    updateApplicationDocument(input: $input, condition: $condition) {
      id
      documentId
      applicationId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteApplicationDocument = /* GraphQL */ `
  mutation DeleteApplicationDocument(
    $input: DeleteApplicationDocumentInput!
    $condition: ModelApplicationDocumentConditionInput
  ) {
    deleteApplicationDocument(input: $input, condition: $condition) {
      id
      documentId
      applicationId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createContractDocument = /* GraphQL */ `
  mutation CreateContractDocument(
    $input: CreateContractDocumentInput!
    $condition: ModelContractDocumentConditionInput
  ) {
    createContractDocument(input: $input, condition: $condition) {
      id
      documentId
      contractId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      contract {
        id
        contractNumber
        contractType
        contractDate
        contractStatus
        contractRecord
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateContractDocument = /* GraphQL */ `
  mutation UpdateContractDocument(
    $input: UpdateContractDocumentInput!
    $condition: ModelContractDocumentConditionInput
  ) {
    updateContractDocument(input: $input, condition: $condition) {
      id
      documentId
      contractId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      contract {
        id
        contractNumber
        contractType
        contractDate
        contractStatus
        contractRecord
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteContractDocument = /* GraphQL */ `
  mutation DeleteContractDocument(
    $input: DeleteContractDocumentInput!
    $condition: ModelContractDocumentConditionInput
  ) {
    deleteContractDocument(input: $input, condition: $condition) {
      id
      documentId
      contractId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      contract {
        id
        contractNumber
        contractType
        contractDate
        contractStatus
        contractRecord
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createExpenseDocument = /* GraphQL */ `
  mutation CreateExpenseDocument(
    $input: CreateExpenseDocumentInput!
    $condition: ModelExpenseDocumentConditionInput
  ) {
    createExpenseDocument(input: $input, condition: $condition) {
      id
      documentId
      expenseId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      expense {
        id
        transactionDate
        amount
        description
        referenceNumber
        receiptDocumentS3Key
        status
        notes
        payee
        paymentMethod
        checkNumber
        approvedDate
        type
        category
        createdByEmployeeID
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateExpenseDocument = /* GraphQL */ `
  mutation UpdateExpenseDocument(
    $input: UpdateExpenseDocumentInput!
    $condition: ModelExpenseDocumentConditionInput
  ) {
    updateExpenseDocument(input: $input, condition: $condition) {
      id
      documentId
      expenseId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      expense {
        id
        transactionDate
        amount
        description
        referenceNumber
        receiptDocumentS3Key
        status
        notes
        payee
        paymentMethod
        checkNumber
        approvedDate
        type
        category
        createdByEmployeeID
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteExpenseDocument = /* GraphQL */ `
  mutation DeleteExpenseDocument(
    $input: DeleteExpenseDocumentInput!
    $condition: ModelExpenseDocumentConditionInput
  ) {
    deleteExpenseDocument(input: $input, condition: $condition) {
      id
      documentId
      expenseId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      expense {
        id
        transactionDate
        amount
        description
        referenceNumber
        receiptDocumentS3Key
        status
        notes
        payee
        paymentMethod
        checkNumber
        approvedDate
        type
        category
        createdByEmployeeID
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createPaymentDocument = /* GraphQL */ `
  mutation CreatePaymentDocument(
    $input: CreatePaymentDocumentInput!
    $condition: ModelPaymentDocumentConditionInput
  ) {
    createPaymentDocument(input: $input, condition: $condition) {
      id
      documentId
      paymentId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      payment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        notes
        accountID
        receivingEmployeeID
        createdAt
        updatedAt
        loanPaymentsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updatePaymentDocument = /* GraphQL */ `
  mutation UpdatePaymentDocument(
    $input: UpdatePaymentDocumentInput!
    $condition: ModelPaymentDocumentConditionInput
  ) {
    updatePaymentDocument(input: $input, condition: $condition) {
      id
      documentId
      paymentId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      payment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        notes
        accountID
        receivingEmployeeID
        createdAt
        updatedAt
        loanPaymentsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePaymentDocument = /* GraphQL */ `
  mutation DeletePaymentDocument(
    $input: DeletePaymentDocumentInput!
    $condition: ModelPaymentDocumentConditionInput
  ) {
    deletePaymentDocument(input: $input, condition: $condition) {
      id
      documentId
      paymentId
      document {
        id
        documentType
        documentName
        documentDescription
        serialNumber
        documentDate
        s3Key
        fileName
        contentType
        createdByEmployeeID
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      payment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        notes
        accountID
        receivingEmployeeID
        createdAt
        updatedAt
        loanPaymentsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createApplicationContract = /* GraphQL */ `
  mutation CreateApplicationContract(
    $input: CreateApplicationContractInput!
    $condition: ModelApplicationContractConditionInput
  ) {
    createApplicationContract(input: $input, condition: $condition) {
      id
      contractId
      applicationId
      contract {
        id
        contractNumber
        contractType
        contractDate
        contractStatus
        contractRecord
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateApplicationContract = /* GraphQL */ `
  mutation UpdateApplicationContract(
    $input: UpdateApplicationContractInput!
    $condition: ModelApplicationContractConditionInput
  ) {
    updateApplicationContract(input: $input, condition: $condition) {
      id
      contractId
      applicationId
      contract {
        id
        contractNumber
        contractType
        contractDate
        contractStatus
        contractRecord
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteApplicationContract = /* GraphQL */ `
  mutation DeleteApplicationContract(
    $input: DeleteApplicationContractInput!
    $condition: ModelApplicationContractConditionInput
  ) {
    deleteApplicationContract(input: $input, condition: $condition) {
      id
      contractId
      applicationId
      contract {
        id
        contractNumber
        contractType
        contractDate
        contractStatus
        contractRecord
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createCollateralContract = /* GraphQL */ `
  mutation CreateCollateralContract(
    $input: CreateCollateralContractInput!
    $condition: ModelCollateralContractConditionInput
  ) {
    createCollateralContract(input: $input, condition: $condition) {
      id
      contractId
      collateralId
      contract {
        id
        contractNumber
        contractType
        contractDate
        contractStatus
        contractRecord
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      collateral {
        id
        name
        type
        description
        location
        value
        serialNumber
        registrationNumber
        insuranceDetails
        insuranceExpiryDate
        insuranceCompany
        storedAt
        customFieldsData
        createdAt
        updatedAt
        borrowerCollateralsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateCollateralContract = /* GraphQL */ `
  mutation UpdateCollateralContract(
    $input: UpdateCollateralContractInput!
    $condition: ModelCollateralContractConditionInput
  ) {
    updateCollateralContract(input: $input, condition: $condition) {
      id
      contractId
      collateralId
      contract {
        id
        contractNumber
        contractType
        contractDate
        contractStatus
        contractRecord
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      collateral {
        id
        name
        type
        description
        location
        value
        serialNumber
        registrationNumber
        insuranceDetails
        insuranceExpiryDate
        insuranceCompany
        storedAt
        customFieldsData
        createdAt
        updatedAt
        borrowerCollateralsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteCollateralContract = /* GraphQL */ `
  mutation DeleteCollateralContract(
    $input: DeleteCollateralContractInput!
    $condition: ModelCollateralContractConditionInput
  ) {
    deleteCollateralContract(input: $input, condition: $condition) {
      id
      contractId
      collateralId
      contract {
        id
        contractNumber
        contractType
        contractDate
        contractStatus
        contractRecord
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      collateral {
        id
        name
        type
        description
        location
        value
        serialNumber
        registrationNumber
        insuranceDetails
        insuranceExpiryDate
        insuranceCompany
        storedAt
        customFieldsData
        createdAt
        updatedAt
        borrowerCollateralsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLoanContract = /* GraphQL */ `
  mutation CreateLoanContract(
    $input: CreateLoanContractInput!
    $condition: ModelLoanContractConditionInput
  ) {
    createLoanContract(input: $input, condition: $condition) {
      id
      contractId
      loanId
      contract {
        id
        contractNumber
        contractType
        contractDate
        contractStatus
        contractRecord
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLoanContract = /* GraphQL */ `
  mutation UpdateLoanContract(
    $input: UpdateLoanContractInput!
    $condition: ModelLoanContractConditionInput
  ) {
    updateLoanContract(input: $input, condition: $condition) {
      id
      contractId
      loanId
      contract {
        id
        contractNumber
        contractType
        contractDate
        contractStatus
        contractRecord
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLoanContract = /* GraphQL */ `
  mutation DeleteLoanContract(
    $input: DeleteLoanContractInput!
    $condition: ModelLoanContractConditionInput
  ) {
    deleteLoanContract(input: $input, condition: $condition) {
      id
      contractId
      loanId
      contract {
        id
        contractNumber
        contractType
        contractDate
        contractStatus
        contractRecord
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createApplicationCollateral = /* GraphQL */ `
  mutation CreateApplicationCollateral(
    $input: CreateApplicationCollateralInput!
    $condition: ModelApplicationCollateralConditionInput
  ) {
    createApplicationCollateral(input: $input, condition: $condition) {
      id
      applicationId
      collateralId
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      collateral {
        id
        name
        type
        description
        location
        value
        serialNumber
        registrationNumber
        insuranceDetails
        insuranceExpiryDate
        insuranceCompany
        storedAt
        customFieldsData
        createdAt
        updatedAt
        borrowerCollateralsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateApplicationCollateral = /* GraphQL */ `
  mutation UpdateApplicationCollateral(
    $input: UpdateApplicationCollateralInput!
    $condition: ModelApplicationCollateralConditionInput
  ) {
    updateApplicationCollateral(input: $input, condition: $condition) {
      id
      applicationId
      collateralId
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      collateral {
        id
        name
        type
        description
        location
        value
        serialNumber
        registrationNumber
        insuranceDetails
        insuranceExpiryDate
        insuranceCompany
        storedAt
        customFieldsData
        createdAt
        updatedAt
        borrowerCollateralsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteApplicationCollateral = /* GraphQL */ `
  mutation DeleteApplicationCollateral(
    $input: DeleteApplicationCollateralInput!
    $condition: ModelApplicationCollateralConditionInput
  ) {
    deleteApplicationCollateral(input: $input, condition: $condition) {
      id
      applicationId
      collateralId
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      collateral {
        id
        name
        type
        description
        location
        value
        serialNumber
        registrationNumber
        insuranceDetails
        insuranceExpiryDate
        insuranceCompany
        storedAt
        customFieldsData
        createdAt
        updatedAt
        borrowerCollateralsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createApplicationExpense = /* GraphQL */ `
  mutation CreateApplicationExpense(
    $input: CreateApplicationExpenseInput!
    $condition: ModelApplicationExpenseConditionInput
  ) {
    createApplicationExpense(input: $input, condition: $condition) {
      id
      applicationId
      expenseId
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      expense {
        id
        transactionDate
        amount
        description
        referenceNumber
        receiptDocumentS3Key
        status
        notes
        payee
        paymentMethod
        checkNumber
        approvedDate
        type
        category
        createdByEmployeeID
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateApplicationExpense = /* GraphQL */ `
  mutation UpdateApplicationExpense(
    $input: UpdateApplicationExpenseInput!
    $condition: ModelApplicationExpenseConditionInput
  ) {
    updateApplicationExpense(input: $input, condition: $condition) {
      id
      applicationId
      expenseId
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      expense {
        id
        transactionDate
        amount
        description
        referenceNumber
        receiptDocumentS3Key
        status
        notes
        payee
        paymentMethod
        checkNumber
        approvedDate
        type
        category
        createdByEmployeeID
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteApplicationExpense = /* GraphQL */ `
  mutation DeleteApplicationExpense(
    $input: DeleteApplicationExpenseInput!
    $condition: ModelApplicationExpenseConditionInput
  ) {
    deleteApplicationExpense(input: $input, condition: $condition) {
      id
      applicationId
      expenseId
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      expense {
        id
        transactionDate
        amount
        description
        referenceNumber
        receiptDocumentS3Key
        status
        notes
        payee
        paymentMethod
        checkNumber
        approvedDate
        type
        category
        createdByEmployeeID
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLoanApplication = /* GraphQL */ `
  mutation CreateLoanApplication(
    $input: CreateLoanApplicationInput!
    $condition: ModelLoanApplicationConditionInput
  ) {
    createLoanApplication(input: $input, condition: $condition) {
      id
      applicationId
      loanId
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLoanApplication = /* GraphQL */ `
  mutation UpdateLoanApplication(
    $input: UpdateLoanApplicationInput!
    $condition: ModelLoanApplicationConditionInput
  ) {
    updateLoanApplication(input: $input, condition: $condition) {
      id
      applicationId
      loanId
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLoanApplication = /* GraphQL */ `
  mutation DeleteLoanApplication(
    $input: DeleteLoanApplicationInput!
    $condition: ModelLoanApplicationConditionInput
  ) {
    deleteLoanApplication(input: $input, condition: $condition) {
      id
      applicationId
      loanId
      application {
        id
        name
        description
        applicationNumber
        requestedPrincipalAmount
        requestedTermMonths
        requestedFrequency
        applicationDate
        status
        applicationRecord
        loanProductID
        createdByEmployeeID
        customFieldsData
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLoanCollateral = /* GraphQL */ `
  mutation CreateLoanCollateral(
    $input: CreateLoanCollateralInput!
    $condition: ModelLoanCollateralConditionInput
  ) {
    createLoanCollateral(input: $input, condition: $condition) {
      id
      collateralId
      loanId
      collateral {
        id
        name
        type
        description
        location
        value
        serialNumber
        registrationNumber
        insuranceDetails
        insuranceExpiryDate
        insuranceCompany
        storedAt
        customFieldsData
        createdAt
        updatedAt
        borrowerCollateralsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLoanCollateral = /* GraphQL */ `
  mutation UpdateLoanCollateral(
    $input: UpdateLoanCollateralInput!
    $condition: ModelLoanCollateralConditionInput
  ) {
    updateLoanCollateral(input: $input, condition: $condition) {
      id
      collateralId
      loanId
      collateral {
        id
        name
        type
        description
        location
        value
        serialNumber
        registrationNumber
        insuranceDetails
        insuranceExpiryDate
        insuranceCompany
        storedAt
        customFieldsData
        createdAt
        updatedAt
        borrowerCollateralsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLoanCollateral = /* GraphQL */ `
  mutation DeleteLoanCollateral(
    $input: DeleteLoanCollateralInput!
    $condition: ModelLoanCollateralConditionInput
  ) {
    deleteLoanCollateral(input: $input, condition: $condition) {
      id
      collateralId
      loanId
      collateral {
        id
        name
        type
        description
        location
        value
        serialNumber
        registrationNumber
        insuranceDetails
        insuranceExpiryDate
        insuranceCompany
        storedAt
        customFieldsData
        createdAt
        updatedAt
        borrowerCollateralsId
        __typename
      }
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLoanAccount = /* GraphQL */ `
  mutation CreateLoanAccount(
    $input: CreateLoanAccountInput!
    $condition: ModelLoanAccountConditionInput
  ) {
    createLoanAccount(input: $input, condition: $condition) {
      id
      loanId
      accountId
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLoanAccount = /* GraphQL */ `
  mutation UpdateLoanAccount(
    $input: UpdateLoanAccountInput!
    $condition: ModelLoanAccountConditionInput
  ) {
    updateLoanAccount(input: $input, condition: $condition) {
      id
      loanId
      accountId
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLoanAccount = /* GraphQL */ `
  mutation DeleteLoanAccount(
    $input: DeleteLoanAccountInput!
    $condition: ModelLoanAccountConditionInput
  ) {
    deleteLoanAccount(input: $input, condition: $condition) {
      id
      loanId
      accountId
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLoanExpense = /* GraphQL */ `
  mutation CreateLoanExpense(
    $input: CreateLoanExpenseInput!
    $condition: ModelLoanExpenseConditionInput
  ) {
    createLoanExpense(input: $input, condition: $condition) {
      id
      loanId
      expenseId
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      expense {
        id
        transactionDate
        amount
        description
        referenceNumber
        receiptDocumentS3Key
        status
        notes
        payee
        paymentMethod
        checkNumber
        approvedDate
        type
        category
        createdByEmployeeID
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLoanExpense = /* GraphQL */ `
  mutation UpdateLoanExpense(
    $input: UpdateLoanExpenseInput!
    $condition: ModelLoanExpenseConditionInput
  ) {
    updateLoanExpense(input: $input, condition: $condition) {
      id
      loanId
      expenseId
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      expense {
        id
        transactionDate
        amount
        description
        referenceNumber
        receiptDocumentS3Key
        status
        notes
        payee
        paymentMethod
        checkNumber
        approvedDate
        type
        category
        createdByEmployeeID
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLoanExpense = /* GraphQL */ `
  mutation DeleteLoanExpense(
    $input: DeleteLoanExpenseInput!
    $condition: ModelLoanExpenseConditionInput
  ) {
    deleteLoanExpense(input: $input, condition: $condition) {
      id
      loanId
      expenseId
      loan {
        id
        approvalStatus
        approvedDate
        principal
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        loanType
        rateInterval
        loanStatus
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      expense {
        id
        transactionDate
        amount
        description
        referenceNumber
        receiptDocumentS3Key
        status
        notes
        payee
        paymentMethod
        checkNumber
        approvedDate
        type
        category
        createdByEmployeeID
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createInvestmentAccount = /* GraphQL */ `
  mutation CreateInvestmentAccount(
    $input: CreateInvestmentAccountInput!
    $condition: ModelInvestmentAccountConditionInput
  ) {
    createInvestmentAccount(input: $input, condition: $condition) {
      id
      investmentId
      accountId
      investment {
        id
        principal
        description
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        type
        rateInterval
        investmentStatus
        investmentAttribute1
        investmentAttribute2
        numberOfPayments
        paymentFrequency
        createdAt
        updatedAt
        __typename
      }
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateInvestmentAccount = /* GraphQL */ `
  mutation UpdateInvestmentAccount(
    $input: UpdateInvestmentAccountInput!
    $condition: ModelInvestmentAccountConditionInput
  ) {
    updateInvestmentAccount(input: $input, condition: $condition) {
      id
      investmentId
      accountId
      investment {
        id
        principal
        description
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        type
        rateInterval
        investmentStatus
        investmentAttribute1
        investmentAttribute2
        numberOfPayments
        paymentFrequency
        createdAt
        updatedAt
        __typename
      }
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteInvestmentAccount = /* GraphQL */ `
  mutation DeleteInvestmentAccount(
    $input: DeleteInvestmentAccountInput!
    $condition: ModelInvestmentAccountConditionInput
  ) {
    deleteInvestmentAccount(input: $input, condition: $condition) {
      id
      investmentId
      accountId
      investment {
        id
        principal
        description
        fees
        interestRate
        startDate
        maturityDate
        stopDate
        extensionPeriod
        duration
        durationInterval
        type
        rateInterval
        investmentStatus
        investmentAttribute1
        investmentAttribute2
        numberOfPayments
        paymentFrequency
        createdAt
        updatedAt
        __typename
      }
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLoanFeesLoanFeesConfig = /* GraphQL */ `
  mutation CreateLoanFeesLoanFeesConfig(
    $input: CreateLoanFeesLoanFeesConfigInput!
    $condition: ModelLoanFeesLoanFeesConfigConditionInput
  ) {
    createLoanFeesLoanFeesConfig(input: $input, condition: $condition) {
      id
      loanFeesId
      loanFeesConfigId
      loanFees {
        id
        amount
        loanFeesName
        loanFeesCategory
        loanFeesCalculationMethod
        loanFeesRate
        loanFeesDate
        loanFeesStatus
        notes
        loanFeesType
        loanFeesDescription
        loanFeesAttribute1
        loanFeesAttribute2
        accountID
        createdAt
        updatedAt
        loanLoanFeesId
        __typename
      }
      loanFeesConfig {
        id
        name
        category
        calculationMethod
        description
        percentageBase
        rate
        status
        createdAt
        updatedAt
        institutionLoanFeesConfigsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLoanFeesLoanFeesConfig = /* GraphQL */ `
  mutation UpdateLoanFeesLoanFeesConfig(
    $input: UpdateLoanFeesLoanFeesConfigInput!
    $condition: ModelLoanFeesLoanFeesConfigConditionInput
  ) {
    updateLoanFeesLoanFeesConfig(input: $input, condition: $condition) {
      id
      loanFeesId
      loanFeesConfigId
      loanFees {
        id
        amount
        loanFeesName
        loanFeesCategory
        loanFeesCalculationMethod
        loanFeesRate
        loanFeesDate
        loanFeesStatus
        notes
        loanFeesType
        loanFeesDescription
        loanFeesAttribute1
        loanFeesAttribute2
        accountID
        createdAt
        updatedAt
        loanLoanFeesId
        __typename
      }
      loanFeesConfig {
        id
        name
        category
        calculationMethod
        description
        percentageBase
        rate
        status
        createdAt
        updatedAt
        institutionLoanFeesConfigsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLoanFeesLoanFeesConfig = /* GraphQL */ `
  mutation DeleteLoanFeesLoanFeesConfig(
    $input: DeleteLoanFeesLoanFeesConfigInput!
    $condition: ModelLoanFeesLoanFeesConfigConditionInput
  ) {
    deleteLoanFeesLoanFeesConfig(input: $input, condition: $condition) {
      id
      loanFeesId
      loanFeesConfigId
      loanFees {
        id
        amount
        loanFeesName
        loanFeesCategory
        loanFeesCalculationMethod
        loanFeesRate
        loanFeesDate
        loanFeesStatus
        notes
        loanFeesType
        loanFeesDescription
        loanFeesAttribute1
        loanFeesAttribute2
        accountID
        createdAt
        updatedAt
        loanLoanFeesId
        __typename
      }
      loanFeesConfig {
        id
        name
        category
        calculationMethod
        description
        percentageBase
        rate
        status
        createdAt
        updatedAt
        institutionLoanFeesConfigsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createOtherIncomeAccount = /* GraphQL */ `
  mutation CreateOtherIncomeAccount(
    $input: CreateOtherIncomeAccountInput!
    $condition: ModelOtherIncomeAccountConditionInput
  ) {
    createOtherIncomeAccount(input: $input, condition: $condition) {
      id
      accountId
      otherIncomeId
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      otherIncome {
        id
        name
        description
        amount
        incomeDate
        incomeType
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateOtherIncomeAccount = /* GraphQL */ `
  mutation UpdateOtherIncomeAccount(
    $input: UpdateOtherIncomeAccountInput!
    $condition: ModelOtherIncomeAccountConditionInput
  ) {
    updateOtherIncomeAccount(input: $input, condition: $condition) {
      id
      accountId
      otherIncomeId
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      otherIncome {
        id
        name
        description
        amount
        incomeDate
        incomeType
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteOtherIncomeAccount = /* GraphQL */ `
  mutation DeleteOtherIncomeAccount(
    $input: DeleteOtherIncomeAccountInput!
    $condition: ModelOtherIncomeAccountConditionInput
  ) {
    deleteOtherIncomeAccount(input: $input, condition: $condition) {
      id
      accountId
      otherIncomeId
      account {
        id
        name
        accountType
        accountNumber
        description
        currency
        currentBalance
        openingBalance
        interestRate
        interestCalculationMethod
        interestPostingFrequency
        interestPostingDate
        interestAccrued
        interestAccruedDate
        accountStatus
        createdByEmployeeID
        createdAt
        updatedAt
        branchAccountsId
        __typename
      }
      otherIncome {
        id
        name
        description
        amount
        incomeDate
        incomeType
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
