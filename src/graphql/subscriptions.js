/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateInstitution = /* GraphQL */ `
  subscription OnCreateInstitution(
    $filter: ModelSubscriptionInstitutionFilterInput
  ) {
    onCreateInstitution(filter: $filter) {
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
export const onUpdateInstitution = /* GraphQL */ `
  subscription OnUpdateInstitution(
    $filter: ModelSubscriptionInstitutionFilterInput
  ) {
    onUpdateInstitution(filter: $filter) {
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
export const onDeleteInstitution = /* GraphQL */ `
  subscription OnDeleteInstitution(
    $filter: ModelSubscriptionInstitutionFilterInput
  ) {
    onDeleteInstitution(filter: $filter) {
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
export const onCreateBranch = /* GraphQL */ `
  subscription OnCreateBranch($filter: ModelSubscriptionBranchFilterInput) {
    onCreateBranch(filter: $filter) {
      id
      name
      branchCode
      address
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
export const onUpdateBranch = /* GraphQL */ `
  subscription OnUpdateBranch($filter: ModelSubscriptionBranchFilterInput) {
    onUpdateBranch(filter: $filter) {
      id
      name
      branchCode
      address
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
export const onDeleteBranch = /* GraphQL */ `
  subscription OnDeleteBranch($filter: ModelSubscriptionBranchFilterInput) {
    onDeleteBranch(filter: $filter) {
      id
      name
      branchCode
      address
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreateEmployee = /* GraphQL */ `
  subscription OnCreateEmployee($filter: ModelSubscriptionEmployeeFilterInput) {
    onCreateEmployee(filter: $filter) {
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
export const onUpdateEmployee = /* GraphQL */ `
  subscription OnUpdateEmployee($filter: ModelSubscriptionEmployeeFilterInput) {
    onUpdateEmployee(filter: $filter) {
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
export const onDeleteEmployee = /* GraphQL */ `
  subscription OnDeleteEmployee($filter: ModelSubscriptionEmployeeFilterInput) {
    onDeleteEmployee(filter: $filter) {
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
export const onCreateBorrower = /* GraphQL */ `
  subscription OnCreateBorrower($filter: ModelSubscriptionBorrowerFilterInput) {
    onCreateBorrower(filter: $filter) {
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
export const onUpdateBorrower = /* GraphQL */ `
  subscription OnUpdateBorrower($filter: ModelSubscriptionBorrowerFilterInput) {
    onUpdateBorrower(filter: $filter) {
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
export const onDeleteBorrower = /* GraphQL */ `
  subscription OnDeleteBorrower($filter: ModelSubscriptionBorrowerFilterInput) {
    onDeleteBorrower(filter: $filter) {
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
export const onCreateGuarantor = /* GraphQL */ `
  subscription OnCreateGuarantor(
    $filter: ModelSubscriptionGuarantorFilterInput
  ) {
    onCreateGuarantor(filter: $filter) {
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
export const onUpdateGuarantor = /* GraphQL */ `
  subscription OnUpdateGuarantor(
    $filter: ModelSubscriptionGuarantorFilterInput
  ) {
    onUpdateGuarantor(filter: $filter) {
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
export const onDeleteGuarantor = /* GraphQL */ `
  subscription OnDeleteGuarantor(
    $filter: ModelSubscriptionGuarantorFilterInput
  ) {
    onDeleteGuarantor(filter: $filter) {
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
export const onCreateSecurity = /* GraphQL */ `
  subscription OnCreateSecurity($filter: ModelSubscriptionSecurityFilterInput) {
    onCreateSecurity(filter: $filter) {
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
export const onUpdateSecurity = /* GraphQL */ `
  subscription OnUpdateSecurity($filter: ModelSubscriptionSecurityFilterInput) {
    onUpdateSecurity(filter: $filter) {
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
export const onDeleteSecurity = /* GraphQL */ `
  subscription OnDeleteSecurity($filter: ModelSubscriptionSecurityFilterInput) {
    onDeleteSecurity(filter: $filter) {
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
export const onCreateUserNotification = /* GraphQL */ `
  subscription OnCreateUserNotification(
    $filter: ModelSubscriptionUserNotificationFilterInput
  ) {
    onCreateUserNotification(filter: $filter) {
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
export const onUpdateUserNotification = /* GraphQL */ `
  subscription OnUpdateUserNotification(
    $filter: ModelSubscriptionUserNotificationFilterInput
  ) {
    onUpdateUserNotification(filter: $filter) {
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
export const onDeleteUserNotification = /* GraphQL */ `
  subscription OnDeleteUserNotification(
    $filter: ModelSubscriptionUserNotificationFilterInput
  ) {
    onDeleteUserNotification(filter: $filter) {
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
export const onCreateLoanProduct = /* GraphQL */ `
  subscription OnCreateLoanProduct(
    $filter: ModelSubscriptionLoanProductFilterInput
  ) {
    onCreateLoanProduct(filter: $filter) {
      id
      name
      description
      interestRateMin
      interestRateMax
      termMonthsMin
      termMonthsMax
      principalAmountMin
      principalAmountMax
      interestCalculationMethod
      repaymentFrequencies
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
export const onUpdateLoanProduct = /* GraphQL */ `
  subscription OnUpdateLoanProduct(
    $filter: ModelSubscriptionLoanProductFilterInput
  ) {
    onUpdateLoanProduct(filter: $filter) {
      id
      name
      description
      interestRateMin
      interestRateMax
      termMonthsMin
      termMonthsMax
      principalAmountMin
      principalAmountMax
      interestCalculationMethod
      repaymentFrequencies
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
export const onDeleteLoanProduct = /* GraphQL */ `
  subscription OnDeleteLoanProduct(
    $filter: ModelSubscriptionLoanProductFilterInput
  ) {
    onDeleteLoanProduct(filter: $filter) {
      id
      name
      description
      interestRateMin
      interestRateMax
      termMonthsMin
      termMonthsMax
      principalAmountMin
      principalAmountMax
      interestCalculationMethod
      repaymentFrequencies
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
export const onCreateCreditScore = /* GraphQL */ `
  subscription OnCreateCreditScore(
    $filter: ModelSubscriptionCreditScoreFilterInput
  ) {
    onCreateCreditScore(filter: $filter) {
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
export const onUpdateCreditScore = /* GraphQL */ `
  subscription OnUpdateCreditScore(
    $filter: ModelSubscriptionCreditScoreFilterInput
  ) {
    onUpdateCreditScore(filter: $filter) {
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
export const onDeleteCreditScore = /* GraphQL */ `
  subscription OnDeleteCreditScore(
    $filter: ModelSubscriptionCreditScoreFilterInput
  ) {
    onDeleteCreditScore(filter: $filter) {
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
export const onCreateDocument = /* GraphQL */ `
  subscription OnCreateDocument($filter: ModelSubscriptionDocumentFilterInput) {
    onCreateDocument(filter: $filter) {
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
export const onUpdateDocument = /* GraphQL */ `
  subscription OnUpdateDocument($filter: ModelSubscriptionDocumentFilterInput) {
    onUpdateDocument(filter: $filter) {
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
export const onDeleteDocument = /* GraphQL */ `
  subscription OnDeleteDocument($filter: ModelSubscriptionDocumentFilterInput) {
    onDeleteDocument(filter: $filter) {
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
export const onCreateContract = /* GraphQL */ `
  subscription OnCreateContract($filter: ModelSubscriptionContractFilterInput) {
    onCreateContract(filter: $filter) {
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
export const onUpdateContract = /* GraphQL */ `
  subscription OnUpdateContract($filter: ModelSubscriptionContractFilterInput) {
    onUpdateContract(filter: $filter) {
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
export const onDeleteContract = /* GraphQL */ `
  subscription OnDeleteContract($filter: ModelSubscriptionContractFilterInput) {
    onDeleteContract(filter: $filter) {
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
export const onCreateApplication = /* GraphQL */ `
  subscription OnCreateApplication(
    $filter: ModelSubscriptionApplicationFilterInput
  ) {
    onCreateApplication(filter: $filter) {
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
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onUpdateApplication = /* GraphQL */ `
  subscription OnUpdateApplication(
    $filter: ModelSubscriptionApplicationFilterInput
  ) {
    onUpdateApplication(filter: $filter) {
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
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onDeleteApplication = /* GraphQL */ `
  subscription OnDeleteApplication(
    $filter: ModelSubscriptionApplicationFilterInput
  ) {
    onDeleteApplication(filter: $filter) {
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
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onCreateCollateral = /* GraphQL */ `
  subscription OnCreateCollateral(
    $filter: ModelSubscriptionCollateralFilterInput
  ) {
    onCreateCollateral(filter: $filter) {
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
export const onUpdateCollateral = /* GraphQL */ `
  subscription OnUpdateCollateral(
    $filter: ModelSubscriptionCollateralFilterInput
  ) {
    onUpdateCollateral(filter: $filter) {
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
export const onDeleteCollateral = /* GraphQL */ `
  subscription OnDeleteCollateral(
    $filter: ModelSubscriptionCollateralFilterInput
  ) {
    onDeleteCollateral(filter: $filter) {
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
export const onCreateLoan = /* GraphQL */ `
  subscription OnCreateLoan($filter: ModelSubscriptionLoanFilterInput) {
    onCreateLoan(filter: $filter) {
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
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onUpdateLoan = /* GraphQL */ `
  subscription OnUpdateLoan($filter: ModelSubscriptionLoanFilterInput) {
    onUpdateLoan(filter: $filter) {
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
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onDeleteLoan = /* GraphQL */ `
  subscription OnDeleteLoan($filter: ModelSubscriptionLoanFilterInput) {
    onDeleteLoan(filter: $filter) {
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
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onCreateInvestment = /* GraphQL */ `
  subscription OnCreateInvestment(
    $filter: ModelSubscriptionInvestmentFilterInput
  ) {
    onCreateInvestment(filter: $filter) {
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
export const onUpdateInvestment = /* GraphQL */ `
  subscription OnUpdateInvestment(
    $filter: ModelSubscriptionInvestmentFilterInput
  ) {
    onUpdateInvestment(filter: $filter) {
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
export const onDeleteInvestment = /* GraphQL */ `
  subscription OnDeleteInvestment(
    $filter: ModelSubscriptionInvestmentFilterInput
  ) {
    onDeleteInvestment(filter: $filter) {
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
export const onCreateLoanFees = /* GraphQL */ `
  subscription OnCreateLoanFees($filter: ModelSubscriptionLoanFeesFilterInput) {
    onCreateLoanFees(filter: $filter) {
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
export const onUpdateLoanFees = /* GraphQL */ `
  subscription OnUpdateLoanFees($filter: ModelSubscriptionLoanFeesFilterInput) {
    onUpdateLoanFees(filter: $filter) {
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
export const onDeleteLoanFees = /* GraphQL */ `
  subscription OnDeleteLoanFees($filter: ModelSubscriptionLoanFeesFilterInput) {
    onDeleteLoanFees(filter: $filter) {
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
export const onCreatePenalty = /* GraphQL */ `
  subscription OnCreatePenalty($filter: ModelSubscriptionPenaltyFilterInput) {
    onCreatePenalty(filter: $filter) {
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
export const onUpdatePenalty = /* GraphQL */ `
  subscription OnUpdatePenalty($filter: ModelSubscriptionPenaltyFilterInput) {
    onUpdatePenalty(filter: $filter) {
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
export const onDeletePenalty = /* GraphQL */ `
  subscription OnDeletePenalty($filter: ModelSubscriptionPenaltyFilterInput) {
    onDeletePenalty(filter: $filter) {
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
export const onCreatePayroll = /* GraphQL */ `
  subscription OnCreatePayroll($filter: ModelSubscriptionPayrollFilterInput) {
    onCreatePayroll(filter: $filter) {
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
export const onUpdatePayroll = /* GraphQL */ `
  subscription OnUpdatePayroll($filter: ModelSubscriptionPayrollFilterInput) {
    onUpdatePayroll(filter: $filter) {
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
export const onDeletePayroll = /* GraphQL */ `
  subscription OnDeletePayroll($filter: ModelSubscriptionPayrollFilterInput) {
    onDeletePayroll(filter: $filter) {
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
export const onCreateAccount = /* GraphQL */ `
  subscription OnCreateAccount($filter: ModelSubscriptionAccountFilterInput) {
    onCreateAccount(filter: $filter) {
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
export const onUpdateAccount = /* GraphQL */ `
  subscription OnUpdateAccount($filter: ModelSubscriptionAccountFilterInput) {
    onUpdateAccount(filter: $filter) {
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
export const onDeleteAccount = /* GraphQL */ `
  subscription OnDeleteAccount($filter: ModelSubscriptionAccountFilterInput) {
    onDeleteAccount(filter: $filter) {
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
export const onCreateMoneyTransaction = /* GraphQL */ `
  subscription OnCreateMoneyTransaction(
    $filter: ModelSubscriptionMoneyTransactionFilterInput
  ) {
    onCreateMoneyTransaction(filter: $filter) {
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
export const onUpdateMoneyTransaction = /* GraphQL */ `
  subscription OnUpdateMoneyTransaction(
    $filter: ModelSubscriptionMoneyTransactionFilterInput
  ) {
    onUpdateMoneyTransaction(filter: $filter) {
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
export const onDeleteMoneyTransaction = /* GraphQL */ `
  subscription OnDeleteMoneyTransaction(
    $filter: ModelSubscriptionMoneyTransactionFilterInput
  ) {
    onDeleteMoneyTransaction(filter: $filter) {
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
export const onCreatePayment = /* GraphQL */ `
  subscription OnCreatePayment($filter: ModelSubscriptionPaymentFilterInput) {
    onCreatePayment(filter: $filter) {
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
export const onUpdatePayment = /* GraphQL */ `
  subscription OnUpdatePayment($filter: ModelSubscriptionPaymentFilterInput) {
    onUpdatePayment(filter: $filter) {
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
export const onDeletePayment = /* GraphQL */ `
  subscription OnDeletePayment($filter: ModelSubscriptionPaymentFilterInput) {
    onDeletePayment(filter: $filter) {
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
export const onCreateExpense = /* GraphQL */ `
  subscription OnCreateExpense($filter: ModelSubscriptionExpenseFilterInput) {
    onCreateExpense(filter: $filter) {
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
export const onUpdateExpense = /* GraphQL */ `
  subscription OnUpdateExpense($filter: ModelSubscriptionExpenseFilterInput) {
    onUpdateExpense(filter: $filter) {
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
export const onDeleteExpense = /* GraphQL */ `
  subscription OnDeleteExpense($filter: ModelSubscriptionExpenseFilterInput) {
    onDeleteExpense(filter: $filter) {
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
export const onCreateOtherIncome = /* GraphQL */ `
  subscription OnCreateOtherIncome(
    $filter: ModelSubscriptionOtherIncomeFilterInput
  ) {
    onCreateOtherIncome(filter: $filter) {
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
export const onUpdateOtherIncome = /* GraphQL */ `
  subscription OnUpdateOtherIncome(
    $filter: ModelSubscriptionOtherIncomeFilterInput
  ) {
    onUpdateOtherIncome(filter: $filter) {
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
export const onDeleteOtherIncome = /* GraphQL */ `
  subscription OnDeleteOtherIncome(
    $filter: ModelSubscriptionOtherIncomeFilterInput
  ) {
    onDeleteOtherIncome(filter: $filter) {
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
export const onCreateFinancialReport = /* GraphQL */ `
  subscription OnCreateFinancialReport(
    $filter: ModelSubscriptionFinancialReportFilterInput
  ) {
    onCreateFinancialReport(filter: $filter) {
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
export const onUpdateFinancialReport = /* GraphQL */ `
  subscription OnUpdateFinancialReport(
    $filter: ModelSubscriptionFinancialReportFilterInput
  ) {
    onUpdateFinancialReport(filter: $filter) {
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
export const onDeleteFinancialReport = /* GraphQL */ `
  subscription OnDeleteFinancialReport(
    $filter: ModelSubscriptionFinancialReportFilterInput
  ) {
    onDeleteFinancialReport(filter: $filter) {
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
export const onCreateCustomFormField = /* GraphQL */ `
  subscription OnCreateCustomFormField(
    $filter: ModelSubscriptionCustomFormFieldFilterInput
  ) {
    onCreateCustomFormField(filter: $filter) {
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
export const onUpdateCustomFormField = /* GraphQL */ `
  subscription OnUpdateCustomFormField(
    $filter: ModelSubscriptionCustomFormFieldFilterInput
  ) {
    onUpdateCustomFormField(filter: $filter) {
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
export const onDeleteCustomFormField = /* GraphQL */ `
  subscription OnDeleteCustomFormField(
    $filter: ModelSubscriptionCustomFormFieldFilterInput
  ) {
    onDeleteCustomFormField(filter: $filter) {
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
export const onCreateLoanFeesConfig = /* GraphQL */ `
  subscription OnCreateLoanFeesConfig(
    $filter: ModelSubscriptionLoanFeesConfigFilterInput
  ) {
    onCreateLoanFeesConfig(filter: $filter) {
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
export const onUpdateLoanFeesConfig = /* GraphQL */ `
  subscription OnUpdateLoanFeesConfig(
    $filter: ModelSubscriptionLoanFeesConfigFilterInput
  ) {
    onUpdateLoanFeesConfig(filter: $filter) {
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
export const onDeleteLoanFeesConfig = /* GraphQL */ `
  subscription OnDeleteLoanFeesConfig(
    $filter: ModelSubscriptionLoanFeesConfigFilterInput
  ) {
    onDeleteLoanFeesConfig(filter: $filter) {
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
export const onCreateBranchLoanProduct = /* GraphQL */ `
  subscription OnCreateBranchLoanProduct(
    $filter: ModelSubscriptionBranchLoanProductFilterInput
  ) {
    onCreateBranchLoanProduct(filter: $filter) {
      id
      branchId
      loanProductId
      branch {
        id
        name
        branchCode
        address
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      loanProduct {
        id
        name
        description
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onUpdateBranchLoanProduct = /* GraphQL */ `
  subscription OnUpdateBranchLoanProduct(
    $filter: ModelSubscriptionBranchLoanProductFilterInput
  ) {
    onUpdateBranchLoanProduct(filter: $filter) {
      id
      branchId
      loanProductId
      branch {
        id
        name
        branchCode
        address
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      loanProduct {
        id
        name
        description
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onDeleteBranchLoanProduct = /* GraphQL */ `
  subscription OnDeleteBranchLoanProduct(
    $filter: ModelSubscriptionBranchLoanProductFilterInput
  ) {
    onDeleteBranchLoanProduct(filter: $filter) {
      id
      branchId
      loanProductId
      branch {
        id
        name
        branchCode
        address
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      loanProduct {
        id
        name
        description
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onCreateBranchLoanFeesConfig = /* GraphQL */ `
  subscription OnCreateBranchLoanFeesConfig(
    $filter: ModelSubscriptionBranchLoanFeesConfigFilterInput
  ) {
    onCreateBranchLoanFeesConfig(filter: $filter) {
      id
      branchId
      loanFeesConfigId
      branch {
        id
        name
        branchCode
        address
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
export const onUpdateBranchLoanFeesConfig = /* GraphQL */ `
  subscription OnUpdateBranchLoanFeesConfig(
    $filter: ModelSubscriptionBranchLoanFeesConfigFilterInput
  ) {
    onUpdateBranchLoanFeesConfig(filter: $filter) {
      id
      branchId
      loanFeesConfigId
      branch {
        id
        name
        branchCode
        address
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
export const onDeleteBranchLoanFeesConfig = /* GraphQL */ `
  subscription OnDeleteBranchLoanFeesConfig(
    $filter: ModelSubscriptionBranchLoanFeesConfigFilterInput
  ) {
    onDeleteBranchLoanFeesConfig(filter: $filter) {
      id
      branchId
      loanFeesConfigId
      branch {
        id
        name
        branchCode
        address
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
export const onCreatePayrollEmployee = /* GraphQL */ `
  subscription OnCreatePayrollEmployee(
    $filter: ModelSubscriptionPayrollEmployeeFilterInput
  ) {
    onCreatePayrollEmployee(filter: $filter) {
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
export const onUpdatePayrollEmployee = /* GraphQL */ `
  subscription OnUpdatePayrollEmployee(
    $filter: ModelSubscriptionPayrollEmployeeFilterInput
  ) {
    onUpdatePayrollEmployee(filter: $filter) {
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
export const onDeletePayrollEmployee = /* GraphQL */ `
  subscription OnDeletePayrollEmployee(
    $filter: ModelSubscriptionPayrollEmployeeFilterInput
  ) {
    onDeletePayrollEmployee(filter: $filter) {
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
export const onCreateLoanApprovedByEmployee = /* GraphQL */ `
  subscription OnCreateLoanApprovedByEmployee(
    $filter: ModelSubscriptionLoanApprovedByEmployeeFilterInput
  ) {
    onCreateLoanApprovedByEmployee(filter: $filter) {
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
export const onUpdateLoanApprovedByEmployee = /* GraphQL */ `
  subscription OnUpdateLoanApprovedByEmployee(
    $filter: ModelSubscriptionLoanApprovedByEmployeeFilterInput
  ) {
    onUpdateLoanApprovedByEmployee(filter: $filter) {
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
export const onDeleteLoanApprovedByEmployee = /* GraphQL */ `
  subscription OnDeleteLoanApprovedByEmployee(
    $filter: ModelSubscriptionLoanApprovedByEmployeeFilterInput
  ) {
    onDeleteLoanApprovedByEmployee(filter: $filter) {
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
export const onCreateExpenseApprovedByEmployee = /* GraphQL */ `
  subscription OnCreateExpenseApprovedByEmployee(
    $filter: ModelSubscriptionExpenseApprovedByEmployeeFilterInput
  ) {
    onCreateExpenseApprovedByEmployee(filter: $filter) {
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
export const onUpdateExpenseApprovedByEmployee = /* GraphQL */ `
  subscription OnUpdateExpenseApprovedByEmployee(
    $filter: ModelSubscriptionExpenseApprovedByEmployeeFilterInput
  ) {
    onUpdateExpenseApprovedByEmployee(filter: $filter) {
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
export const onDeleteExpenseApprovedByEmployee = /* GraphQL */ `
  subscription OnDeleteExpenseApprovedByEmployee(
    $filter: ModelSubscriptionExpenseApprovedByEmployeeFilterInput
  ) {
    onDeleteExpenseApprovedByEmployee(filter: $filter) {
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
export const onCreateApplicationApprovedByEmployee = /* GraphQL */ `
  subscription OnCreateApplicationApprovedByEmployee(
    $filter: ModelSubscriptionApplicationApprovedByEmployeeFilterInput
  ) {
    onCreateApplicationApprovedByEmployee(filter: $filter) {
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
export const onUpdateApplicationApprovedByEmployee = /* GraphQL */ `
  subscription OnUpdateApplicationApprovedByEmployee(
    $filter: ModelSubscriptionApplicationApprovedByEmployeeFilterInput
  ) {
    onUpdateApplicationApprovedByEmployee(filter: $filter) {
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
export const onDeleteApplicationApprovedByEmployee = /* GraphQL */ `
  subscription OnDeleteApplicationApprovedByEmployee(
    $filter: ModelSubscriptionApplicationApprovedByEmployeeFilterInput
  ) {
    onDeleteApplicationApprovedByEmployee(filter: $filter) {
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
export const onCreateCreditScoreApprovedByEmployee = /* GraphQL */ `
  subscription OnCreateCreditScoreApprovedByEmployee(
    $filter: ModelSubscriptionCreditScoreApprovedByEmployeeFilterInput
  ) {
    onCreateCreditScoreApprovedByEmployee(filter: $filter) {
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
export const onUpdateCreditScoreApprovedByEmployee = /* GraphQL */ `
  subscription OnUpdateCreditScoreApprovedByEmployee(
    $filter: ModelSubscriptionCreditScoreApprovedByEmployeeFilterInput
  ) {
    onUpdateCreditScoreApprovedByEmployee(filter: $filter) {
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
export const onDeleteCreditScoreApprovedByEmployee = /* GraphQL */ `
  subscription OnDeleteCreditScoreApprovedByEmployee(
    $filter: ModelSubscriptionCreditScoreApprovedByEmployeeFilterInput
  ) {
    onDeleteCreditScoreApprovedByEmployee(filter: $filter) {
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
export const onCreateMoneyTransactionApprovedByEmployee = /* GraphQL */ `
  subscription OnCreateMoneyTransactionApprovedByEmployee(
    $filter: ModelSubscriptionMoneyTransactionApprovedByEmployeeFilterInput
  ) {
    onCreateMoneyTransactionApprovedByEmployee(filter: $filter) {
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
export const onUpdateMoneyTransactionApprovedByEmployee = /* GraphQL */ `
  subscription OnUpdateMoneyTransactionApprovedByEmployee(
    $filter: ModelSubscriptionMoneyTransactionApprovedByEmployeeFilterInput
  ) {
    onUpdateMoneyTransactionApprovedByEmployee(filter: $filter) {
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
export const onDeleteMoneyTransactionApprovedByEmployee = /* GraphQL */ `
  subscription OnDeleteMoneyTransactionApprovedByEmployee(
    $filter: ModelSubscriptionMoneyTransactionApprovedByEmployeeFilterInput
  ) {
    onDeleteMoneyTransactionApprovedByEmployee(filter: $filter) {
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
export const onCreatePaymentApprovedByEmployee = /* GraphQL */ `
  subscription OnCreatePaymentApprovedByEmployee(
    $filter: ModelSubscriptionPaymentApprovedByEmployeeFilterInput
  ) {
    onCreatePaymentApprovedByEmployee(filter: $filter) {
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
export const onUpdatePaymentApprovedByEmployee = /* GraphQL */ `
  subscription OnUpdatePaymentApprovedByEmployee(
    $filter: ModelSubscriptionPaymentApprovedByEmployeeFilterInput
  ) {
    onUpdatePaymentApprovedByEmployee(filter: $filter) {
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
export const onDeletePaymentApprovedByEmployee = /* GraphQL */ `
  subscription OnDeletePaymentApprovedByEmployee(
    $filter: ModelSubscriptionPaymentApprovedByEmployeeFilterInput
  ) {
    onDeletePaymentApprovedByEmployee(filter: $filter) {
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
export const onCreateBorrowerLoanOfficer = /* GraphQL */ `
  subscription OnCreateBorrowerLoanOfficer(
    $filter: ModelSubscriptionBorrowerLoanOfficerFilterInput
  ) {
    onCreateBorrowerLoanOfficer(filter: $filter) {
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
export const onUpdateBorrowerLoanOfficer = /* GraphQL */ `
  subscription OnUpdateBorrowerLoanOfficer(
    $filter: ModelSubscriptionBorrowerLoanOfficerFilterInput
  ) {
    onUpdateBorrowerLoanOfficer(filter: $filter) {
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
export const onDeleteBorrowerLoanOfficer = /* GraphQL */ `
  subscription OnDeleteBorrowerLoanOfficer(
    $filter: ModelSubscriptionBorrowerLoanOfficerFilterInput
  ) {
    onDeleteBorrowerLoanOfficer(filter: $filter) {
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
export const onCreateBorrowerDocument = /* GraphQL */ `
  subscription OnCreateBorrowerDocument(
    $filter: ModelSubscriptionBorrowerDocumentFilterInput
  ) {
    onCreateBorrowerDocument(filter: $filter) {
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
export const onUpdateBorrowerDocument = /* GraphQL */ `
  subscription OnUpdateBorrowerDocument(
    $filter: ModelSubscriptionBorrowerDocumentFilterInput
  ) {
    onUpdateBorrowerDocument(filter: $filter) {
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
export const onDeleteBorrowerDocument = /* GraphQL */ `
  subscription OnDeleteBorrowerDocument(
    $filter: ModelSubscriptionBorrowerDocumentFilterInput
  ) {
    onDeleteBorrowerDocument(filter: $filter) {
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
export const onCreateLoanGuarantor = /* GraphQL */ `
  subscription OnCreateLoanGuarantor(
    $filter: ModelSubscriptionLoanGuarantorFilterInput
  ) {
    onCreateLoanGuarantor(filter: $filter) {
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
export const onUpdateLoanGuarantor = /* GraphQL */ `
  subscription OnUpdateLoanGuarantor(
    $filter: ModelSubscriptionLoanGuarantorFilterInput
  ) {
    onUpdateLoanGuarantor(filter: $filter) {
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
export const onDeleteLoanGuarantor = /* GraphQL */ `
  subscription OnDeleteLoanGuarantor(
    $filter: ModelSubscriptionLoanGuarantorFilterInput
  ) {
    onDeleteLoanGuarantor(filter: $filter) {
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
export const onCreateApplicationGuarantor = /* GraphQL */ `
  subscription OnCreateApplicationGuarantor(
    $filter: ModelSubscriptionApplicationGuarantorFilterInput
  ) {
    onCreateApplicationGuarantor(filter: $filter) {
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
export const onUpdateApplicationGuarantor = /* GraphQL */ `
  subscription OnUpdateApplicationGuarantor(
    $filter: ModelSubscriptionApplicationGuarantorFilterInput
  ) {
    onUpdateApplicationGuarantor(filter: $filter) {
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
export const onDeleteApplicationGuarantor = /* GraphQL */ `
  subscription OnDeleteApplicationGuarantor(
    $filter: ModelSubscriptionApplicationGuarantorFilterInput
  ) {
    onDeleteApplicationGuarantor(filter: $filter) {
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
export const onCreateLoanProductLoanFees = /* GraphQL */ `
  subscription OnCreateLoanProductLoanFees(
    $filter: ModelSubscriptionLoanProductLoanFeesFilterInput
  ) {
    onCreateLoanProductLoanFees(filter: $filter) {
      id
      loanProductId
      loanFeesId
      loanProduct {
        id
        name
        description
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onUpdateLoanProductLoanFees = /* GraphQL */ `
  subscription OnUpdateLoanProductLoanFees(
    $filter: ModelSubscriptionLoanProductLoanFeesFilterInput
  ) {
    onUpdateLoanProductLoanFees(filter: $filter) {
      id
      loanProductId
      loanFeesId
      loanProduct {
        id
        name
        description
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onDeleteLoanProductLoanFees = /* GraphQL */ `
  subscription OnDeleteLoanProductLoanFees(
    $filter: ModelSubscriptionLoanProductLoanFeesFilterInput
  ) {
    onDeleteLoanProductLoanFees(filter: $filter) {
      id
      loanProductId
      loanFeesId
      loanProduct {
        id
        name
        description
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onCreateLoanProductPenalty = /* GraphQL */ `
  subscription OnCreateLoanProductPenalty(
    $filter: ModelSubscriptionLoanProductPenaltyFilterInput
  ) {
    onCreateLoanProductPenalty(filter: $filter) {
      id
      loanProductId
      penaltyId
      loanProduct {
        id
        name
        description
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onUpdateLoanProductPenalty = /* GraphQL */ `
  subscription OnUpdateLoanProductPenalty(
    $filter: ModelSubscriptionLoanProductPenaltyFilterInput
  ) {
    onUpdateLoanProductPenalty(filter: $filter) {
      id
      loanProductId
      penaltyId
      loanProduct {
        id
        name
        description
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onDeleteLoanProductPenalty = /* GraphQL */ `
  subscription OnDeleteLoanProductPenalty(
    $filter: ModelSubscriptionLoanProductPenaltyFilterInput
  ) {
    onDeleteLoanProductPenalty(filter: $filter) {
      id
      loanProductId
      penaltyId
      loanProduct {
        id
        name
        description
        interestRateMin
        interestRateMax
        termMonthsMin
        termMonthsMax
        principalAmountMin
        principalAmountMax
        interestCalculationMethod
        repaymentFrequencies
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
export const onCreateLoanDocument = /* GraphQL */ `
  subscription OnCreateLoanDocument(
    $filter: ModelSubscriptionLoanDocumentFilterInput
  ) {
    onCreateLoanDocument(filter: $filter) {
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
export const onUpdateLoanDocument = /* GraphQL */ `
  subscription OnUpdateLoanDocument(
    $filter: ModelSubscriptionLoanDocumentFilterInput
  ) {
    onUpdateLoanDocument(filter: $filter) {
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
export const onDeleteLoanDocument = /* GraphQL */ `
  subscription OnDeleteLoanDocument(
    $filter: ModelSubscriptionLoanDocumentFilterInput
  ) {
    onDeleteLoanDocument(filter: $filter) {
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
export const onCreateApplicationDocument = /* GraphQL */ `
  subscription OnCreateApplicationDocument(
    $filter: ModelSubscriptionApplicationDocumentFilterInput
  ) {
    onCreateApplicationDocument(filter: $filter) {
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
export const onUpdateApplicationDocument = /* GraphQL */ `
  subscription OnUpdateApplicationDocument(
    $filter: ModelSubscriptionApplicationDocumentFilterInput
  ) {
    onUpdateApplicationDocument(filter: $filter) {
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
export const onDeleteApplicationDocument = /* GraphQL */ `
  subscription OnDeleteApplicationDocument(
    $filter: ModelSubscriptionApplicationDocumentFilterInput
  ) {
    onDeleteApplicationDocument(filter: $filter) {
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
export const onCreateContractDocument = /* GraphQL */ `
  subscription OnCreateContractDocument(
    $filter: ModelSubscriptionContractDocumentFilterInput
  ) {
    onCreateContractDocument(filter: $filter) {
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
export const onUpdateContractDocument = /* GraphQL */ `
  subscription OnUpdateContractDocument(
    $filter: ModelSubscriptionContractDocumentFilterInput
  ) {
    onUpdateContractDocument(filter: $filter) {
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
export const onDeleteContractDocument = /* GraphQL */ `
  subscription OnDeleteContractDocument(
    $filter: ModelSubscriptionContractDocumentFilterInput
  ) {
    onDeleteContractDocument(filter: $filter) {
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
export const onCreateExpenseDocument = /* GraphQL */ `
  subscription OnCreateExpenseDocument(
    $filter: ModelSubscriptionExpenseDocumentFilterInput
  ) {
    onCreateExpenseDocument(filter: $filter) {
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
export const onUpdateExpenseDocument = /* GraphQL */ `
  subscription OnUpdateExpenseDocument(
    $filter: ModelSubscriptionExpenseDocumentFilterInput
  ) {
    onUpdateExpenseDocument(filter: $filter) {
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
export const onDeleteExpenseDocument = /* GraphQL */ `
  subscription OnDeleteExpenseDocument(
    $filter: ModelSubscriptionExpenseDocumentFilterInput
  ) {
    onDeleteExpenseDocument(filter: $filter) {
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
export const onCreatePaymentDocument = /* GraphQL */ `
  subscription OnCreatePaymentDocument(
    $filter: ModelSubscriptionPaymentDocumentFilterInput
  ) {
    onCreatePaymentDocument(filter: $filter) {
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
export const onUpdatePaymentDocument = /* GraphQL */ `
  subscription OnUpdatePaymentDocument(
    $filter: ModelSubscriptionPaymentDocumentFilterInput
  ) {
    onUpdatePaymentDocument(filter: $filter) {
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
export const onDeletePaymentDocument = /* GraphQL */ `
  subscription OnDeletePaymentDocument(
    $filter: ModelSubscriptionPaymentDocumentFilterInput
  ) {
    onDeletePaymentDocument(filter: $filter) {
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
export const onCreateApplicationContract = /* GraphQL */ `
  subscription OnCreateApplicationContract(
    $filter: ModelSubscriptionApplicationContractFilterInput
  ) {
    onCreateApplicationContract(filter: $filter) {
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
export const onUpdateApplicationContract = /* GraphQL */ `
  subscription OnUpdateApplicationContract(
    $filter: ModelSubscriptionApplicationContractFilterInput
  ) {
    onUpdateApplicationContract(filter: $filter) {
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
export const onDeleteApplicationContract = /* GraphQL */ `
  subscription OnDeleteApplicationContract(
    $filter: ModelSubscriptionApplicationContractFilterInput
  ) {
    onDeleteApplicationContract(filter: $filter) {
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
export const onCreateCollateralContract = /* GraphQL */ `
  subscription OnCreateCollateralContract(
    $filter: ModelSubscriptionCollateralContractFilterInput
  ) {
    onCreateCollateralContract(filter: $filter) {
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
export const onUpdateCollateralContract = /* GraphQL */ `
  subscription OnUpdateCollateralContract(
    $filter: ModelSubscriptionCollateralContractFilterInput
  ) {
    onUpdateCollateralContract(filter: $filter) {
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
export const onDeleteCollateralContract = /* GraphQL */ `
  subscription OnDeleteCollateralContract(
    $filter: ModelSubscriptionCollateralContractFilterInput
  ) {
    onDeleteCollateralContract(filter: $filter) {
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
export const onCreateLoanContract = /* GraphQL */ `
  subscription OnCreateLoanContract(
    $filter: ModelSubscriptionLoanContractFilterInput
  ) {
    onCreateLoanContract(filter: $filter) {
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
export const onUpdateLoanContract = /* GraphQL */ `
  subscription OnUpdateLoanContract(
    $filter: ModelSubscriptionLoanContractFilterInput
  ) {
    onUpdateLoanContract(filter: $filter) {
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
export const onDeleteLoanContract = /* GraphQL */ `
  subscription OnDeleteLoanContract(
    $filter: ModelSubscriptionLoanContractFilterInput
  ) {
    onDeleteLoanContract(filter: $filter) {
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
export const onCreateApplicationCollateral = /* GraphQL */ `
  subscription OnCreateApplicationCollateral(
    $filter: ModelSubscriptionApplicationCollateralFilterInput
  ) {
    onCreateApplicationCollateral(filter: $filter) {
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
export const onUpdateApplicationCollateral = /* GraphQL */ `
  subscription OnUpdateApplicationCollateral(
    $filter: ModelSubscriptionApplicationCollateralFilterInput
  ) {
    onUpdateApplicationCollateral(filter: $filter) {
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
export const onDeleteApplicationCollateral = /* GraphQL */ `
  subscription OnDeleteApplicationCollateral(
    $filter: ModelSubscriptionApplicationCollateralFilterInput
  ) {
    onDeleteApplicationCollateral(filter: $filter) {
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
export const onCreateApplicationExpense = /* GraphQL */ `
  subscription OnCreateApplicationExpense(
    $filter: ModelSubscriptionApplicationExpenseFilterInput
  ) {
    onCreateApplicationExpense(filter: $filter) {
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
export const onUpdateApplicationExpense = /* GraphQL */ `
  subscription OnUpdateApplicationExpense(
    $filter: ModelSubscriptionApplicationExpenseFilterInput
  ) {
    onUpdateApplicationExpense(filter: $filter) {
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
export const onDeleteApplicationExpense = /* GraphQL */ `
  subscription OnDeleteApplicationExpense(
    $filter: ModelSubscriptionApplicationExpenseFilterInput
  ) {
    onDeleteApplicationExpense(filter: $filter) {
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
export const onCreateLoanApplication = /* GraphQL */ `
  subscription OnCreateLoanApplication(
    $filter: ModelSubscriptionLoanApplicationFilterInput
  ) {
    onCreateLoanApplication(filter: $filter) {
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
export const onUpdateLoanApplication = /* GraphQL */ `
  subscription OnUpdateLoanApplication(
    $filter: ModelSubscriptionLoanApplicationFilterInput
  ) {
    onUpdateLoanApplication(filter: $filter) {
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
export const onDeleteLoanApplication = /* GraphQL */ `
  subscription OnDeleteLoanApplication(
    $filter: ModelSubscriptionLoanApplicationFilterInput
  ) {
    onDeleteLoanApplication(filter: $filter) {
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
export const onCreateLoanCollateral = /* GraphQL */ `
  subscription OnCreateLoanCollateral(
    $filter: ModelSubscriptionLoanCollateralFilterInput
  ) {
    onCreateLoanCollateral(filter: $filter) {
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
export const onUpdateLoanCollateral = /* GraphQL */ `
  subscription OnUpdateLoanCollateral(
    $filter: ModelSubscriptionLoanCollateralFilterInput
  ) {
    onUpdateLoanCollateral(filter: $filter) {
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
export const onDeleteLoanCollateral = /* GraphQL */ `
  subscription OnDeleteLoanCollateral(
    $filter: ModelSubscriptionLoanCollateralFilterInput
  ) {
    onDeleteLoanCollateral(filter: $filter) {
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
export const onCreateLoanAccount = /* GraphQL */ `
  subscription OnCreateLoanAccount(
    $filter: ModelSubscriptionLoanAccountFilterInput
  ) {
    onCreateLoanAccount(filter: $filter) {
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
export const onUpdateLoanAccount = /* GraphQL */ `
  subscription OnUpdateLoanAccount(
    $filter: ModelSubscriptionLoanAccountFilterInput
  ) {
    onUpdateLoanAccount(filter: $filter) {
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
export const onDeleteLoanAccount = /* GraphQL */ `
  subscription OnDeleteLoanAccount(
    $filter: ModelSubscriptionLoanAccountFilterInput
  ) {
    onDeleteLoanAccount(filter: $filter) {
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
export const onCreateLoanExpense = /* GraphQL */ `
  subscription OnCreateLoanExpense(
    $filter: ModelSubscriptionLoanExpenseFilterInput
  ) {
    onCreateLoanExpense(filter: $filter) {
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
export const onUpdateLoanExpense = /* GraphQL */ `
  subscription OnUpdateLoanExpense(
    $filter: ModelSubscriptionLoanExpenseFilterInput
  ) {
    onUpdateLoanExpense(filter: $filter) {
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
export const onDeleteLoanExpense = /* GraphQL */ `
  subscription OnDeleteLoanExpense(
    $filter: ModelSubscriptionLoanExpenseFilterInput
  ) {
    onDeleteLoanExpense(filter: $filter) {
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
export const onCreateInvestmentAccount = /* GraphQL */ `
  subscription OnCreateInvestmentAccount(
    $filter: ModelSubscriptionInvestmentAccountFilterInput
  ) {
    onCreateInvestmentAccount(filter: $filter) {
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
export const onUpdateInvestmentAccount = /* GraphQL */ `
  subscription OnUpdateInvestmentAccount(
    $filter: ModelSubscriptionInvestmentAccountFilterInput
  ) {
    onUpdateInvestmentAccount(filter: $filter) {
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
export const onDeleteInvestmentAccount = /* GraphQL */ `
  subscription OnDeleteInvestmentAccount(
    $filter: ModelSubscriptionInvestmentAccountFilterInput
  ) {
    onDeleteInvestmentAccount(filter: $filter) {
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
export const onCreateLoanFeesLoanFeesConfig = /* GraphQL */ `
  subscription OnCreateLoanFeesLoanFeesConfig(
    $filter: ModelSubscriptionLoanFeesLoanFeesConfigFilterInput
  ) {
    onCreateLoanFeesLoanFeesConfig(filter: $filter) {
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
export const onUpdateLoanFeesLoanFeesConfig = /* GraphQL */ `
  subscription OnUpdateLoanFeesLoanFeesConfig(
    $filter: ModelSubscriptionLoanFeesLoanFeesConfigFilterInput
  ) {
    onUpdateLoanFeesLoanFeesConfig(filter: $filter) {
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
export const onDeleteLoanFeesLoanFeesConfig = /* GraphQL */ `
  subscription OnDeleteLoanFeesLoanFeesConfig(
    $filter: ModelSubscriptionLoanFeesLoanFeesConfigFilterInput
  ) {
    onDeleteLoanFeesLoanFeesConfig(filter: $filter) {
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
export const onCreateOtherIncomeAccount = /* GraphQL */ `
  subscription OnCreateOtherIncomeAccount(
    $filter: ModelSubscriptionOtherIncomeAccountFilterInput
  ) {
    onCreateOtherIncomeAccount(filter: $filter) {
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
export const onUpdateOtherIncomeAccount = /* GraphQL */ `
  subscription OnUpdateOtherIncomeAccount(
    $filter: ModelSubscriptionOtherIncomeAccountFilterInput
  ) {
    onUpdateOtherIncomeAccount(filter: $filter) {
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
export const onDeleteOtherIncomeAccount = /* GraphQL */ `
  subscription OnDeleteOtherIncomeAccount(
    $filter: ModelSubscriptionOtherIncomeAccountFilterInput
  ) {
    onDeleteOtherIncomeAccount(filter: $filter) {
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
