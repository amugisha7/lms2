/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getInstitution = /* GraphQL */ `
  query GetInstitution($id: ID!) {
    getInstitution(id: $id) {
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listInstitutions = /* GraphQL */ `
  query ListInstitutions(
    $filter: ModelInstitutionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInstitutions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBranch = /* GraphQL */ `
  query GetBranch($id: ID!) {
    getBranch(id: $id) {
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
export const listBranches = /* GraphQL */ `
  query ListBranches(
    $filter: ModelBranchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBranches(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
      createdAt
      updatedAt
      institutionUsersId
      branchUsersId
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getEmployee = /* GraphQL */ `
  query GetEmployee($id: ID!) {
    getEmployee(id: $id) {
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
export const listEmployees = /* GraphQL */ `
  query ListEmployees(
    $filter: ModelEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEmployees(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getBorrower = /* GraphQL */ `
  query GetBorrower($id: ID!) {
    getBorrower(id: $id) {
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
export const listBorrowers = /* GraphQL */ `
  query ListBorrowers(
    $filter: ModelBorrowerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBorrowers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
        branchBorrowersId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getGuarantor = /* GraphQL */ `
  query GetGuarantor($id: ID!) {
    getGuarantor(id: $id) {
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
export const listGuarantors = /* GraphQL */ `
  query ListGuarantors(
    $filter: ModelGuarantorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGuarantors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        relationship
        phoneNumber
        email
        address
        customFieldsData
        status
        createdAt
        updatedAt
        borrowerGuarantorsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSecurity = /* GraphQL */ `
  query GetSecurity($id: ID!) {
    getSecurity(id: $id) {
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
export const listSecurities = /* GraphQL */ `
  query ListSecurities(
    $filter: ModelSecurityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSecurities(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        type
        description
        value
        status
        createdAt
        updatedAt
        borrowerSecuritiesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserNotification = /* GraphQL */ `
  query GetUserNotification($id: ID!) {
    getUserNotification(id: $id) {
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
export const listUserNotifications = /* GraphQL */ `
  query ListUserNotifications(
    $filter: ModelUserNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserNotifications(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        eventType
        name
        description
        reference
        message
        status
        createdAt
        updatedAt
        userUserNotificationsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanProduct = /* GraphQL */ `
  query GetLoanProduct($id: ID!) {
    getLoanProduct(id: $id) {
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
      createdAt
      updatedAt
      institutionLoanProductsId
      __typename
    }
  }
`;
export const listLoanProducts = /* GraphQL */ `
  query ListLoanProducts(
    $filter: ModelLoanProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
        institutionLoanProductsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCreditScore = /* GraphQL */ `
  query GetCreditScore($id: ID!) {
    getCreditScore(id: $id) {
      id
      name
      description
      score
      scoreDate
      scoreSource
      scoreStatus
      status
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
        borrowerDocuments
        customFieldsData
        status
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
export const listCreditScores = /* GraphQL */ `
  query ListCreditScores(
    $filter: ModelCreditScoreFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCreditScores(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        score
        scoreDate
        scoreSource
        scoreStatus
        status
        borrowerID
        createdByEmployeeID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDocument = /* GraphQL */ `
  query GetDocument($id: ID!) {
    getDocument(id: $id) {
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
export const listDocuments = /* GraphQL */ `
  query ListDocuments(
    $filter: ModelDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getContract = /* GraphQL */ `
  query GetContract($id: ID!) {
    getContract(id: $id) {
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
export const listContracts = /* GraphQL */ `
  query ListContracts(
    $filter: ModelContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContracts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        contractNumber
        contractType
        contractDate
        contractStatus
        contractRecord
        status
        createdAt
        updatedAt
        borrowerContractsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getApplication = /* GraphQL */ `
  query GetApplication($id: ID!) {
    getApplication(id: $id) {
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
        status
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
export const listApplications = /* GraphQL */ `
  query ListApplications(
    $filter: ModelApplicationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getCollateral = /* GraphQL */ `
  query GetCollateral($id: ID!) {
    getCollateral(id: $id) {
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
export const listCollaterals = /* GraphQL */ `
  query ListCollaterals(
    $filter: ModelCollateralFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCollaterals(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
        borrowerCollateralsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoan = /* GraphQL */ `
  query GetLoan($id: ID!) {
    getLoan(id: $id) {
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
        status
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
export const listLoans = /* GraphQL */ `
  query ListLoans(
    $filter: ModelLoanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoans(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        status
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getInvestment = /* GraphQL */ `
  query GetInvestment($id: ID!) {
    getInvestment(id: $id) {
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listInvestments = /* GraphQL */ `
  query ListInvestments(
    $filter: ModelInvestmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInvestments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanFees = /* GraphQL */ `
  query GetLoanFees($id: ID!) {
    getLoanFees(id: $id) {
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
        status
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
        status
        createdByEmployeeID
        createdAt
        updatedAt
        institutionAccountsId
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
export const listLoanFees = /* GraphQL */ `
  query ListLoanFees(
    $filter: ModelLoanFeesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanFees(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
        loanLoanFeesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPenalty = /* GraphQL */ `
  query GetPenalty($id: ID!) {
    getPenalty(id: $id) {
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
        status
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
        status
        createdByEmployeeID
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      createdAt
      updatedAt
      loanPenaltiesId
      __typename
    }
  }
`;
export const listPenalties = /* GraphQL */ `
  query ListPenalties(
    $filter: ModelPenaltyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPenalties(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
        loanPenaltiesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPayroll = /* GraphQL */ `
  query GetPayroll($id: ID!) {
    getPayroll(id: $id) {
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
export const listPayrolls = /* GraphQL */ `
  query ListPayrolls(
    $filter: ModelPayrollFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPayrolls(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getAccount = /* GraphQL */ `
  query GetAccount($id: ID!) {
    getAccount(id: $id) {
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
        createdAt
        updatedAt
        branchEmployeesId
        __typename
      }
      createdAt
      updatedAt
      institutionAccountsId
      __typename
    }
  }
`;
export const listAccounts = /* GraphQL */ `
  query ListAccounts(
    $filter: ModelAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getMoneyTransaction = /* GraphQL */ `
  query GetMoneyTransaction($id: ID!) {
    getMoneyTransaction(id: $id) {
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
        createdAt
        updatedAt
        institutionAccountsId
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
      accountMoneyTransactionsId
      __typename
    }
  }
`;
export const listMoneyTransactions = /* GraphQL */ `
  query ListMoneyTransactions(
    $filter: ModelMoneyTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMoneyTransactions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        createdByEmployeeID
        createdAt
        updatedAt
        accountMoneyTransactionsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPayment = /* GraphQL */ `
  query GetPayment($id: ID!) {
    getPayment(id: $id) {
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
        status
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
        status
        createdByEmployeeID
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
export const listPayments = /* GraphQL */ `
  query ListPayments(
    $filter: ModelPaymentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPayments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getExpense = /* GraphQL */ `
  query GetExpense($id: ID!) {
    getExpense(id: $id) {
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
export const listExpenses = /* GraphQL */ `
  query ListExpenses(
    $filter: ModelExpenseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listExpenses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getOtherIncome = /* GraphQL */ `
  query GetOtherIncome($id: ID!) {
    getOtherIncome(id: $id) {
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listOtherIncomes = /* GraphQL */ `
  query ListOtherIncomes(
    $filter: ModelOtherIncomeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOtherIncomes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        amount
        incomeDate
        incomeType
        status
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getFinancialReport = /* GraphQL */ `
  query GetFinancialReport($id: ID!) {
    getFinancialReport(id: $id) {
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
export const listFinancialReports = /* GraphQL */ `
  query ListFinancialReports(
    $filter: ModelFinancialReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFinancialReports(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        reportName
        reportType
        reportDate
        startDate
        endDate
        reportData
        status
        createdAt
        updatedAt
        branchFinancialReportsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCustomFormField = /* GraphQL */ `
  query GetCustomFormField($id: ID!) {
    getCustomFormField(id: $id) {
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
export const listCustomFormFields = /* GraphQL */ `
  query ListCustomFormFields(
    $filter: ModelCustomFormFieldFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCustomFormFields(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        formKey
        label
        fieldType
        options
        required
        order
        createdBy
        status
        createdAt
        updatedAt
        institutionCustomFormFieldsId
        branchCustomFormFieldsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanFeesConfig = /* GraphQL */ `
  query GetLoanFeesConfig($id: ID!) {
    getLoanFeesConfig(id: $id) {
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
      createdAt
      updatedAt
      institutionLoanFeesConfigsId
      __typename
    }
  }
`;
export const listLoanFeesConfigs = /* GraphQL */ `
  query ListLoanFeesConfigs(
    $filter: ModelLoanFeesConfigFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanFeesConfigs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
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
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      recipientUserId
      updatedAt
      __typename
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        subject
        body
        status
        createdAt
        senderUserId
        recipientUserId
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getNotification = /* GraphQL */ `
  query GetNotification($id: ID!) {
    getNotification(id: $id) {
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
        createdAt
        updatedAt
        institutionUsersId
        branchUsersId
        __typename
      }
      recipientUserId
      institutionMessagesId
      updatedAt
      __typename
    }
  }
`;
export const listNotifications = /* GraphQL */ `
  query ListNotifications(
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        subject
        body
        notificationType
        approvalStatus
        referenceId
        status
        createdAt
        senderUserId
        recipientUserId
        institutionMessagesId
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getAccountBranch = /* GraphQL */ `
  query GetAccountBranch($id: ID!) {
    getAccountBranch(id: $id) {
      id
      branchId
      accountId
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
export const listAccountBranches = /* GraphQL */ `
  query ListAccountBranches(
    $filter: ModelAccountBranchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAccountBranches(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        branchId
        accountId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBranchLoanProduct = /* GraphQL */ `
  query GetBranchLoanProduct($id: ID!) {
    getBranchLoanProduct(id: $id) {
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
        status
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
export const listBranchLoanProducts = /* GraphQL */ `
  query ListBranchLoanProducts(
    $filter: ModelBranchLoanProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBranchLoanProducts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        branchId
        loanProductId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBranchLoanFeesConfig = /* GraphQL */ `
  query GetBranchLoanFeesConfig($id: ID!) {
    getBranchLoanFeesConfig(id: $id) {
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
export const listBranchLoanFeesConfigs = /* GraphQL */ `
  query ListBranchLoanFeesConfigs(
    $filter: ModelBranchLoanFeesConfigFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBranchLoanFeesConfigs(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        branchId
        loanFeesConfigId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPayrollEmployee = /* GraphQL */ `
  query GetPayrollEmployee($id: ID!) {
    getPayrollEmployee(id: $id) {
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
export const listPayrollEmployees = /* GraphQL */ `
  query ListPayrollEmployees(
    $filter: ModelPayrollEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPayrollEmployees(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        payrollId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanApprovedByEmployee = /* GraphQL */ `
  query GetLoanApprovedByEmployee($id: ID!) {
    getLoanApprovedByEmployee(id: $id) {
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
        status
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
export const listLoanApprovedByEmployees = /* GraphQL */ `
  query ListLoanApprovedByEmployees(
    $filter: ModelLoanApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanApprovedByEmployees(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getExpenseApprovedByEmployee = /* GraphQL */ `
  query GetExpenseApprovedByEmployee($id: ID!) {
    getExpenseApprovedByEmployee(id: $id) {
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
export const listExpenseApprovedByEmployees = /* GraphQL */ `
  query ListExpenseApprovedByEmployees(
    $filter: ModelExpenseApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listExpenseApprovedByEmployees(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        expenseId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getApplicationApprovedByEmployee = /* GraphQL */ `
  query GetApplicationApprovedByEmployee($id: ID!) {
    getApplicationApprovedByEmployee(id: $id) {
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
export const listApplicationApprovedByEmployees = /* GraphQL */ `
  query ListApplicationApprovedByEmployees(
    $filter: ModelApplicationApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicationApprovedByEmployees(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        applicationId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCreditScoreApprovedByEmployee = /* GraphQL */ `
  query GetCreditScoreApprovedByEmployee($id: ID!) {
    getCreditScoreApprovedByEmployee(id: $id) {
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
        status
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
export const listCreditScoreApprovedByEmployees = /* GraphQL */ `
  query ListCreditScoreApprovedByEmployees(
    $filter: ModelCreditScoreApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCreditScoreApprovedByEmployees(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        creditScoreId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getMoneyTransactionApprovedByEmployee = /* GraphQL */ `
  query GetMoneyTransactionApprovedByEmployee($id: ID!) {
    getMoneyTransactionApprovedByEmployee(id: $id) {
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
        status
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
export const listMoneyTransactionApprovedByEmployees = /* GraphQL */ `
  query ListMoneyTransactionApprovedByEmployees(
    $filter: ModelMoneyTransactionApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMoneyTransactionApprovedByEmployees(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        moneyTransactionId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPaymentApprovedByEmployee = /* GraphQL */ `
  query GetPaymentApprovedByEmployee($id: ID!) {
    getPaymentApprovedByEmployee(id: $id) {
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
export const listPaymentApprovedByEmployees = /* GraphQL */ `
  query ListPaymentApprovedByEmployees(
    $filter: ModelPaymentApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPaymentApprovedByEmployees(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        paymentId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBorrowerLoanOfficer = /* GraphQL */ `
  query GetBorrowerLoanOfficer($id: ID!) {
    getBorrowerLoanOfficer(id: $id) {
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
        borrowerDocuments
        customFieldsData
        status
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
export const listBorrowerLoanOfficers = /* GraphQL */ `
  query ListBorrowerLoanOfficers(
    $filter: ModelBorrowerLoanOfficerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBorrowerLoanOfficers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        borrowerId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBorrowerDocument = /* GraphQL */ `
  query GetBorrowerDocument($id: ID!) {
    getBorrowerDocument(id: $id) {
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
        status
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
export const listBorrowerDocuments = /* GraphQL */ `
  query ListBorrowerDocuments(
    $filter: ModelBorrowerDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBorrowerDocuments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        borrowerId
        documentId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanGuarantor = /* GraphQL */ `
  query GetLoanGuarantor($id: ID!) {
    getLoanGuarantor(id: $id) {
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
        status
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
export const listLoanGuarantors = /* GraphQL */ `
  query ListLoanGuarantors(
    $filter: ModelLoanGuarantorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanGuarantors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        guarantorId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getApplicationGuarantor = /* GraphQL */ `
  query GetApplicationGuarantor($id: ID!) {
    getApplicationGuarantor(id: $id) {
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
export const listApplicationGuarantors = /* GraphQL */ `
  query ListApplicationGuarantors(
    $filter: ModelApplicationGuarantorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicationGuarantors(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        guarantorId
        applicationId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanProductLoanFees = /* GraphQL */ `
  query GetLoanProductLoanFees($id: ID!) {
    getLoanProductLoanFees(id: $id) {
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
export const listLoanProductLoanFees = /* GraphQL */ `
  query ListLoanProductLoanFees(
    $filter: ModelLoanProductLoanFeesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanProductLoanFees(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanProductId
        loanFeesId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanProductLoanFeesConfig = /* GraphQL */ `
  query GetLoanProductLoanFeesConfig($id: ID!) {
    getLoanProductLoanFeesConfig(id: $id) {
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
export const listLoanProductLoanFeesConfigs = /* GraphQL */ `
  query ListLoanProductLoanFeesConfigs(
    $filter: ModelLoanProductLoanFeesConfigFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanProductLoanFeesConfigs(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanProductId
        loanFeesConfigId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanProductPenalty = /* GraphQL */ `
  query GetLoanProductPenalty($id: ID!) {
    getLoanProductPenalty(id: $id) {
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
export const listLoanProductPenalties = /* GraphQL */ `
  query ListLoanProductPenalties(
    $filter: ModelLoanProductPenaltyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanProductPenalties(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanProductId
        penaltyId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanDocument = /* GraphQL */ `
  query GetLoanDocument($id: ID!) {
    getLoanDocument(id: $id) {
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
        status
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
export const listLoanDocuments = /* GraphQL */ `
  query ListLoanDocuments(
    $filter: ModelLoanDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        documentId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getApplicationDocument = /* GraphQL */ `
  query GetApplicationDocument($id: ID!) {
    getApplicationDocument(id: $id) {
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
export const listApplicationDocuments = /* GraphQL */ `
  query ListApplicationDocuments(
    $filter: ModelApplicationDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicationDocuments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        applicationId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getContractDocument = /* GraphQL */ `
  query GetContractDocument($id: ID!) {
    getContractDocument(id: $id) {
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
export const listContractDocuments = /* GraphQL */ `
  query ListContractDocuments(
    $filter: ModelContractDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContractDocuments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        contractId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getExpenseDocument = /* GraphQL */ `
  query GetExpenseDocument($id: ID!) {
    getExpenseDocument(id: $id) {
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
export const listExpenseDocuments = /* GraphQL */ `
  query ListExpenseDocuments(
    $filter: ModelExpenseDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listExpenseDocuments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        expenseId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPaymentDocument = /* GraphQL */ `
  query GetPaymentDocument($id: ID!) {
    getPaymentDocument(id: $id) {
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
export const listPaymentDocuments = /* GraphQL */ `
  query ListPaymentDocuments(
    $filter: ModelPaymentDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPaymentDocuments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        paymentId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getMoneyTransactionDocument = /* GraphQL */ `
  query GetMoneyTransactionDocument($id: ID!) {
    getMoneyTransactionDocument(id: $id) {
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
export const listMoneyTransactionDocuments = /* GraphQL */ `
  query ListMoneyTransactionDocuments(
    $filter: ModelMoneyTransactionDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMoneyTransactionDocuments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        moneyTransactionId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getApplicationContract = /* GraphQL */ `
  query GetApplicationContract($id: ID!) {
    getApplicationContract(id: $id) {
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
export const listApplicationContracts = /* GraphQL */ `
  query ListApplicationContracts(
    $filter: ModelApplicationContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicationContracts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        contractId
        applicationId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCollateralContract = /* GraphQL */ `
  query GetCollateralContract($id: ID!) {
    getCollateralContract(id: $id) {
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
export const listCollateralContracts = /* GraphQL */ `
  query ListCollateralContracts(
    $filter: ModelCollateralContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCollateralContracts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        contractId
        collateralId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanContract = /* GraphQL */ `
  query GetLoanContract($id: ID!) {
    getLoanContract(id: $id) {
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
        status
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
export const listLoanContracts = /* GraphQL */ `
  query ListLoanContracts(
    $filter: ModelLoanContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanContracts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        contractId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getApplicationCollateral = /* GraphQL */ `
  query GetApplicationCollateral($id: ID!) {
    getApplicationCollateral(id: $id) {
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
        status
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
export const listApplicationCollaterals = /* GraphQL */ `
  query ListApplicationCollaterals(
    $filter: ModelApplicationCollateralFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicationCollaterals(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationId
        collateralId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getApplicationExpense = /* GraphQL */ `
  query GetApplicationExpense($id: ID!) {
    getApplicationExpense(id: $id) {
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
export const listApplicationExpenses = /* GraphQL */ `
  query ListApplicationExpenses(
    $filter: ModelApplicationExpenseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicationExpenses(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationId
        expenseId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanApplication = /* GraphQL */ `
  query GetLoanApplication($id: ID!) {
    getLoanApplication(id: $id) {
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
        status
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
export const listLoanApplications = /* GraphQL */ `
  query ListLoanApplications(
    $filter: ModelLoanApplicationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanApplications(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanCollateral = /* GraphQL */ `
  query GetLoanCollateral($id: ID!) {
    getLoanCollateral(id: $id) {
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
        status
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
export const listLoanCollaterals = /* GraphQL */ `
  query ListLoanCollaterals(
    $filter: ModelLoanCollateralFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanCollaterals(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        collateralId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanAccount = /* GraphQL */ `
  query GetLoanAccount($id: ID!) {
    getLoanAccount(id: $id) {
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
        status
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
        status
        createdByEmployeeID
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
export const listLoanAccounts = /* GraphQL */ `
  query ListLoanAccounts(
    $filter: ModelLoanAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        loanId
        accountId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanExpense = /* GraphQL */ `
  query GetLoanExpense($id: ID!) {
    getLoanExpense(id: $id) {
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
        status
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
export const listLoanExpenses = /* GraphQL */ `
  query ListLoanExpenses(
    $filter: ModelLoanExpenseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanExpenses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        loanId
        expenseId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getInvestmentAccount = /* GraphQL */ `
  query GetInvestmentAccount($id: ID!) {
    getInvestmentAccount(id: $id) {
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
export const listInvestmentAccounts = /* GraphQL */ `
  query ListInvestmentAccounts(
    $filter: ModelInvestmentAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInvestmentAccounts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        investmentId
        accountId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLoanFeesLoanFeesConfig = /* GraphQL */ `
  query GetLoanFeesLoanFeesConfig($id: ID!) {
    getLoanFeesLoanFeesConfig(id: $id) {
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
export const listLoanFeesLoanFeesConfigs = /* GraphQL */ `
  query ListLoanFeesLoanFeesConfigs(
    $filter: ModelLoanFeesLoanFeesConfigFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoanFeesLoanFeesConfigs(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanFeesId
        loanFeesConfigId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getOtherIncomeAccount = /* GraphQL */ `
  query GetOtherIncomeAccount($id: ID!) {
    getOtherIncomeAccount(id: $id) {
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
export const listOtherIncomeAccounts = /* GraphQL */ `
  query ListOtherIncomeAccounts(
    $filter: ModelOtherIncomeAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOtherIncomeAccounts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        accountId
        otherIncomeId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const employeesByRelatedUserID = /* GraphQL */ `
  query EmployeesByRelatedUserID(
    $relatedUserID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    employeesByRelatedUserID(
      relatedUserID: $relatedUserID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const employeesByRelatedBorrowerID = /* GraphQL */ `
  query EmployeesByRelatedBorrowerID(
    $relatedBorrowerID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    employeesByRelatedBorrowerID(
      relatedBorrowerID: $relatedBorrowerID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const employeesBySupervisorID = /* GraphQL */ `
  query EmployeesBySupervisorID(
    $supervisorID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    employeesBySupervisorID(
      supervisorID: $supervisorID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const creditScoresByBorrowerID = /* GraphQL */ `
  query CreditScoresByBorrowerID(
    $borrowerID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCreditScoreFilterInput
    $limit: Int
    $nextToken: String
  ) {
    creditScoresByBorrowerID(
      borrowerID: $borrowerID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        description
        score
        scoreDate
        scoreSource
        scoreStatus
        status
        borrowerID
        createdByEmployeeID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const creditScoresByCreatedByEmployeeID = /* GraphQL */ `
  query CreditScoresByCreatedByEmployeeID(
    $createdByEmployeeID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCreditScoreFilterInput
    $limit: Int
    $nextToken: String
  ) {
    creditScoresByCreatedByEmployeeID(
      createdByEmployeeID: $createdByEmployeeID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        description
        score
        scoreDate
        scoreSource
        scoreStatus
        status
        borrowerID
        createdByEmployeeID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const documentsByCreatedByEmployeeID = /* GraphQL */ `
  query DocumentsByCreatedByEmployeeID(
    $createdByEmployeeID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    documentsByCreatedByEmployeeID(
      createdByEmployeeID: $createdByEmployeeID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        createdAt
        updatedAt
        branchDocumentsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const applicationsByLoanProductID = /* GraphQL */ `
  query ApplicationsByLoanProductID(
    $loanProductID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationsByLoanProductID(
      loanProductID: $loanProductID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const applicationsByCreatedByEmployeeID = /* GraphQL */ `
  query ApplicationsByCreatedByEmployeeID(
    $createdByEmployeeID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationsByCreatedByEmployeeID(
      createdByEmployeeID: $createdByEmployeeID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const loansByLoanProductID = /* GraphQL */ `
  query LoansByLoanProductID(
    $loanProductID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loansByLoanProductID(
      loanProductID: $loanProductID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        status
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loansByCreatedByEmployeeID = /* GraphQL */ `
  query LoansByCreatedByEmployeeID(
    $createdByEmployeeID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loansByCreatedByEmployeeID(
      createdByEmployeeID: $createdByEmployeeID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        status
        loanProductID
        createdByEmployeeID
        createdAt
        updatedAt
        borrowerLoansId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanFeesByAccountID = /* GraphQL */ `
  query LoanFeesByAccountID(
    $accountID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanFeesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanFeesByAccountID(
      accountID: $accountID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        createdAt
        updatedAt
        loanLoanFeesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const penaltiesByAccountID = /* GraphQL */ `
  query PenaltiesByAccountID(
    $accountID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPenaltyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    penaltiesByAccountID(
      accountID: $accountID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        createdAt
        updatedAt
        loanPenaltiesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const accountsByCreatedByEmployeeID = /* GraphQL */ `
  query AccountsByCreatedByEmployeeID(
    $createdByEmployeeID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    accountsByCreatedByEmployeeID(
      createdByEmployeeID: $createdByEmployeeID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        createdAt
        updatedAt
        institutionAccountsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const moneyTransactionsByCreatedByEmployeeID = /* GraphQL */ `
  query MoneyTransactionsByCreatedByEmployeeID(
    $createdByEmployeeID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMoneyTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    moneyTransactionsByCreatedByEmployeeID(
      createdByEmployeeID: $createdByEmployeeID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        createdByEmployeeID
        createdAt
        updatedAt
        accountMoneyTransactionsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const paymentsByAccountID = /* GraphQL */ `
  query PaymentsByAccountID(
    $accountID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPaymentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    paymentsByAccountID(
      accountID: $accountID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const paymentsByReceivingEmployeeID = /* GraphQL */ `
  query PaymentsByReceivingEmployeeID(
    $receivingEmployeeID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPaymentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    paymentsByReceivingEmployeeID(
      receivingEmployeeID: $receivingEmployeeID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const expensesByCreatedByEmployeeID = /* GraphQL */ `
  query ExpensesByCreatedByEmployeeID(
    $createdByEmployeeID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelExpenseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    expensesByCreatedByEmployeeID(
      createdByEmployeeID: $createdByEmployeeID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const messagesBySenderUserId = /* GraphQL */ `
  query MessagesBySenderUserId(
    $senderUserId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesBySenderUserId(
      senderUserId: $senderUserId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        subject
        body
        status
        createdAt
        senderUserId
        recipientUserId
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const messagesByRecipientUserId = /* GraphQL */ `
  query MessagesByRecipientUserId(
    $recipientUserId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByRecipientUserId(
      recipientUserId: $recipientUserId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        subject
        body
        status
        createdAt
        senderUserId
        recipientUserId
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const notificationsBySenderUserId = /* GraphQL */ `
  query NotificationsBySenderUserId(
    $senderUserId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    notificationsBySenderUserId(
      senderUserId: $senderUserId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        subject
        body
        notificationType
        approvalStatus
        referenceId
        status
        createdAt
        senderUserId
        recipientUserId
        institutionMessagesId
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const notificationsByRecipientUserId = /* GraphQL */ `
  query NotificationsByRecipientUserId(
    $recipientUserId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    notificationsByRecipientUserId(
      recipientUserId: $recipientUserId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        subject
        body
        notificationType
        approvalStatus
        referenceId
        status
        createdAt
        senderUserId
        recipientUserId
        institutionMessagesId
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const notificationsByInstitutionMessagesId = /* GraphQL */ `
  query NotificationsByInstitutionMessagesId(
    $institutionMessagesId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    notificationsByInstitutionMessagesId(
      institutionMessagesId: $institutionMessagesId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        subject
        body
        notificationType
        approvalStatus
        referenceId
        status
        createdAt
        senderUserId
        recipientUserId
        institutionMessagesId
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const accountBranchesByBranchId = /* GraphQL */ `
  query AccountBranchesByBranchId(
    $branchId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAccountBranchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    accountBranchesByBranchId(
      branchId: $branchId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        branchId
        accountId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const accountBranchesByAccountId = /* GraphQL */ `
  query AccountBranchesByAccountId(
    $accountId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAccountBranchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    accountBranchesByAccountId(
      accountId: $accountId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        branchId
        accountId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const branchLoanProductsByBranchId = /* GraphQL */ `
  query BranchLoanProductsByBranchId(
    $branchId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelBranchLoanProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    branchLoanProductsByBranchId(
      branchId: $branchId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        branchId
        loanProductId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const branchLoanProductsByLoanProductId = /* GraphQL */ `
  query BranchLoanProductsByLoanProductId(
    $loanProductId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelBranchLoanProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    branchLoanProductsByLoanProductId(
      loanProductId: $loanProductId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        branchId
        loanProductId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const branchLoanFeesConfigsByBranchId = /* GraphQL */ `
  query BranchLoanFeesConfigsByBranchId(
    $branchId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelBranchLoanFeesConfigFilterInput
    $limit: Int
    $nextToken: String
  ) {
    branchLoanFeesConfigsByBranchId(
      branchId: $branchId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        branchId
        loanFeesConfigId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const branchLoanFeesConfigsByLoanFeesConfigId = /* GraphQL */ `
  query BranchLoanFeesConfigsByLoanFeesConfigId(
    $loanFeesConfigId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelBranchLoanFeesConfigFilterInput
    $limit: Int
    $nextToken: String
  ) {
    branchLoanFeesConfigsByLoanFeesConfigId(
      loanFeesConfigId: $loanFeesConfigId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        branchId
        loanFeesConfigId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const payrollEmployeesByEmployeeId = /* GraphQL */ `
  query PayrollEmployeesByEmployeeId(
    $employeeId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPayrollEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    payrollEmployeesByEmployeeId(
      employeeId: $employeeId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        payrollId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const payrollEmployeesByPayrollId = /* GraphQL */ `
  query PayrollEmployeesByPayrollId(
    $payrollId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPayrollEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    payrollEmployeesByPayrollId(
      payrollId: $payrollId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        payrollId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanApprovedByEmployeesByEmployeeId = /* GraphQL */ `
  query LoanApprovedByEmployeesByEmployeeId(
    $employeeId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanApprovedByEmployeesByEmployeeId(
      employeeId: $employeeId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanApprovedByEmployeesByLoanId = /* GraphQL */ `
  query LoanApprovedByEmployeesByLoanId(
    $loanId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanApprovedByEmployeesByLoanId(
      loanId: $loanId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const expenseApprovedByEmployeesByEmployeeId = /* GraphQL */ `
  query ExpenseApprovedByEmployeesByEmployeeId(
    $employeeId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelExpenseApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    expenseApprovedByEmployeesByEmployeeId(
      employeeId: $employeeId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        expenseId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const expenseApprovedByEmployeesByExpenseId = /* GraphQL */ `
  query ExpenseApprovedByEmployeesByExpenseId(
    $expenseId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelExpenseApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    expenseApprovedByEmployeesByExpenseId(
      expenseId: $expenseId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        expenseId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const applicationApprovedByEmployeesByEmployeeId = /* GraphQL */ `
  query ApplicationApprovedByEmployeesByEmployeeId(
    $employeeId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationApprovedByEmployeesByEmployeeId(
      employeeId: $employeeId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        applicationId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const applicationApprovedByEmployeesByApplicationId = /* GraphQL */ `
  query ApplicationApprovedByEmployeesByApplicationId(
    $applicationId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationApprovedByEmployeesByApplicationId(
      applicationId: $applicationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        applicationId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const creditScoreApprovedByEmployeesByEmployeeId = /* GraphQL */ `
  query CreditScoreApprovedByEmployeesByEmployeeId(
    $employeeId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCreditScoreApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    creditScoreApprovedByEmployeesByEmployeeId(
      employeeId: $employeeId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        creditScoreId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const creditScoreApprovedByEmployeesByCreditScoreId = /* GraphQL */ `
  query CreditScoreApprovedByEmployeesByCreditScoreId(
    $creditScoreId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCreditScoreApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    creditScoreApprovedByEmployeesByCreditScoreId(
      creditScoreId: $creditScoreId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        creditScoreId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const moneyTransactionApprovedByEmployeesByEmployeeId = /* GraphQL */ `
  query MoneyTransactionApprovedByEmployeesByEmployeeId(
    $employeeId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMoneyTransactionApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    moneyTransactionApprovedByEmployeesByEmployeeId(
      employeeId: $employeeId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        moneyTransactionId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const moneyTransactionApprovedByEmployeesByMoneyTransactionId = /* GraphQL */ `
  query MoneyTransactionApprovedByEmployeesByMoneyTransactionId(
    $moneyTransactionId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMoneyTransactionApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    moneyTransactionApprovedByEmployeesByMoneyTransactionId(
      moneyTransactionId: $moneyTransactionId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        moneyTransactionId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const paymentApprovedByEmployeesByEmployeeId = /* GraphQL */ `
  query PaymentApprovedByEmployeesByEmployeeId(
    $employeeId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPaymentApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    paymentApprovedByEmployeesByEmployeeId(
      employeeId: $employeeId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        paymentId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const paymentApprovedByEmployeesByPaymentId = /* GraphQL */ `
  query PaymentApprovedByEmployeesByPaymentId(
    $paymentId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPaymentApprovedByEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    paymentApprovedByEmployeesByPaymentId(
      paymentId: $paymentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        paymentId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const borrowerLoanOfficersByEmployeeId = /* GraphQL */ `
  query BorrowerLoanOfficersByEmployeeId(
    $employeeId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelBorrowerLoanOfficerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    borrowerLoanOfficersByEmployeeId(
      employeeId: $employeeId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        borrowerId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const borrowerLoanOfficersByBorrowerId = /* GraphQL */ `
  query BorrowerLoanOfficersByBorrowerId(
    $borrowerId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelBorrowerLoanOfficerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    borrowerLoanOfficersByBorrowerId(
      borrowerId: $borrowerId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        borrowerId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const borrowerDocumentsByBorrowerId = /* GraphQL */ `
  query BorrowerDocumentsByBorrowerId(
    $borrowerId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelBorrowerDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    borrowerDocumentsByBorrowerId(
      borrowerId: $borrowerId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        borrowerId
        documentId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const borrowerDocumentsByDocumentId = /* GraphQL */ `
  query BorrowerDocumentsByDocumentId(
    $documentId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelBorrowerDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    borrowerDocumentsByDocumentId(
      documentId: $documentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        borrowerId
        documentId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanGuarantorsByGuarantorId = /* GraphQL */ `
  query LoanGuarantorsByGuarantorId(
    $guarantorId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanGuarantorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanGuarantorsByGuarantorId(
      guarantorId: $guarantorId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        guarantorId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanGuarantorsByLoanId = /* GraphQL */ `
  query LoanGuarantorsByLoanId(
    $loanId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanGuarantorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanGuarantorsByLoanId(
      loanId: $loanId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        guarantorId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const applicationGuarantorsByGuarantorId = /* GraphQL */ `
  query ApplicationGuarantorsByGuarantorId(
    $guarantorId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationGuarantorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationGuarantorsByGuarantorId(
      guarantorId: $guarantorId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        guarantorId
        applicationId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const applicationGuarantorsByApplicationId = /* GraphQL */ `
  query ApplicationGuarantorsByApplicationId(
    $applicationId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationGuarantorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationGuarantorsByApplicationId(
      applicationId: $applicationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        guarantorId
        applicationId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanProductLoanFeesByLoanProductId = /* GraphQL */ `
  query LoanProductLoanFeesByLoanProductId(
    $loanProductId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanProductLoanFeesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanProductLoanFeesByLoanProductId(
      loanProductId: $loanProductId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanProductId
        loanFeesId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanProductLoanFeesByLoanFeesId = /* GraphQL */ `
  query LoanProductLoanFeesByLoanFeesId(
    $loanFeesId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanProductLoanFeesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanProductLoanFeesByLoanFeesId(
      loanFeesId: $loanFeesId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanProductId
        loanFeesId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanProductLoanFeesConfigsByLoanProductId = /* GraphQL */ `
  query LoanProductLoanFeesConfigsByLoanProductId(
    $loanProductId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanProductLoanFeesConfigFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanProductLoanFeesConfigsByLoanProductId(
      loanProductId: $loanProductId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanProductId
        loanFeesConfigId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanProductLoanFeesConfigsByLoanFeesConfigId = /* GraphQL */ `
  query LoanProductLoanFeesConfigsByLoanFeesConfigId(
    $loanFeesConfigId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanProductLoanFeesConfigFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanProductLoanFeesConfigsByLoanFeesConfigId(
      loanFeesConfigId: $loanFeesConfigId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanProductId
        loanFeesConfigId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanProductPenaltiesByLoanProductId = /* GraphQL */ `
  query LoanProductPenaltiesByLoanProductId(
    $loanProductId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanProductPenaltyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanProductPenaltiesByLoanProductId(
      loanProductId: $loanProductId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanProductId
        penaltyId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanProductPenaltiesByPenaltyId = /* GraphQL */ `
  query LoanProductPenaltiesByPenaltyId(
    $penaltyId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanProductPenaltyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanProductPenaltiesByPenaltyId(
      penaltyId: $penaltyId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanProductId
        penaltyId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanDocumentsByDocumentId = /* GraphQL */ `
  query LoanDocumentsByDocumentId(
    $documentId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanDocumentsByDocumentId(
      documentId: $documentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanDocumentsByLoanId = /* GraphQL */ `
  query LoanDocumentsByLoanId(
    $loanId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanDocumentsByLoanId(
      loanId: $loanId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const applicationDocumentsByDocumentId = /* GraphQL */ `
  query ApplicationDocumentsByDocumentId(
    $documentId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationDocumentsByDocumentId(
      documentId: $documentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        applicationId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const applicationDocumentsByApplicationId = /* GraphQL */ `
  query ApplicationDocumentsByApplicationId(
    $applicationId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationDocumentsByApplicationId(
      applicationId: $applicationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        applicationId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const contractDocumentsByDocumentId = /* GraphQL */ `
  query ContractDocumentsByDocumentId(
    $documentId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelContractDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contractDocumentsByDocumentId(
      documentId: $documentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        contractId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const contractDocumentsByContractId = /* GraphQL */ `
  query ContractDocumentsByContractId(
    $contractId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelContractDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contractDocumentsByContractId(
      contractId: $contractId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        contractId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const expenseDocumentsByDocumentId = /* GraphQL */ `
  query ExpenseDocumentsByDocumentId(
    $documentId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelExpenseDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    expenseDocumentsByDocumentId(
      documentId: $documentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        expenseId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const expenseDocumentsByExpenseId = /* GraphQL */ `
  query ExpenseDocumentsByExpenseId(
    $expenseId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelExpenseDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    expenseDocumentsByExpenseId(
      expenseId: $expenseId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        expenseId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const paymentDocumentsByDocumentId = /* GraphQL */ `
  query PaymentDocumentsByDocumentId(
    $documentId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPaymentDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    paymentDocumentsByDocumentId(
      documentId: $documentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        paymentId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const paymentDocumentsByPaymentId = /* GraphQL */ `
  query PaymentDocumentsByPaymentId(
    $paymentId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPaymentDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    paymentDocumentsByPaymentId(
      paymentId: $paymentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        paymentId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const moneyTransactionDocumentsByDocumentId = /* GraphQL */ `
  query MoneyTransactionDocumentsByDocumentId(
    $documentId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMoneyTransactionDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    moneyTransactionDocumentsByDocumentId(
      documentId: $documentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        moneyTransactionId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const moneyTransactionDocumentsByMoneyTransactionId = /* GraphQL */ `
  query MoneyTransactionDocumentsByMoneyTransactionId(
    $moneyTransactionId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMoneyTransactionDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    moneyTransactionDocumentsByMoneyTransactionId(
      moneyTransactionId: $moneyTransactionId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        moneyTransactionId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const applicationContractsByContractId = /* GraphQL */ `
  query ApplicationContractsByContractId(
    $contractId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationContractsByContractId(
      contractId: $contractId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        contractId
        applicationId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const applicationContractsByApplicationId = /* GraphQL */ `
  query ApplicationContractsByApplicationId(
    $applicationId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationContractsByApplicationId(
      applicationId: $applicationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        contractId
        applicationId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const collateralContractsByContractId = /* GraphQL */ `
  query CollateralContractsByContractId(
    $contractId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCollateralContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    collateralContractsByContractId(
      contractId: $contractId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        contractId
        collateralId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const collateralContractsByCollateralId = /* GraphQL */ `
  query CollateralContractsByCollateralId(
    $collateralId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCollateralContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    collateralContractsByCollateralId(
      collateralId: $collateralId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        contractId
        collateralId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanContractsByContractId = /* GraphQL */ `
  query LoanContractsByContractId(
    $contractId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanContractsByContractId(
      contractId: $contractId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        contractId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanContractsByLoanId = /* GraphQL */ `
  query LoanContractsByLoanId(
    $loanId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanContractsByLoanId(
      loanId: $loanId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        contractId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const applicationCollateralsByApplicationId = /* GraphQL */ `
  query ApplicationCollateralsByApplicationId(
    $applicationId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationCollateralFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationCollateralsByApplicationId(
      applicationId: $applicationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationId
        collateralId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const applicationCollateralsByCollateralId = /* GraphQL */ `
  query ApplicationCollateralsByCollateralId(
    $collateralId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationCollateralFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationCollateralsByCollateralId(
      collateralId: $collateralId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationId
        collateralId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const applicationExpensesByApplicationId = /* GraphQL */ `
  query ApplicationExpensesByApplicationId(
    $applicationId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationExpenseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationExpensesByApplicationId(
      applicationId: $applicationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationId
        expenseId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const applicationExpensesByExpenseId = /* GraphQL */ `
  query ApplicationExpensesByExpenseId(
    $expenseId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationExpenseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationExpensesByExpenseId(
      expenseId: $expenseId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationId
        expenseId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanApplicationsByApplicationId = /* GraphQL */ `
  query LoanApplicationsByApplicationId(
    $applicationId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanApplicationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanApplicationsByApplicationId(
      applicationId: $applicationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanApplicationsByLoanId = /* GraphQL */ `
  query LoanApplicationsByLoanId(
    $loanId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanApplicationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanApplicationsByLoanId(
      loanId: $loanId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanCollateralsByCollateralId = /* GraphQL */ `
  query LoanCollateralsByCollateralId(
    $collateralId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanCollateralFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanCollateralsByCollateralId(
      collateralId: $collateralId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        collateralId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanCollateralsByLoanId = /* GraphQL */ `
  query LoanCollateralsByLoanId(
    $loanId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanCollateralFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanCollateralsByLoanId(
      loanId: $loanId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        collateralId
        loanId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanAccountsByLoanId = /* GraphQL */ `
  query LoanAccountsByLoanId(
    $loanId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanAccountsByLoanId(
      loanId: $loanId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanId
        accountId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanAccountsByAccountId = /* GraphQL */ `
  query LoanAccountsByAccountId(
    $accountId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanAccountsByAccountId(
      accountId: $accountId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanId
        accountId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanExpensesByLoanId = /* GraphQL */ `
  query LoanExpensesByLoanId(
    $loanId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanExpenseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanExpensesByLoanId(
      loanId: $loanId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanId
        expenseId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanExpensesByExpenseId = /* GraphQL */ `
  query LoanExpensesByExpenseId(
    $expenseId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanExpenseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanExpensesByExpenseId(
      expenseId: $expenseId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanId
        expenseId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const investmentAccountsByInvestmentId = /* GraphQL */ `
  query InvestmentAccountsByInvestmentId(
    $investmentId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelInvestmentAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    investmentAccountsByInvestmentId(
      investmentId: $investmentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        investmentId
        accountId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const investmentAccountsByAccountId = /* GraphQL */ `
  query InvestmentAccountsByAccountId(
    $accountId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelInvestmentAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    investmentAccountsByAccountId(
      accountId: $accountId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        investmentId
        accountId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanFeesLoanFeesConfigsByLoanFeesId = /* GraphQL */ `
  query LoanFeesLoanFeesConfigsByLoanFeesId(
    $loanFeesId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanFeesLoanFeesConfigFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanFeesLoanFeesConfigsByLoanFeesId(
      loanFeesId: $loanFeesId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanFeesId
        loanFeesConfigId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const loanFeesLoanFeesConfigsByLoanFeesConfigId = /* GraphQL */ `
  query LoanFeesLoanFeesConfigsByLoanFeesConfigId(
    $loanFeesConfigId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoanFeesLoanFeesConfigFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanFeesLoanFeesConfigsByLoanFeesConfigId(
      loanFeesConfigId: $loanFeesConfigId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanFeesId
        loanFeesConfigId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const otherIncomeAccountsByAccountId = /* GraphQL */ `
  query OtherIncomeAccountsByAccountId(
    $accountId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelOtherIncomeAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    otherIncomeAccountsByAccountId(
      accountId: $accountId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        accountId
        otherIncomeId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const otherIncomeAccountsByOtherIncomeId = /* GraphQL */ `
  query OtherIncomeAccountsByOtherIncomeId(
    $otherIncomeId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelOtherIncomeAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    otherIncomeAccountsByOtherIncomeId(
      otherIncomeId: $otherIncomeId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        accountId
        otherIncomeId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
