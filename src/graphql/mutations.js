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
      accounts {
        nextToken
        __typename
      }
      status
      savingsProducts {
        nextToken
        __typename
      }
      chartOfAccounts {
        nextToken
        __typename
      }
      dividendDeclarations {
        nextToken
        __typename
      }
      customDocumentHeader
      customInstitutionDetails
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
      accounts {
        nextToken
        __typename
      }
      status
      savingsProducts {
        nextToken
        __typename
      }
      chartOfAccounts {
        nextToken
        __typename
      }
      dividendDeclarations {
        nextToken
        __typename
      }
      customDocumentHeader
      customInstitutionDetails
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
      accounts {
        nextToken
        __typename
      }
      status
      savingsProducts {
        nextToken
        __typename
      }
      chartOfAccounts {
        nextToken
        __typename
      }
      dividendDeclarations {
        nextToken
        __typename
      }
      customDocumentHeader
      customInstitutionDetails
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
        status
        customDocumentHeader
        customInstitutionDetails
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
      loans {
        nextToken
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      groups {
        nextToken
        __typename
      }
      customBranchDetails
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
        status
        customDocumentHeader
        customInstitutionDetails
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
      loans {
        nextToken
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      groups {
        nextToken
        __typename
      }
      customBranchDetails
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
        status
        customDocumentHeader
        customInstitutionDetails
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
      loans {
        nextToken
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      groups {
        nextToken
        __typename
      }
      customBranchDetails
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
      userPermissions
      description
      customFieldsData
      userDocuments
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
        status
        customDocumentHeader
        customInstitutionDetails
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
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      userNotifications {
        nextToken
        __typename
      }
      sentMessages {
        nextToken
        __typename
      }
      receivedMessages {
        nextToken
        __typename
      }
      sentNotifications {
        nextToken
        __typename
      }
      receivedNotifications {
        nextToken
        __typename
      }
      customUserDetails
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
      userPermissions
      description
      customFieldsData
      userDocuments
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
        status
        customDocumentHeader
        customInstitutionDetails
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
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      userNotifications {
        nextToken
        __typename
      }
      sentMessages {
        nextToken
        __typename
      }
      receivedMessages {
        nextToken
        __typename
      }
      sentNotifications {
        nextToken
        __typename
      }
      receivedNotifications {
        nextToken
        __typename
      }
      customUserDetails
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
      userPermissions
      description
      customFieldsData
      userDocuments
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
        status
        customDocumentHeader
        customInstitutionDetails
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
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      userNotifications {
        nextToken
        __typename
      }
      sentMessages {
        nextToken
        __typename
      }
      receivedMessages {
        nextToken
        __typename
      }
      sentNotifications {
        nextToken
        __typename
      }
      receivedNotifications {
        nextToken
        __typename
      }
      customUserDetails
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
        customBranchDetails
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
        customEmployeeDetails
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
      postedJournalEntries {
        nextToken
        __typename
      }
      initiatedSavingsTransactions {
        nextToken
        __typename
      }
      approvals {
        nextToken
        __typename
      }
      customEmployeeDetails
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
        customBranchDetails
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
        customEmployeeDetails
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
      postedJournalEntries {
        nextToken
        __typename
      }
      initiatedSavingsTransactions {
        nextToken
        __typename
      }
      approvals {
        nextToken
        __typename
      }
      customEmployeeDetails
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
        customBranchDetails
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
        customEmployeeDetails
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
      postedJournalEntries {
        nextToken
        __typename
      }
      initiatedSavingsTransactions {
        nextToken
        __typename
      }
      approvals {
        nextToken
        __typename
      }
      customEmployeeDetails
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
      borrowerDocuments
      customFieldsData
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
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
      groupID
      group {
        id
        name
        groupNumber
        formationDate
        meetingDay
        meetingFrequency
        chairpersonID
        secretaryID
        viceChairpersonID
        treasurerID
        status
        customGroupDetails
        createdAt
        updatedAt
        branchGroupsId
        groupGroupSavingsAccountId
        __typename
      }
      memberType
      savingsAccounts {
        nextToken
        __typename
      }
      shareAccount {
        id
        numberOfShares
        shareValue
        totalValue
        customShareAccountDetails
        createdAt
        updatedAt
        shareAccountBorrowerId
        __typename
      }
      customBorrowerDetails
      createdAt
      updatedAt
      branchBorrowersId
      borrowerShareAccountId
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
      borrowerDocuments
      customFieldsData
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
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
      groupID
      group {
        id
        name
        groupNumber
        formationDate
        meetingDay
        meetingFrequency
        chairpersonID
        secretaryID
        viceChairpersonID
        treasurerID
        status
        customGroupDetails
        createdAt
        updatedAt
        branchGroupsId
        groupGroupSavingsAccountId
        __typename
      }
      memberType
      savingsAccounts {
        nextToken
        __typename
      }
      shareAccount {
        id
        numberOfShares
        shareValue
        totalValue
        customShareAccountDetails
        createdAt
        updatedAt
        shareAccountBorrowerId
        __typename
      }
      customBorrowerDetails
      createdAt
      updatedAt
      branchBorrowersId
      borrowerShareAccountId
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
      borrowerDocuments
      customFieldsData
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
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
      groupID
      group {
        id
        name
        groupNumber
        formationDate
        meetingDay
        meetingFrequency
        chairpersonID
        secretaryID
        viceChairpersonID
        treasurerID
        status
        customGroupDetails
        createdAt
        updatedAt
        branchGroupsId
        groupGroupSavingsAccountId
        __typename
      }
      memberType
      savingsAccounts {
        nextToken
        __typename
      }
      shareAccount {
        id
        numberOfShares
        shareValue
        totalValue
        customShareAccountDetails
        createdAt
        updatedAt
        shareAccountBorrowerId
        __typename
      }
      customBorrowerDetails
      createdAt
      updatedAt
      branchBorrowersId
      borrowerShareAccountId
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
      isExistingMember
      memberID
      lockedSavingsAmount
      collaterals {
        nextToken
        __typename
      }
      customGuarantorDetails
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
      isExistingMember
      memberID
      lockedSavingsAmount
      collaterals {
        nextToken
        __typename
      }
      customGuarantorDetails
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
      isExistingMember
      memberID
      lockedSavingsAmount
      collaterals {
        nextToken
        __typename
      }
      customGuarantorDetails
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
        __typename
      }
      customSecurityDetails
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
        __typename
      }
      customSecurityDetails
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
        __typename
      }
      customSecurityDetails
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      customUserNotificationDetails
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      customUserNotificationDetails
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      customUserNotificationDetails
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
        status
        customDocumentHeader
        customInstitutionDetails
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
      loanFeesConfigs {
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
      customLoanProductDetails
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
        status
        customDocumentHeader
        customInstitutionDetails
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
      loanFeesConfigs {
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
      customLoanProductDetails
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
        status
        customDocumentHeader
        customInstitutionDetails
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
      loanFeesConfigs {
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
      customLoanProductDetails
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customCreditScoreDetails
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customCreditScoreDetails
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customCreditScoreDetails
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
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
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
      moneyTransactions {
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customDocumentDetails
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
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
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
      moneyTransactions {
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customDocumentDetails
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
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
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
      moneyTransactions {
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customDocumentDetails
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
      customContractDetails
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
      customContractDetails
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
      customContractDetails
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
        status
        customLoanProductDetails
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customFieldsData
      customApplicationDetails
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
        status
        customLoanProductDetails
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customFieldsData
      customApplicationDetails
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
        status
        customLoanProductDetails
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customFieldsData
      customApplicationDetails
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
      guarantors {
        nextToken
        __typename
      }
      customCollateralDetails
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
      guarantors {
        nextToken
        __typename
      }
      customCollateralDetails
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
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
      guarantors {
        nextToken
        __typename
      }
      customCollateralDetails
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
      loanNumber
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
      loanCurrency
      loanPurpose
      loanComputationRecord
      loanAttribute1
      loanAttribute2
      numberOfPayments
      paymentFrequency
      customFieldsData
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
        __typename
      }
      branchID
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      payments {
        nextToken
        __typename
      }
      events {
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
      documents {
        nextToken
        __typename
      }
      moneyTransactions {
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
        status
        customLoanProductDetails
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      groupID
      group {
        id
        name
        groupNumber
        formationDate
        meetingDay
        meetingFrequency
        chairpersonID
        secretaryID
        viceChairpersonID
        treasurerID
        status
        customGroupDetails
        createdAt
        updatedAt
        branchGroupsId
        groupGroupSavingsAccountId
        __typename
      }
      relatedJournalEntries {
        nextToken
        __typename
      }
      customLoanDetails
      createdAt
      updatedAt
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
      loanNumber
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
      loanCurrency
      loanPurpose
      loanComputationRecord
      loanAttribute1
      loanAttribute2
      numberOfPayments
      paymentFrequency
      customFieldsData
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
        __typename
      }
      branchID
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      payments {
        nextToken
        __typename
      }
      events {
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
      documents {
        nextToken
        __typename
      }
      moneyTransactions {
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
        status
        customLoanProductDetails
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      groupID
      group {
        id
        name
        groupNumber
        formationDate
        meetingDay
        meetingFrequency
        chairpersonID
        secretaryID
        viceChairpersonID
        treasurerID
        status
        customGroupDetails
        createdAt
        updatedAt
        branchGroupsId
        groupGroupSavingsAccountId
        __typename
      }
      relatedJournalEntries {
        nextToken
        __typename
      }
      customLoanDetails
      createdAt
      updatedAt
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
      loanNumber
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
      loanCurrency
      loanPurpose
      loanComputationRecord
      loanAttribute1
      loanAttribute2
      numberOfPayments
      paymentFrequency
      customFieldsData
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
        __typename
      }
      branchID
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      payments {
        nextToken
        __typename
      }
      events {
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
      documents {
        nextToken
        __typename
      }
      moneyTransactions {
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
        status
        customLoanProductDetails
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      groupID
      group {
        id
        name
        groupNumber
        formationDate
        meetingDay
        meetingFrequency
        chairpersonID
        secretaryID
        viceChairpersonID
        treasurerID
        status
        customGroupDetails
        createdAt
        updatedAt
        branchGroupsId
        groupGroupSavingsAccountId
        __typename
      }
      relatedJournalEntries {
        nextToken
        __typename
      }
      customLoanDetails
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLoanEvent = /* GraphQL */ `
  mutation CreateLoanEvent(
    $input: CreateLoanEventInput!
    $condition: ModelLoanEventConditionInput
  ) {
    createLoanEvent(input: $input, condition: $condition) {
      id
      loanID
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
        __typename
      }
      eventAt
      eventType
      actorEmployeeID
      summary
      payload
      paymentID
      payment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        paymentStatusEnum
        notes
        loanID
        moneyTransactionID
        accountID
        receivingEmployeeID
        amountAllocatedToPrincipal
        amountAllocatedToInterest
        amountAllocatedToFees
        amountAllocatedToPenalty
        customPaymentDetails
        createdAt
        updatedAt
        __typename
      }
      customLoanEventDetails
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLoanEvent = /* GraphQL */ `
  mutation UpdateLoanEvent(
    $input: UpdateLoanEventInput!
    $condition: ModelLoanEventConditionInput
  ) {
    updateLoanEvent(input: $input, condition: $condition) {
      id
      loanID
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
        __typename
      }
      eventAt
      eventType
      actorEmployeeID
      summary
      payload
      paymentID
      payment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        paymentStatusEnum
        notes
        loanID
        moneyTransactionID
        accountID
        receivingEmployeeID
        amountAllocatedToPrincipal
        amountAllocatedToInterest
        amountAllocatedToFees
        amountAllocatedToPenalty
        customPaymentDetails
        createdAt
        updatedAt
        __typename
      }
      customLoanEventDetails
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLoanEvent = /* GraphQL */ `
  mutation DeleteLoanEvent(
    $input: DeleteLoanEventInput!
    $condition: ModelLoanEventConditionInput
  ) {
    deleteLoanEvent(input: $input, condition: $condition) {
      id
      loanID
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
        __typename
      }
      eventAt
      eventType
      actorEmployeeID
      summary
      payload
      paymentID
      payment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        paymentStatusEnum
        notes
        loanID
        moneyTransactionID
        accountID
        receivingEmployeeID
        amountAllocatedToPrincipal
        amountAllocatedToInterest
        amountAllocatedToFees
        amountAllocatedToPenalty
        customPaymentDetails
        createdAt
        updatedAt
        __typename
      }
      customLoanEventDetails
      createdAt
      updatedAt
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
      status
      accounts {
        nextToken
        __typename
      }
      customInvestmentDetails
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
      status
      accounts {
        nextToken
        __typename
      }
      customInvestmentDetails
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
      status
      accounts {
        nextToken
        __typename
      }
      customInvestmentDetails
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
      status
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      customLoanFeesDetails
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
      status
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      customLoanFeesDetails
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
      status
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      loanFeesConfigs {
        nextToken
        __typename
      }
      customLoanFeesDetails
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
      status
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      customPenaltyDetails
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
      status
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      customPenaltyDetails
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
      status
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      customPenaltyDetails
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
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      employees {
        nextToken
        __typename
      }
      customPayrollDetails
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
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      employees {
        nextToken
        __typename
      }
      customPayrollDetails
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
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      employees {
        nextToken
        __typename
      }
      customPayrollDetails
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      branches {
        nextToken
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customAccountDetails
      createdAt
      updatedAt
      institutionAccountsId
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      branches {
        nextToken
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customAccountDetails
      createdAt
      updatedAt
      institutionAccountsId
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      branches {
        nextToken
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customAccountDetails
      createdAt
      updatedAt
      institutionAccountsId
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
      status
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      loanID
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
        __typename
      }
      paymentID
      payment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        paymentStatusEnum
        notes
        loanID
        moneyTransactionID
        accountID
        receivingEmployeeID
        amountAllocatedToPrincipal
        amountAllocatedToInterest
        amountAllocatedToFees
        amountAllocatedToPenalty
        customPaymentDetails
        createdAt
        updatedAt
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      paymentsLink {
        nextToken
        __typename
      }
      customMoneyTransactionDetails
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
      status
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      loanID
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
        __typename
      }
      paymentID
      payment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        paymentStatusEnum
        notes
        loanID
        moneyTransactionID
        accountID
        receivingEmployeeID
        amountAllocatedToPrincipal
        amountAllocatedToInterest
        amountAllocatedToFees
        amountAllocatedToPenalty
        customPaymentDetails
        createdAt
        updatedAt
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      paymentsLink {
        nextToken
        __typename
      }
      customMoneyTransactionDetails
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
      status
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      loanID
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
        __typename
      }
      paymentID
      payment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        paymentStatusEnum
        notes
        loanID
        moneyTransactionID
        accountID
        receivingEmployeeID
        amountAllocatedToPrincipal
        amountAllocatedToInterest
        amountAllocatedToFees
        amountAllocatedToPenalty
        customPaymentDetails
        createdAt
        updatedAt
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      paymentsLink {
        nextToken
        __typename
      }
      customMoneyTransactionDetails
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
      paymentStatusEnum
      notes
      loanID
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
        __typename
      }
      moneyTransactionID
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
        status
        loanID
        paymentID
        createdByEmployeeID
        customMoneyTransactionDetails
        createdAt
        updatedAt
        accountMoneyTransactionsId
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      documents {
        nextToken
        __typename
      }
      moneyTransactions {
        nextToken
        __typename
      }
      events {
        nextToken
        __typename
      }
      amountAllocatedToPrincipal
      amountAllocatedToInterest
      amountAllocatedToFees
      amountAllocatedToPenalty
      relatedJournalEntries {
        nextToken
        __typename
      }
      customPaymentDetails
      createdAt
      updatedAt
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
      paymentStatusEnum
      notes
      loanID
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
        __typename
      }
      moneyTransactionID
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
        status
        loanID
        paymentID
        createdByEmployeeID
        customMoneyTransactionDetails
        createdAt
        updatedAt
        accountMoneyTransactionsId
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      documents {
        nextToken
        __typename
      }
      moneyTransactions {
        nextToken
        __typename
      }
      events {
        nextToken
        __typename
      }
      amountAllocatedToPrincipal
      amountAllocatedToInterest
      amountAllocatedToFees
      amountAllocatedToPenalty
      relatedJournalEntries {
        nextToken
        __typename
      }
      customPaymentDetails
      createdAt
      updatedAt
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
      paymentStatusEnum
      notes
      loanID
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
        __typename
      }
      moneyTransactionID
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
        status
        loanID
        paymentID
        createdByEmployeeID
        customMoneyTransactionDetails
        createdAt
        updatedAt
        accountMoneyTransactionsId
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      documents {
        nextToken
        __typename
      }
      moneyTransactions {
        nextToken
        __typename
      }
      events {
        nextToken
        __typename
      }
      amountAllocatedToPrincipal
      amountAllocatedToInterest
      amountAllocatedToFees
      amountAllocatedToPenalty
      relatedJournalEntries {
        nextToken
        __typename
      }
      customPaymentDetails
      createdAt
      updatedAt
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      relatedJournalEntries {
        nextToken
        __typename
      }
      customExpenseDetails
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      relatedJournalEntries {
        nextToken
        __typename
      }
      customExpenseDetails
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      relatedJournalEntries {
        nextToken
        __typename
      }
      customExpenseDetails
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
      status
      accounts {
        nextToken
        __typename
      }
      customOtherIncomeDetails
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
      status
      accounts {
        nextToken
        __typename
      }
      customOtherIncomeDetails
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
      status
      accounts {
        nextToken
        __typename
      }
      customOtherIncomeDetails
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
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      customFinancialReportDetails
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
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      customFinancialReportDetails
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
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      customFinancialReportDetails
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
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      customCustomFormFieldDetails
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
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      customCustomFormFieldDetails
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
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      customCustomFormFieldDetails
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
        status
        customDocumentHeader
        customInstitutionDetails
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
      loanProducts {
        nextToken
        __typename
      }
      customLoanFeesConfigDetails
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
        status
        customDocumentHeader
        customInstitutionDetails
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
      loanProducts {
        nextToken
        __typename
      }
      customLoanFeesConfigDetails
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
        status
        customDocumentHeader
        customInstitutionDetails
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
      loanProducts {
        nextToken
        __typename
      }
      customLoanFeesConfigDetails
      createdAt
      updatedAt
      institutionLoanFeesConfigsId
      __typename
    }
  }
`;
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
      id
      subject
      body
      status
      createdAt
      sender {
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      senderUserId
      recipient {
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      recipientUserId
      customMessageDetails
      updatedAt
      __typename
    }
  }
`;
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
      id
      subject
      body
      status
      createdAt
      sender {
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      senderUserId
      recipient {
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      recipientUserId
      customMessageDetails
      updatedAt
      __typename
    }
  }
`;
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
      id
      subject
      body
      status
      createdAt
      sender {
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      senderUserId
      recipient {
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      recipientUserId
      customMessageDetails
      updatedAt
      __typename
    }
  }
`;
export const createNotification = /* GraphQL */ `
  mutation CreateNotification(
    $input: CreateNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    createNotification(input: $input, condition: $condition) {
      id
      subject
      body
      notificationType
      approvalStatus
      referenceId
      status
      createdAt
      sender {
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      senderUserId
      recipient {
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      recipientUserId
      institutionMessagesId
      customNotificationDetails
      updatedAt
      __typename
    }
  }
`;
export const updateNotification = /* GraphQL */ `
  mutation UpdateNotification(
    $input: UpdateNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    updateNotification(input: $input, condition: $condition) {
      id
      subject
      body
      notificationType
      approvalStatus
      referenceId
      status
      createdAt
      sender {
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      senderUserId
      recipient {
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      recipientUserId
      institutionMessagesId
      customNotificationDetails
      updatedAt
      __typename
    }
  }
`;
export const deleteNotification = /* GraphQL */ `
  mutation DeleteNotification(
    $input: DeleteNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    deleteNotification(input: $input, condition: $condition) {
      id
      subject
      body
      notificationType
      approvalStatus
      referenceId
      status
      createdAt
      sender {
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      senderUserId
      recipient {
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
        userPermissions
        description
        customFieldsData
        userDocuments
        customUserDetails
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      recipientUserId
      institutionMessagesId
      customNotificationDetails
      updatedAt
      __typename
    }
  }
`;
export const createGroup = /* GraphQL */ `
  mutation CreateGroup(
    $input: CreateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    createGroup(input: $input, condition: $condition) {
      id
      name
      groupNumber
      formationDate
      meetingDay
      meetingFrequency
      chairpersonID
      secretaryID
      viceChairpersonID
      treasurerID
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      members {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      groupSavingsAccount {
        id
        accountNumber
        balance
        status
        lockedAmount
        lockedForLoanID
        customSavingsAccountDetails
        createdAt
        updatedAt
        borrowerSavingsAccountsId
        savingsProductSavingsAccountsId
        __typename
      }
      customGroupDetails
      createdAt
      updatedAt
      branchGroupsId
      groupGroupSavingsAccountId
      __typename
    }
  }
`;
export const updateGroup = /* GraphQL */ `
  mutation UpdateGroup(
    $input: UpdateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    updateGroup(input: $input, condition: $condition) {
      id
      name
      groupNumber
      formationDate
      meetingDay
      meetingFrequency
      chairpersonID
      secretaryID
      viceChairpersonID
      treasurerID
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      members {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      groupSavingsAccount {
        id
        accountNumber
        balance
        status
        lockedAmount
        lockedForLoanID
        customSavingsAccountDetails
        createdAt
        updatedAt
        borrowerSavingsAccountsId
        savingsProductSavingsAccountsId
        __typename
      }
      customGroupDetails
      createdAt
      updatedAt
      branchGroupsId
      groupGroupSavingsAccountId
      __typename
    }
  }
`;
export const deleteGroup = /* GraphQL */ `
  mutation DeleteGroup(
    $input: DeleteGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    deleteGroup(input: $input, condition: $condition) {
      id
      name
      groupNumber
      formationDate
      meetingDay
      meetingFrequency
      chairpersonID
      secretaryID
      viceChairpersonID
      treasurerID
      status
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      members {
        nextToken
        __typename
      }
      loans {
        nextToken
        __typename
      }
      groupSavingsAccount {
        id
        accountNumber
        balance
        status
        lockedAmount
        lockedForLoanID
        customSavingsAccountDetails
        createdAt
        updatedAt
        borrowerSavingsAccountsId
        savingsProductSavingsAccountsId
        __typename
      }
      customGroupDetails
      createdAt
      updatedAt
      branchGroupsId
      groupGroupSavingsAccountId
      __typename
    }
  }
`;
export const createSavingsProduct = /* GraphQL */ `
  mutation CreateSavingsProduct(
    $input: CreateSavingsProductInput!
    $condition: ModelSavingsProductConditionInput
  ) {
    createSavingsProduct(input: $input, condition: $condition) {
      id
      name
      type
      interestRate
      interestPostingFrequency
      minBalance
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      savingsAccounts {
        nextToken
        __typename
      }
      customSavingsProductDetails
      createdAt
      updatedAt
      institutionSavingsProductsId
      __typename
    }
  }
`;
export const updateSavingsProduct = /* GraphQL */ `
  mutation UpdateSavingsProduct(
    $input: UpdateSavingsProductInput!
    $condition: ModelSavingsProductConditionInput
  ) {
    updateSavingsProduct(input: $input, condition: $condition) {
      id
      name
      type
      interestRate
      interestPostingFrequency
      minBalance
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      savingsAccounts {
        nextToken
        __typename
      }
      customSavingsProductDetails
      createdAt
      updatedAt
      institutionSavingsProductsId
      __typename
    }
  }
`;
export const deleteSavingsProduct = /* GraphQL */ `
  mutation DeleteSavingsProduct(
    $input: DeleteSavingsProductInput!
    $condition: ModelSavingsProductConditionInput
  ) {
    deleteSavingsProduct(input: $input, condition: $condition) {
      id
      name
      type
      interestRate
      interestPostingFrequency
      minBalance
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      savingsAccounts {
        nextToken
        __typename
      }
      customSavingsProductDetails
      createdAt
      updatedAt
      institutionSavingsProductsId
      __typename
    }
  }
`;
export const createSavingsAccount = /* GraphQL */ `
  mutation CreateSavingsAccount(
    $input: CreateSavingsAccountInput!
    $condition: ModelSavingsAccountConditionInput
  ) {
    createSavingsAccount(input: $input, condition: $condition) {
      id
      accountNumber
      balance
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
        __typename
      }
      savingsProduct {
        id
        name
        type
        interestRate
        interestPostingFrequency
        minBalance
        customSavingsProductDetails
        createdAt
        updatedAt
        institutionSavingsProductsId
        __typename
      }
      lockedAmount
      lockedForLoanID
      transactions {
        nextToken
        __typename
      }
      customSavingsAccountDetails
      createdAt
      updatedAt
      borrowerSavingsAccountsId
      savingsProductSavingsAccountsId
      __typename
    }
  }
`;
export const updateSavingsAccount = /* GraphQL */ `
  mutation UpdateSavingsAccount(
    $input: UpdateSavingsAccountInput!
    $condition: ModelSavingsAccountConditionInput
  ) {
    updateSavingsAccount(input: $input, condition: $condition) {
      id
      accountNumber
      balance
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
        __typename
      }
      savingsProduct {
        id
        name
        type
        interestRate
        interestPostingFrequency
        minBalance
        customSavingsProductDetails
        createdAt
        updatedAt
        institutionSavingsProductsId
        __typename
      }
      lockedAmount
      lockedForLoanID
      transactions {
        nextToken
        __typename
      }
      customSavingsAccountDetails
      createdAt
      updatedAt
      borrowerSavingsAccountsId
      savingsProductSavingsAccountsId
      __typename
    }
  }
`;
export const deleteSavingsAccount = /* GraphQL */ `
  mutation DeleteSavingsAccount(
    $input: DeleteSavingsAccountInput!
    $condition: ModelSavingsAccountConditionInput
  ) {
    deleteSavingsAccount(input: $input, condition: $condition) {
      id
      accountNumber
      balance
      status
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
        __typename
      }
      savingsProduct {
        id
        name
        type
        interestRate
        interestPostingFrequency
        minBalance
        customSavingsProductDetails
        createdAt
        updatedAt
        institutionSavingsProductsId
        __typename
      }
      lockedAmount
      lockedForLoanID
      transactions {
        nextToken
        __typename
      }
      customSavingsAccountDetails
      createdAt
      updatedAt
      borrowerSavingsAccountsId
      savingsProductSavingsAccountsId
      __typename
    }
  }
`;
export const createSavingsTransaction = /* GraphQL */ `
  mutation CreateSavingsTransaction(
    $input: CreateSavingsTransactionInput!
    $condition: ModelSavingsTransactionConditionInput
  ) {
    createSavingsTransaction(input: $input, condition: $condition) {
      id
      amount
      type
      date
      savingsAccount {
        id
        accountNumber
        balance
        status
        lockedAmount
        lockedForLoanID
        customSavingsAccountDetails
        createdAt
        updatedAt
        borrowerSavingsAccountsId
        savingsProductSavingsAccountsId
        __typename
      }
      initiatedBy {
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customSavingsTransactionDetails
      createdAt
      updatedAt
      employeeInitiatedSavingsTransactionsId
      savingsAccountTransactionsId
      __typename
    }
  }
`;
export const updateSavingsTransaction = /* GraphQL */ `
  mutation UpdateSavingsTransaction(
    $input: UpdateSavingsTransactionInput!
    $condition: ModelSavingsTransactionConditionInput
  ) {
    updateSavingsTransaction(input: $input, condition: $condition) {
      id
      amount
      type
      date
      savingsAccount {
        id
        accountNumber
        balance
        status
        lockedAmount
        lockedForLoanID
        customSavingsAccountDetails
        createdAt
        updatedAt
        borrowerSavingsAccountsId
        savingsProductSavingsAccountsId
        __typename
      }
      initiatedBy {
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customSavingsTransactionDetails
      createdAt
      updatedAt
      employeeInitiatedSavingsTransactionsId
      savingsAccountTransactionsId
      __typename
    }
  }
`;
export const deleteSavingsTransaction = /* GraphQL */ `
  mutation DeleteSavingsTransaction(
    $input: DeleteSavingsTransactionInput!
    $condition: ModelSavingsTransactionConditionInput
  ) {
    deleteSavingsTransaction(input: $input, condition: $condition) {
      id
      amount
      type
      date
      savingsAccount {
        id
        accountNumber
        balance
        status
        lockedAmount
        lockedForLoanID
        customSavingsAccountDetails
        createdAt
        updatedAt
        borrowerSavingsAccountsId
        savingsProductSavingsAccountsId
        __typename
      }
      initiatedBy {
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customSavingsTransactionDetails
      createdAt
      updatedAt
      employeeInitiatedSavingsTransactionsId
      savingsAccountTransactionsId
      __typename
    }
  }
`;
export const createShareAccount = /* GraphQL */ `
  mutation CreateShareAccount(
    $input: CreateShareAccountInput!
    $condition: ModelShareAccountConditionInput
  ) {
    createShareAccount(input: $input, condition: $condition) {
      id
      numberOfShares
      shareValue
      totalValue
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
        __typename
      }
      transactions {
        nextToken
        __typename
      }
      customShareAccountDetails
      createdAt
      updatedAt
      shareAccountBorrowerId
      __typename
    }
  }
`;
export const updateShareAccount = /* GraphQL */ `
  mutation UpdateShareAccount(
    $input: UpdateShareAccountInput!
    $condition: ModelShareAccountConditionInput
  ) {
    updateShareAccount(input: $input, condition: $condition) {
      id
      numberOfShares
      shareValue
      totalValue
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
        __typename
      }
      transactions {
        nextToken
        __typename
      }
      customShareAccountDetails
      createdAt
      updatedAt
      shareAccountBorrowerId
      __typename
    }
  }
`;
export const deleteShareAccount = /* GraphQL */ `
  mutation DeleteShareAccount(
    $input: DeleteShareAccountInput!
    $condition: ModelShareAccountConditionInput
  ) {
    deleteShareAccount(input: $input, condition: $condition) {
      id
      numberOfShares
      shareValue
      totalValue
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
        __typename
      }
      transactions {
        nextToken
        __typename
      }
      customShareAccountDetails
      createdAt
      updatedAt
      shareAccountBorrowerId
      __typename
    }
  }
`;
export const createShareTransaction = /* GraphQL */ `
  mutation CreateShareTransaction(
    $input: CreateShareTransactionInput!
    $condition: ModelShareTransactionConditionInput
  ) {
    createShareTransaction(input: $input, condition: $condition) {
      id
      type
      numberOfShares
      amount
      date
      shareAccount {
        id
        numberOfShares
        shareValue
        totalValue
        customShareAccountDetails
        createdAt
        updatedAt
        shareAccountBorrowerId
        __typename
      }
      customShareTransactionDetails
      createdAt
      updatedAt
      shareAccountTransactionsId
      __typename
    }
  }
`;
export const updateShareTransaction = /* GraphQL */ `
  mutation UpdateShareTransaction(
    $input: UpdateShareTransactionInput!
    $condition: ModelShareTransactionConditionInput
  ) {
    updateShareTransaction(input: $input, condition: $condition) {
      id
      type
      numberOfShares
      amount
      date
      shareAccount {
        id
        numberOfShares
        shareValue
        totalValue
        customShareAccountDetails
        createdAt
        updatedAt
        shareAccountBorrowerId
        __typename
      }
      customShareTransactionDetails
      createdAt
      updatedAt
      shareAccountTransactionsId
      __typename
    }
  }
`;
export const deleteShareTransaction = /* GraphQL */ `
  mutation DeleteShareTransaction(
    $input: DeleteShareTransactionInput!
    $condition: ModelShareTransactionConditionInput
  ) {
    deleteShareTransaction(input: $input, condition: $condition) {
      id
      type
      numberOfShares
      amount
      date
      shareAccount {
        id
        numberOfShares
        shareValue
        totalValue
        customShareAccountDetails
        createdAt
        updatedAt
        shareAccountBorrowerId
        __typename
      }
      customShareTransactionDetails
      createdAt
      updatedAt
      shareAccountTransactionsId
      __typename
    }
  }
`;
export const createChartOfAccounts = /* GraphQL */ `
  mutation CreateChartOfAccounts(
    $input: CreateChartOfAccountsInput!
    $condition: ModelChartOfAccountsConditionInput
  ) {
    createChartOfAccounts(input: $input, condition: $condition) {
      id
      code
      name
      type
      subtype
      balance
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      journalLines {
        nextToken
        __typename
      }
      customChartOfAccountsDetails
      createdAt
      updatedAt
      institutionChartOfAccountsId
      __typename
    }
  }
`;
export const updateChartOfAccounts = /* GraphQL */ `
  mutation UpdateChartOfAccounts(
    $input: UpdateChartOfAccountsInput!
    $condition: ModelChartOfAccountsConditionInput
  ) {
    updateChartOfAccounts(input: $input, condition: $condition) {
      id
      code
      name
      type
      subtype
      balance
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      journalLines {
        nextToken
        __typename
      }
      customChartOfAccountsDetails
      createdAt
      updatedAt
      institutionChartOfAccountsId
      __typename
    }
  }
`;
export const deleteChartOfAccounts = /* GraphQL */ `
  mutation DeleteChartOfAccounts(
    $input: DeleteChartOfAccountsInput!
    $condition: ModelChartOfAccountsConditionInput
  ) {
    deleteChartOfAccounts(input: $input, condition: $condition) {
      id
      code
      name
      type
      subtype
      balance
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      journalLines {
        nextToken
        __typename
      }
      customChartOfAccountsDetails
      createdAt
      updatedAt
      institutionChartOfAccountsId
      __typename
    }
  }
`;
export const createJournalEntry = /* GraphQL */ `
  mutation CreateJournalEntry(
    $input: CreateJournalEntryInput!
    $condition: ModelJournalEntryConditionInput
  ) {
    createJournalEntry(input: $input, condition: $condition) {
      id
      date
      description
      reference
      postedBy {
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      status
      lines {
        nextToken
        __typename
      }
      relatedLoanID
      relatedLoan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
        __typename
      }
      relatedPaymentID
      relatedPayment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        paymentStatusEnum
        notes
        loanID
        moneyTransactionID
        accountID
        receivingEmployeeID
        amountAllocatedToPrincipal
        amountAllocatedToInterest
        amountAllocatedToFees
        amountAllocatedToPenalty
        customPaymentDetails
        createdAt
        updatedAt
        __typename
      }
      relatedExpenseID
      relatedExpense {
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
        customExpenseDetails
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      customJournalEntryDetails
      createdAt
      updatedAt
      employeePostedJournalEntriesId
      __typename
    }
  }
`;
export const updateJournalEntry = /* GraphQL */ `
  mutation UpdateJournalEntry(
    $input: UpdateJournalEntryInput!
    $condition: ModelJournalEntryConditionInput
  ) {
    updateJournalEntry(input: $input, condition: $condition) {
      id
      date
      description
      reference
      postedBy {
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      status
      lines {
        nextToken
        __typename
      }
      relatedLoanID
      relatedLoan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
        __typename
      }
      relatedPaymentID
      relatedPayment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        paymentStatusEnum
        notes
        loanID
        moneyTransactionID
        accountID
        receivingEmployeeID
        amountAllocatedToPrincipal
        amountAllocatedToInterest
        amountAllocatedToFees
        amountAllocatedToPenalty
        customPaymentDetails
        createdAt
        updatedAt
        __typename
      }
      relatedExpenseID
      relatedExpense {
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
        customExpenseDetails
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      customJournalEntryDetails
      createdAt
      updatedAt
      employeePostedJournalEntriesId
      __typename
    }
  }
`;
export const deleteJournalEntry = /* GraphQL */ `
  mutation DeleteJournalEntry(
    $input: DeleteJournalEntryInput!
    $condition: ModelJournalEntryConditionInput
  ) {
    deleteJournalEntry(input: $input, condition: $condition) {
      id
      date
      description
      reference
      postedBy {
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      status
      lines {
        nextToken
        __typename
      }
      relatedLoanID
      relatedLoan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
        __typename
      }
      relatedPaymentID
      relatedPayment {
        id
        paymentDate
        paymentType
        amount
        description
        referenceNumber
        paymentMethod
        status
        paymentStatusEnum
        notes
        loanID
        moneyTransactionID
        accountID
        receivingEmployeeID
        amountAllocatedToPrincipal
        amountAllocatedToInterest
        amountAllocatedToFees
        amountAllocatedToPenalty
        customPaymentDetails
        createdAt
        updatedAt
        __typename
      }
      relatedExpenseID
      relatedExpense {
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
        customExpenseDetails
        createdAt
        updatedAt
        accountExpensesId
        __typename
      }
      customJournalEntryDetails
      createdAt
      updatedAt
      employeePostedJournalEntriesId
      __typename
    }
  }
`;
export const createJournalLine = /* GraphQL */ `
  mutation CreateJournalLine(
    $input: CreateJournalLineInput!
    $condition: ModelJournalLineConditionInput
  ) {
    createJournalLine(input: $input, condition: $condition) {
      id
      journalEntry {
        id
        date
        description
        reference
        status
        relatedLoanID
        relatedPaymentID
        relatedExpenseID
        customJournalEntryDetails
        createdAt
        updatedAt
        employeePostedJournalEntriesId
        __typename
      }
      chartOfAccounts {
        id
        code
        name
        type
        subtype
        balance
        customChartOfAccountsDetails
        createdAt
        updatedAt
        institutionChartOfAccountsId
        __typename
      }
      debit
      credit
      description
      customJournalLineDetails
      createdAt
      updatedAt
      chartOfAccountsJournalLinesId
      journalEntryLinesId
      __typename
    }
  }
`;
export const updateJournalLine = /* GraphQL */ `
  mutation UpdateJournalLine(
    $input: UpdateJournalLineInput!
    $condition: ModelJournalLineConditionInput
  ) {
    updateJournalLine(input: $input, condition: $condition) {
      id
      journalEntry {
        id
        date
        description
        reference
        status
        relatedLoanID
        relatedPaymentID
        relatedExpenseID
        customJournalEntryDetails
        createdAt
        updatedAt
        employeePostedJournalEntriesId
        __typename
      }
      chartOfAccounts {
        id
        code
        name
        type
        subtype
        balance
        customChartOfAccountsDetails
        createdAt
        updatedAt
        institutionChartOfAccountsId
        __typename
      }
      debit
      credit
      description
      customJournalLineDetails
      createdAt
      updatedAt
      chartOfAccountsJournalLinesId
      journalEntryLinesId
      __typename
    }
  }
`;
export const deleteJournalLine = /* GraphQL */ `
  mutation DeleteJournalLine(
    $input: DeleteJournalLineInput!
    $condition: ModelJournalLineConditionInput
  ) {
    deleteJournalLine(input: $input, condition: $condition) {
      id
      journalEntry {
        id
        date
        description
        reference
        status
        relatedLoanID
        relatedPaymentID
        relatedExpenseID
        customJournalEntryDetails
        createdAt
        updatedAt
        employeePostedJournalEntriesId
        __typename
      }
      chartOfAccounts {
        id
        code
        name
        type
        subtype
        balance
        customChartOfAccountsDetails
        createdAt
        updatedAt
        institutionChartOfAccountsId
        __typename
      }
      debit
      credit
      description
      customJournalLineDetails
      createdAt
      updatedAt
      chartOfAccountsJournalLinesId
      journalEntryLinesId
      __typename
    }
  }
`;
export const createMeeting = /* GraphQL */ `
  mutation CreateMeeting(
    $input: CreateMeetingInput!
    $condition: ModelMeetingConditionInput
  ) {
    createMeeting(input: $input, condition: $condition) {
      id
      title
      date
      type
      status
      minutes
      attendanceRecord
      resolutionsRecord
      customMeetingDetails
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateMeeting = /* GraphQL */ `
  mutation UpdateMeeting(
    $input: UpdateMeetingInput!
    $condition: ModelMeetingConditionInput
  ) {
    updateMeeting(input: $input, condition: $condition) {
      id
      title
      date
      type
      status
      minutes
      attendanceRecord
      resolutionsRecord
      customMeetingDetails
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteMeeting = /* GraphQL */ `
  mutation DeleteMeeting(
    $input: DeleteMeetingInput!
    $condition: ModelMeetingConditionInput
  ) {
    deleteMeeting(input: $input, condition: $condition) {
      id
      title
      date
      type
      status
      minutes
      attendanceRecord
      resolutionsRecord
      customMeetingDetails
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createDividendDeclaration = /* GraphQL */ `
  mutation CreateDividendDeclaration(
    $input: CreateDividendDeclarationInput!
    $condition: ModelDividendDeclarationConditionInput
  ) {
    createDividendDeclaration(input: $input, condition: $condition) {
      id
      fiscalYear
      distributableSurplus
      dividendRate
      interestRebateRate
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      customDividendDeclarationDetails
      createdAt
      updatedAt
      institutionDividendDeclarationsId
      __typename
    }
  }
`;
export const updateDividendDeclaration = /* GraphQL */ `
  mutation UpdateDividendDeclaration(
    $input: UpdateDividendDeclarationInput!
    $condition: ModelDividendDeclarationConditionInput
  ) {
    updateDividendDeclaration(input: $input, condition: $condition) {
      id
      fiscalYear
      distributableSurplus
      dividendRate
      interestRebateRate
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      customDividendDeclarationDetails
      createdAt
      updatedAt
      institutionDividendDeclarationsId
      __typename
    }
  }
`;
export const deleteDividendDeclaration = /* GraphQL */ `
  mutation DeleteDividendDeclaration(
    $input: DeleteDividendDeclarationInput!
    $condition: ModelDividendDeclarationConditionInput
  ) {
    deleteDividendDeclaration(input: $input, condition: $condition) {
      id
      fiscalYear
      distributableSurplus
      dividendRate
      interestRebateRate
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
        status
        customDocumentHeader
        customInstitutionDetails
        createdAt
        updatedAt
        __typename
      }
      customDividendDeclarationDetails
      createdAt
      updatedAt
      institutionDividendDeclarationsId
      __typename
    }
  }
`;
export const createApproval = /* GraphQL */ `
  mutation CreateApproval(
    $input: CreateApprovalInput!
    $condition: ModelApprovalConditionInput
  ) {
    createApproval(input: $input, condition: $condition) {
      id
      approvalType
      recordID
      approvalDate
      status
      notes
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customApprovalDetails
      createdAt
      updatedAt
      employeeApprovalsId
      __typename
    }
  }
`;
export const updateApproval = /* GraphQL */ `
  mutation UpdateApproval(
    $input: UpdateApprovalInput!
    $condition: ModelApprovalConditionInput
  ) {
    updateApproval(input: $input, condition: $condition) {
      id
      approvalType
      recordID
      approvalDate
      status
      notes
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customApprovalDetails
      createdAt
      updatedAt
      employeeApprovalsId
      __typename
    }
  }
`;
export const deleteApproval = /* GraphQL */ `
  mutation DeleteApproval(
    $input: DeleteApprovalInput!
    $condition: ModelApprovalConditionInput
  ) {
    deleteApproval(input: $input, condition: $condition) {
      id
      approvalType
      recordID
      approvalDate
      status
      notes
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
        customEmployeeDetails
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      customApprovalDetails
      createdAt
      updatedAt
      employeeApprovalsId
      __typename
    }
  }
`;
export const createAccountBranch = /* GraphQL */ `
  mutation CreateAccountBranch(
    $input: CreateAccountBranchInput!
    $condition: ModelAccountBranchConditionInput
  ) {
    createAccountBranch(input: $input, condition: $condition) {
      id
      branchId
      accountId
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateAccountBranch = /* GraphQL */ `
  mutation UpdateAccountBranch(
    $input: UpdateAccountBranchInput!
    $condition: ModelAccountBranchConditionInput
  ) {
    updateAccountBranch(input: $input, condition: $condition) {
      id
      branchId
      accountId
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteAccountBranch = /* GraphQL */ `
  mutation DeleteAccountBranch(
    $input: DeleteAccountBranchInput!
    $condition: ModelAccountBranchConditionInput
  ) {
    deleteAccountBranch(input: $input, condition: $condition) {
      id
      branchId
      accountId
      branch {
        id
        name
        branchCode
        address
        status
        customBranchDetails
        createdAt
        updatedAt
        institutionBranchesId
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      createdAt
      updatedAt
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
        customBranchDetails
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
        status
        customLoanProductDetails
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
        customBranchDetails
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
        status
        customLoanProductDetails
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
        customBranchDetails
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
        status
        customLoanProductDetails
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
        customBranchDetails
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
        customLoanFeesConfigDetails
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
        customBranchDetails
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
        customLoanFeesConfigDetails
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
        customBranchDetails
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
        customLoanFeesConfigDetails
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
        customEmployeeDetails
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
        customPayrollDetails
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
        customEmployeeDetails
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
        customPayrollDetails
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
        customEmployeeDetails
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
        customPayrollDetails
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
        customEmployeeDetails
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
        customEmployeeDetails
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
        customEmployeeDetails
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        borrowerDocuments
        customFieldsData
        status
        groupID
        memberType
        customBorrowerDetails
        createdAt
        updatedAt
        branchBorrowersId
        borrowerShareAccountId
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        status
        isExistingMember
        memberID
        lockedSavingsAmount
        customGuarantorDetails
        createdAt
        updatedAt
        borrowerGuarantorsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        status
        isExistingMember
        memberID
        lockedSavingsAmount
        customGuarantorDetails
        createdAt
        updatedAt
        borrowerGuarantorsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        status
        isExistingMember
        memberID
        lockedSavingsAmount
        customGuarantorDetails
        createdAt
        updatedAt
        borrowerGuarantorsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        status
        isExistingMember
        memberID
        lockedSavingsAmount
        customGuarantorDetails
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
        customApplicationDetails
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
        status
        isExistingMember
        memberID
        lockedSavingsAmount
        customGuarantorDetails
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
        customApplicationDetails
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
        status
        isExistingMember
        memberID
        lockedSavingsAmount
        customGuarantorDetails
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
        customApplicationDetails
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
export const createGuarantorCollateral = /* GraphQL */ `
  mutation CreateGuarantorCollateral(
    $input: CreateGuarantorCollateralInput!
    $condition: ModelGuarantorCollateralConditionInput
  ) {
    createGuarantorCollateral(input: $input, condition: $condition) {
      id
      guarantorId
      collateralId
      guarantor {
        id
        name
        relationship
        phoneNumber
        email
        address
        customFieldsData
        status
        isExistingMember
        memberID
        lockedSavingsAmount
        customGuarantorDetails
        createdAt
        updatedAt
        borrowerGuarantorsId
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
        status
        customCollateralDetails
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
export const updateGuarantorCollateral = /* GraphQL */ `
  mutation UpdateGuarantorCollateral(
    $input: UpdateGuarantorCollateralInput!
    $condition: ModelGuarantorCollateralConditionInput
  ) {
    updateGuarantorCollateral(input: $input, condition: $condition) {
      id
      guarantorId
      collateralId
      guarantor {
        id
        name
        relationship
        phoneNumber
        email
        address
        customFieldsData
        status
        isExistingMember
        memberID
        lockedSavingsAmount
        customGuarantorDetails
        createdAt
        updatedAt
        borrowerGuarantorsId
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
        status
        customCollateralDetails
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
export const deleteGuarantorCollateral = /* GraphQL */ `
  mutation DeleteGuarantorCollateral(
    $input: DeleteGuarantorCollateralInput!
    $condition: ModelGuarantorCollateralConditionInput
  ) {
    deleteGuarantorCollateral(input: $input, condition: $condition) {
      id
      guarantorId
      collateralId
      guarantor {
        id
        name
        relationship
        phoneNumber
        email
        address
        customFieldsData
        status
        isExistingMember
        memberID
        lockedSavingsAmount
        customGuarantorDetails
        createdAt
        updatedAt
        borrowerGuarantorsId
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
        status
        customCollateralDetails
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
        status
        customLoanProductDetails
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
        status
        accountID
        customLoanFeesDetails
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
        status
        customLoanProductDetails
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
        status
        accountID
        customLoanFeesDetails
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
        status
        customLoanProductDetails
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
        status
        accountID
        customLoanFeesDetails
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
export const createLoanProductLoanFeesConfig = /* GraphQL */ `
  mutation CreateLoanProductLoanFeesConfig(
    $input: CreateLoanProductLoanFeesConfigInput!
    $condition: ModelLoanProductLoanFeesConfigConditionInput
  ) {
    createLoanProductLoanFeesConfig(input: $input, condition: $condition) {
      id
      loanProductId
      loanFeesConfigId
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
        status
        customLoanProductDetails
        createdAt
        updatedAt
        institutionLoanProductsId
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
        customLoanFeesConfigDetails
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
export const updateLoanProductLoanFeesConfig = /* GraphQL */ `
  mutation UpdateLoanProductLoanFeesConfig(
    $input: UpdateLoanProductLoanFeesConfigInput!
    $condition: ModelLoanProductLoanFeesConfigConditionInput
  ) {
    updateLoanProductLoanFeesConfig(input: $input, condition: $condition) {
      id
      loanProductId
      loanFeesConfigId
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
        status
        customLoanProductDetails
        createdAt
        updatedAt
        institutionLoanProductsId
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
        customLoanFeesConfigDetails
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
export const deleteLoanProductLoanFeesConfig = /* GraphQL */ `
  mutation DeleteLoanProductLoanFeesConfig(
    $input: DeleteLoanProductLoanFeesConfigInput!
    $condition: ModelLoanProductLoanFeesConfigConditionInput
  ) {
    deleteLoanProductLoanFeesConfig(input: $input, condition: $condition) {
      id
      loanProductId
      loanFeesConfigId
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
        status
        customLoanProductDetails
        createdAt
        updatedAt
        institutionLoanProductsId
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
        customLoanFeesConfigDetails
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
        status
        customLoanProductDetails
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
        status
        accountID
        customPenaltyDetails
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
        status
        customLoanProductDetails
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
        status
        accountID
        customPenaltyDetails
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
        status
        customLoanProductDetails
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
        status
        accountID
        customPenaltyDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        customApplicationDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        customApplicationDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        customApplicationDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        status
        customContractDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        status
        customContractDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        status
        customContractDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        customExpenseDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        customExpenseDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        customExpenseDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        paymentStatusEnum
        notes
        loanID
        moneyTransactionID
        accountID
        receivingEmployeeID
        amountAllocatedToPrincipal
        amountAllocatedToInterest
        amountAllocatedToFees
        amountAllocatedToPenalty
        customPaymentDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        paymentStatusEnum
        notes
        loanID
        moneyTransactionID
        accountID
        receivingEmployeeID
        amountAllocatedToPrincipal
        amountAllocatedToInterest
        amountAllocatedToFees
        amountAllocatedToPenalty
        customPaymentDetails
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
        status
        createdByEmployeeID
        customDocumentDetails
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
        paymentStatusEnum
        notes
        loanID
        moneyTransactionID
        accountID
        receivingEmployeeID
        amountAllocatedToPrincipal
        amountAllocatedToInterest
        amountAllocatedToFees
        amountAllocatedToPenalty
        customPaymentDetails
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
export const createMoneyTransactionDocument = /* GraphQL */ `
  mutation CreateMoneyTransactionDocument(
    $input: CreateMoneyTransactionDocumentInput!
    $condition: ModelMoneyTransactionDocumentConditionInput
  ) {
    createMoneyTransactionDocument(input: $input, condition: $condition) {
      id
      documentId
      moneyTransactionId
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
        status
        createdByEmployeeID
        customDocumentDetails
        createdAt
        updatedAt
        branchDocumentsId
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
        status
        loanID
        paymentID
        createdByEmployeeID
        customMoneyTransactionDetails
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
export const updateMoneyTransactionDocument = /* GraphQL */ `
  mutation UpdateMoneyTransactionDocument(
    $input: UpdateMoneyTransactionDocumentInput!
    $condition: ModelMoneyTransactionDocumentConditionInput
  ) {
    updateMoneyTransactionDocument(input: $input, condition: $condition) {
      id
      documentId
      moneyTransactionId
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
        status
        createdByEmployeeID
        customDocumentDetails
        createdAt
        updatedAt
        branchDocumentsId
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
        status
        loanID
        paymentID
        createdByEmployeeID
        customMoneyTransactionDetails
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
export const deleteMoneyTransactionDocument = /* GraphQL */ `
  mutation DeleteMoneyTransactionDocument(
    $input: DeleteMoneyTransactionDocumentInput!
    $condition: ModelMoneyTransactionDocumentConditionInput
  ) {
    deleteMoneyTransactionDocument(input: $input, condition: $condition) {
      id
      documentId
      moneyTransactionId
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
        status
        createdByEmployeeID
        customDocumentDetails
        createdAt
        updatedAt
        branchDocumentsId
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
        status
        loanID
        paymentID
        createdByEmployeeID
        customMoneyTransactionDetails
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
        status
        customContractDetails
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
        customApplicationDetails
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
        status
        customContractDetails
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
        customApplicationDetails
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
        status
        customContractDetails
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
        customApplicationDetails
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
        status
        customContractDetails
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
        status
        customCollateralDetails
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
        status
        customContractDetails
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
        status
        customCollateralDetails
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
        status
        customContractDetails
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
        status
        customCollateralDetails
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
        status
        customContractDetails
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        status
        customContractDetails
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        status
        customContractDetails
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        customApplicationDetails
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
        status
        customCollateralDetails
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
        customApplicationDetails
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
        status
        customCollateralDetails
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
        customApplicationDetails
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
        status
        customCollateralDetails
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
        customApplicationDetails
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
        customExpenseDetails
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
        customApplicationDetails
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
        customExpenseDetails
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
        customApplicationDetails
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
        customExpenseDetails
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
        customApplicationDetails
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        customApplicationDetails
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        customApplicationDetails
        createdAt
        updatedAt
        borrowerApplicationsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        status
        customCollateralDetails
        createdAt
        updatedAt
        borrowerCollateralsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        status
        customCollateralDetails
        createdAt
        updatedAt
        borrowerCollateralsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        status
        customCollateralDetails
        createdAt
        updatedAt
        borrowerCollateralsId
        __typename
      }
      loan {
        id
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
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
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
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
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
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
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
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
        customExpenseDetails
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
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
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
        customExpenseDetails
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
        loanNumber
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
        loanCurrency
        loanPurpose
        loanComputationRecord
        loanAttribute1
        loanAttribute2
        numberOfPayments
        paymentFrequency
        customFieldsData
        status
        borrowerID
        branchID
        loanProductID
        createdByEmployeeID
        groupID
        customLoanDetails
        createdAt
        updatedAt
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
        customExpenseDetails
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
        status
        customInvestmentDetails
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
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
        status
        customInvestmentDetails
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
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
        status
        customInvestmentDetails
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
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
        status
        accountID
        customLoanFeesDetails
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
        customLoanFeesConfigDetails
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
        status
        accountID
        customLoanFeesDetails
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
        customLoanFeesConfigDetails
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
        status
        accountID
        customLoanFeesDetails
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
        customLoanFeesConfigDetails
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      otherIncome {
        id
        name
        description
        amount
        incomeDate
        incomeType
        status
        customOtherIncomeDetails
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      otherIncome {
        id
        name
        description
        amount
        incomeDate
        incomeType
        status
        customOtherIncomeDetails
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
        status
        createdByEmployeeID
        customAccountDetails
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      otherIncome {
        id
        name
        description
        amount
        incomeDate
        incomeType
        status
        customOtherIncomeDetails
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
