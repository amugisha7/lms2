export const schema = {
    "models": {
        "Institution": {
            "name": "Institution",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "currencyCode": {
                    "name": "currencyCode",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "subscriptionTier": {
                    "name": "subscriptionTier",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "subscriptionStatus": {
                    "name": "subscriptionStatus",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "trialEndDate": {
                    "name": "trialEndDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "nextBillingDate": {
                    "name": "nextBillingDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "stripeCustomerID": {
                    "name": "stripeCustomerID",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "stripeSubscriptionID": {
                    "name": "stripeSubscriptionID",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "defaultDateFormat": {
                    "name": "defaultDateFormat",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "defaultCurrencyFormat": {
                    "name": "defaultCurrencyFormat",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "defaultLanguage": {
                    "name": "defaultLanguage",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "regulatoryRegion": {
                    "name": "regulatoryRegion",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "maxUsers": {
                    "name": "maxUsers",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "maxBranches": {
                    "name": "maxBranches",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "maxStaffPerBranch": {
                    "name": "maxStaffPerBranch",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "saccoFeaturesEnabled": {
                    "name": "saccoFeaturesEnabled",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": true,
                    "attributes": []
                },
                "staffManagementEnabled": {
                    "name": "staffManagementEnabled",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": true,
                    "attributes": []
                },
                "payrollEnabled": {
                    "name": "payrollEnabled",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": true,
                    "attributes": []
                },
                "collectionsModuleEnabled": {
                    "name": "collectionsModuleEnabled",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": true,
                    "attributes": []
                },
                "customWorkflowsEnabled": {
                    "name": "customWorkflowsEnabled",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": true,
                    "attributes": []
                },
                "advancedReportingEnabled": {
                    "name": "advancedReportingEnabled",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": true,
                    "attributes": []
                },
                "apiIntegrationSettings": {
                    "name": "apiIntegrationSettings",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "users": {
                    "name": "users",
                    "isArray": true,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "institutionUsersId"
                        ]
                    }
                },
                "branches": {
                    "name": "branches",
                    "isArray": true,
                    "type": {
                        "model": "Branch"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "institutionBranchesId"
                        ]
                    }
                },
                "loanProducts": {
                    "name": "loanProducts",
                    "isArray": true,
                    "type": {
                        "model": "LoanProduct"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "institutionLoanProductsId"
                        ]
                    }
                },
                "customFormFields": {
                    "name": "customFormFields",
                    "isArray": true,
                    "type": {
                        "model": "CustomFormField"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "institutionCustomFormFieldsId"
                        ]
                    }
                },
                "loanFeesConfigs": {
                    "name": "loanFeesConfigs",
                    "isArray": true,
                    "type": {
                        "model": "LoanFeesConfig"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "institutionLoanFeesConfigsId"
                        ]
                    }
                },
                "accounts": {
                    "name": "accounts",
                    "isArray": true,
                    "type": {
                        "model": "Account"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "institutionAccountsId"
                        ]
                    }
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "savingsProducts": {
                    "name": "savingsProducts",
                    "isArray": true,
                    "type": {
                        "model": "SavingsProduct"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "institutionSavingsProductsId"
                        ]
                    }
                },
                "chartOfAccounts": {
                    "name": "chartOfAccounts",
                    "isArray": true,
                    "type": {
                        "model": "ChartOfAccounts"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "institutionChartOfAccountsId"
                        ]
                    }
                },
                "dividendDeclarations": {
                    "name": "dividendDeclarations",
                    "isArray": true,
                    "type": {
                        "model": "DividendDeclaration"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "institutionDividendDeclarationsId"
                        ]
                    }
                },
                "customDocumentHeader": {
                    "name": "customDocumentHeader",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "customInstitutionDetails": {
                    "name": "customInstitutionDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Institutions",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "Branch": {
            "name": "Branch",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "branchCode": {
                    "name": "branchCode",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "address": {
                    "name": "address",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "institution": {
                    "name": "institution",
                    "isArray": false,
                    "type": {
                        "model": "Institution"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "institutionBranchesId"
                        ]
                    }
                },
                "users": {
                    "name": "users",
                    "isArray": true,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "branchUsersId"
                        ]
                    }
                },
                "borrowers": {
                    "name": "borrowers",
                    "isArray": true,
                    "type": {
                        "model": "Borrower"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "branchBorrowersId"
                        ]
                    }
                },
                "employees": {
                    "name": "employees",
                    "isArray": true,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "branchEmployeesId"
                        ]
                    }
                },
                "accounts": {
                    "name": "accounts",
                    "isArray": true,
                    "type": {
                        "model": "AccountBranch"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "branch"
                        ]
                    }
                },
                "documents": {
                    "name": "documents",
                    "isArray": true,
                    "type": {
                        "model": "Document"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "branchDocumentsId"
                        ]
                    }
                },
                "loanProducts": {
                    "name": "loanProducts",
                    "isArray": true,
                    "type": {
                        "model": "BranchLoanProduct"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "branch"
                        ]
                    }
                },
                "payrolls": {
                    "name": "payrolls",
                    "isArray": true,
                    "type": {
                        "model": "Payroll"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "branchPayrollsId"
                        ]
                    }
                },
                "financialReports": {
                    "name": "financialReports",
                    "isArray": true,
                    "type": {
                        "model": "FinancialReport"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "branchFinancialReportsId"
                        ]
                    }
                },
                "customFormFields": {
                    "name": "customFormFields",
                    "isArray": true,
                    "type": {
                        "model": "CustomFormField"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "branchCustomFormFieldsId"
                        ]
                    }
                },
                "loans": {
                    "name": "loans",
                    "isArray": true,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "branch"
                        ]
                    }
                },
                "loanFeesConfigs": {
                    "name": "loanFeesConfigs",
                    "isArray": true,
                    "type": {
                        "model": "BranchLoanFeesConfig"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "branch"
                        ]
                    }
                },
                "groups": {
                    "name": "groups",
                    "isArray": true,
                    "type": {
                        "model": "Group"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "branchGroupsId"
                        ]
                    }
                },
                "customBranchDetails": {
                    "name": "customBranchDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "institutionBranchesId": {
                    "name": "institutionBranchesId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Branches",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "User": {
            "name": "User",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "firstName": {
                    "name": "firstName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "lastName": {
                    "name": "lastName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "middleName": {
                    "name": "middleName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "dateOfBirth": {
                    "name": "dateOfBirth",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "phoneNumber1": {
                    "name": "phoneNumber1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "phoneNumber2": {
                    "name": "phoneNumber2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "email": {
                    "name": "email",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "addressLine1": {
                    "name": "addressLine1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "addressLine2": {
                    "name": "addressLine2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "city": {
                    "name": "city",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "stateProvince": {
                    "name": "stateProvince",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "postalCode": {
                    "name": "postalCode",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nationalID": {
                    "name": "nationalID",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "passportNumber": {
                    "name": "passportNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nationality": {
                    "name": "nationality",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "userType": {
                    "name": "userType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "userPermissions": {
                    "name": "userPermissions",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "customFieldsData": {
                    "name": "customFieldsData",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "userDocuments": {
                    "name": "userDocuments",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "institution": {
                    "name": "institution",
                    "isArray": false,
                    "type": {
                        "model": "Institution"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "institutionUsersId"
                        ]
                    }
                },
                "branch": {
                    "name": "branch",
                    "isArray": false,
                    "type": {
                        "model": "Branch"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "branchUsersId"
                        ]
                    }
                },
                "userNotifications": {
                    "name": "userNotifications",
                    "isArray": true,
                    "type": {
                        "model": "UserNotification"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "userUserNotificationsId"
                        ]
                    }
                },
                "sentMessages": {
                    "name": "sentMessages",
                    "isArray": true,
                    "type": {
                        "model": "Message"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "sender"
                        ]
                    }
                },
                "receivedMessages": {
                    "name": "receivedMessages",
                    "isArray": true,
                    "type": {
                        "model": "Message"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "recipient"
                        ]
                    }
                },
                "sentNotifications": {
                    "name": "sentNotifications",
                    "isArray": true,
                    "type": {
                        "model": "Notification"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "sender"
                        ]
                    }
                },
                "receivedNotifications": {
                    "name": "receivedNotifications",
                    "isArray": true,
                    "type": {
                        "model": "Notification"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "recipient"
                        ]
                    }
                },
                "customUserDetails": {
                    "name": "customUserDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "institutionUsersId": {
                    "name": "institutionUsersId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "branchUsersId": {
                    "name": "branchUsersId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Users",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "Employee": {
            "name": "Employee",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "firstName": {
                    "name": "firstName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "lastName": {
                    "name": "lastName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "middleName": {
                    "name": "middleName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "dateOfBirth": {
                    "name": "dateOfBirth",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "phoneNumber1": {
                    "name": "phoneNumber1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "phoneNumber2": {
                    "name": "phoneNumber2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "email": {
                    "name": "email",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "title": {
                    "name": "title",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "addressLine1": {
                    "name": "addressLine1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "addressLine2": {
                    "name": "addressLine2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "city": {
                    "name": "city",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "stateProvince": {
                    "name": "stateProvince",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "postalCode": {
                    "name": "postalCode",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nextOfKinName": {
                    "name": "nextOfKinName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nextOfKinPhoneNumber": {
                    "name": "nextOfKinPhoneNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nextOfKinEmail": {
                    "name": "nextOfKinEmail",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nextOfKinRelationship": {
                    "name": "nextOfKinRelationship",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nextOfKinAddress": {
                    "name": "nextOfKinAddress",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nationalID": {
                    "name": "nationalID",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "passportNumber": {
                    "name": "passportNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nationality": {
                    "name": "nationality",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "employmentType": {
                    "name": "employmentType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "employmentStatus": {
                    "name": "employmentStatus",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "employmentStartDate": {
                    "name": "employmentStartDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "employmentEndDate": {
                    "name": "employmentEndDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "employmentPosition": {
                    "name": "employmentPosition",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "employmentDepartment": {
                    "name": "employmentDepartment",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "employmentGrade": {
                    "name": "employmentGrade",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "employmentLocation": {
                    "name": "employmentLocation",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "grossSalary": {
                    "name": "grossSalary",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "bankAccountNumber": {
                    "name": "bankAccountNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "bankName": {
                    "name": "bankName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "bankBranchCode": {
                    "name": "bankBranchCode",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "socialSecurityNumber": {
                    "name": "socialSecurityNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "taxIdentificationNumber": {
                    "name": "taxIdentificationNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "taxExemptStatus": {
                    "name": "taxExemptStatus",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "customFieldsData": {
                    "name": "customFieldsData",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "branch": {
                    "name": "branch",
                    "isArray": false,
                    "type": {
                        "model": "Branch"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "branchEmployeesId"
                        ]
                    }
                },
                "relatedUserID": {
                    "name": "relatedUserID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "relatedBorrowerID": {
                    "name": "relatedBorrowerID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "payroll": {
                    "name": "payroll",
                    "isArray": true,
                    "type": {
                        "model": "PayrollEmployee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "employee"
                        ]
                    }
                },
                "borrowers": {
                    "name": "borrowers",
                    "isArray": true,
                    "type": {
                        "model": "BorrowerLoanOfficer"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "employee"
                        ]
                    }
                },
                "supervisorID": {
                    "name": "supervisorID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "supervisor": {
                    "name": "supervisor",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "supervisorID"
                        ]
                    }
                },
                "subordinates": {
                    "name": "subordinates",
                    "isArray": true,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "supervisor"
                        ]
                    }
                },
                "creditScore": {
                    "name": "creditScore",
                    "isArray": true,
                    "type": {
                        "model": "CreditScore"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "createdByEmployee"
                        ]
                    }
                },
                "applications": {
                    "name": "applications",
                    "isArray": true,
                    "type": {
                        "model": "Application"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "createdByEmployee"
                        ]
                    }
                },
                "documents": {
                    "name": "documents",
                    "isArray": true,
                    "type": {
                        "model": "Document"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "createdByEmployee"
                        ]
                    }
                },
                "expenses": {
                    "name": "expenses",
                    "isArray": true,
                    "type": {
                        "model": "Expense"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "createdByEmployee"
                        ]
                    }
                },
                "payments": {
                    "name": "payments",
                    "isArray": true,
                    "type": {
                        "model": "Payment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "receivingEmployee"
                        ]
                    }
                },
                "loans": {
                    "name": "loans",
                    "isArray": true,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "createdByEmployee"
                        ]
                    }
                },
                "moneyTransactions": {
                    "name": "moneyTransactions",
                    "isArray": true,
                    "type": {
                        "model": "MoneyTransaction"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "createdByEmployee"
                        ]
                    }
                },
                "accounts": {
                    "name": "accounts",
                    "isArray": true,
                    "type": {
                        "model": "Account"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "createdByEmployee"
                        ]
                    }
                },
                "postedJournalEntries": {
                    "name": "postedJournalEntries",
                    "isArray": true,
                    "type": {
                        "model": "JournalEntry"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "employeePostedJournalEntriesId"
                        ]
                    }
                },
                "initiatedSavingsTransactions": {
                    "name": "initiatedSavingsTransactions",
                    "isArray": true,
                    "type": {
                        "model": "SavingsTransaction"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "employeeInitiatedSavingsTransactionsId"
                        ]
                    }
                },
                "approvals": {
                    "name": "approvals",
                    "isArray": true,
                    "type": {
                        "model": "Approval"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "employeeApprovalsId"
                        ]
                    }
                },
                "customEmployeeDetails": {
                    "name": "customEmployeeDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "branchEmployeesId": {
                    "name": "branchEmployeesId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Employees",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byRelatedUserID",
                        "fields": [
                            "relatedUserID"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byRelatedBorrowerID",
                        "fields": [
                            "relatedBorrowerID"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "bySupervisorID",
                        "fields": [
                            "supervisorID"
                        ]
                    }
                }
            ]
        },
        "Borrower": {
            "name": "Borrower",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "firstname": {
                    "name": "firstname",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "othername": {
                    "name": "othername",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "businessName": {
                    "name": "businessName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "typeOfBusiness": {
                    "name": "typeOfBusiness",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "uniqueIdNumber": {
                    "name": "uniqueIdNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "phoneNumber": {
                    "name": "phoneNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "otherPhoneNumber": {
                    "name": "otherPhoneNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "email": {
                    "name": "email",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "gender": {
                    "name": "gender",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "dateOfBirth": {
                    "name": "dateOfBirth",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nationality": {
                    "name": "nationality",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nationalIdPicture": {
                    "name": "nationalIdPicture",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "passportPicture": {
                    "name": "passportPicture",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "address": {
                    "name": "address",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "points": {
                    "name": "points",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "borrowerOpeningBalance": {
                    "name": "borrowerOpeningBalance",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "borrowerClosingBalance": {
                    "name": "borrowerClosingBalance",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "borrowerInterestRate": {
                    "name": "borrowerInterestRate",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "city": {
                    "name": "city",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "state": {
                    "name": "state",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "title": {
                    "name": "title",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "zipcode": {
                    "name": "zipcode",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "employmentStatus": {
                    "name": "employmentStatus",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "employerName": {
                    "name": "employerName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "creditScore": {
                    "name": "creditScore",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "additionalNote1": {
                    "name": "additionalNote1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "additionalNote2": {
                    "name": "additionalNote2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "borrowerDocuments": {
                    "name": "borrowerDocuments",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "customFieldsData": {
                    "name": "customFieldsData",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "branch": {
                    "name": "branch",
                    "isArray": false,
                    "type": {
                        "model": "Branch"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "branchBorrowersId"
                        ]
                    }
                },
                "loans": {
                    "name": "loans",
                    "isArray": true,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "borrower"
                        ]
                    }
                },
                "guarantors": {
                    "name": "guarantors",
                    "isArray": true,
                    "type": {
                        "model": "Guarantor"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "borrowerGuarantorsId"
                        ]
                    }
                },
                "securities": {
                    "name": "securities",
                    "isArray": true,
                    "type": {
                        "model": "Security"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "borrowerSecuritiesId"
                        ]
                    }
                },
                "applications": {
                    "name": "applications",
                    "isArray": true,
                    "type": {
                        "model": "Application"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "borrowerApplicationsId"
                        ]
                    }
                },
                "contracts": {
                    "name": "contracts",
                    "isArray": true,
                    "type": {
                        "model": "Contract"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "borrowerContractsId"
                        ]
                    }
                },
                "documents": {
                    "name": "documents",
                    "isArray": true,
                    "type": {
                        "model": "BorrowerDocument"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "borrower"
                        ]
                    }
                },
                "employees": {
                    "name": "employees",
                    "isArray": true,
                    "type": {
                        "model": "BorrowerLoanOfficer"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "borrower"
                        ]
                    }
                },
                "collaterals": {
                    "name": "collaterals",
                    "isArray": true,
                    "type": {
                        "model": "Collateral"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "borrowerCollateralsId"
                        ]
                    }
                },
                "creditScores": {
                    "name": "creditScores",
                    "isArray": true,
                    "type": {
                        "model": "CreditScore"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "borrower"
                        ]
                    }
                },
                "groupID": {
                    "name": "groupID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "group": {
                    "name": "group",
                    "isArray": false,
                    "type": {
                        "model": "Group"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "groupID"
                        ]
                    }
                },
                "memberType": {
                    "name": "memberType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "savingsAccounts": {
                    "name": "savingsAccounts",
                    "isArray": true,
                    "type": {
                        "model": "SavingsAccount"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "borrowerSavingsAccountsId"
                        ]
                    }
                },
                "shareAccount": {
                    "name": "shareAccount",
                    "isArray": false,
                    "type": {
                        "model": "ShareAccount"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "HAS_ONE",
                        "associatedWith": [
                            "id"
                        ],
                        "targetNames": [
                            "borrowerShareAccountId"
                        ]
                    }
                },
                "customBorrowerDetails": {
                    "name": "customBorrowerDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "branchBorrowersId": {
                    "name": "branchBorrowersId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "borrowerShareAccountId": {
                    "name": "borrowerShareAccountId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Borrowers",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byGroup",
                        "fields": [
                            "groupID"
                        ]
                    }
                }
            ]
        },
        "Guarantor": {
            "name": "Guarantor",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "relationship": {
                    "name": "relationship",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "phoneNumber": {
                    "name": "phoneNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "email": {
                    "name": "email",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "address": {
                    "name": "address",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "customFieldsData": {
                    "name": "customFieldsData",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "borrower": {
                    "name": "borrower",
                    "isArray": false,
                    "type": {
                        "model": "Borrower"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "borrowerGuarantorsId"
                        ]
                    }
                },
                "loans": {
                    "name": "loans",
                    "isArray": true,
                    "type": {
                        "model": "LoanGuarantor"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "guarantor"
                        ]
                    }
                },
                "applications": {
                    "name": "applications",
                    "isArray": true,
                    "type": {
                        "model": "ApplicationGuarantor"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "guarantor"
                        ]
                    }
                },
                "isExistingMember": {
                    "name": "isExistingMember",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "memberID": {
                    "name": "memberID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "lockedSavingsAmount": {
                    "name": "lockedSavingsAmount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "collaterals": {
                    "name": "collaterals",
                    "isArray": true,
                    "type": {
                        "model": "GuarantorCollateral"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "guarantor"
                        ]
                    }
                },
                "customGuarantorDetails": {
                    "name": "customGuarantorDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "borrowerGuarantorsId": {
                    "name": "borrowerGuarantorsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Guarantors",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "Security": {
            "name": "Security",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "type": {
                    "name": "type",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "value": {
                    "name": "value",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "borrower": {
                    "name": "borrower",
                    "isArray": false,
                    "type": {
                        "model": "Borrower"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "borrowerSecuritiesId"
                        ]
                    }
                },
                "customSecurityDetails": {
                    "name": "customSecurityDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "borrowerSecuritiesId": {
                    "name": "borrowerSecuritiesId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Securities",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "UserNotification": {
            "name": "UserNotification",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "eventType": {
                    "name": "eventType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "reference": {
                    "name": "reference",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "message": {
                    "name": "message",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "user": {
                    "name": "user",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "userUserNotificationsId"
                        ]
                    }
                },
                "customUserNotificationDetails": {
                    "name": "customUserNotificationDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "userUserNotificationsId": {
                    "name": "userUserNotificationsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "UserNotifications",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "LoanProduct": {
            "name": "LoanProduct",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "principalAmountMin": {
                    "name": "principalAmountMin",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "principalAmountMax": {
                    "name": "principalAmountMax",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "principalAmountDefault": {
                    "name": "principalAmountDefault",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "interestRateMin": {
                    "name": "interestRateMin",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "interestRateMax": {
                    "name": "interestRateMax",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "interestRateDefault": {
                    "name": "interestRateDefault",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "interestCalculationMethod": {
                    "name": "interestCalculationMethod",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "interestType": {
                    "name": "interestType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "interestPeriod": {
                    "name": "interestPeriod",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "termDurationMin": {
                    "name": "termDurationMin",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "termDurationMax": {
                    "name": "termDurationMax",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "termDurationDefault": {
                    "name": "termDurationDefault",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "durationPeriod": {
                    "name": "durationPeriod",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "repaymentFrequency": {
                    "name": "repaymentFrequency",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "repaymentOrder": {
                    "name": "repaymentOrder",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "extendLoanAfterMaturity": {
                    "name": "extendLoanAfterMaturity",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "interestTypeMaturity": {
                    "name": "interestTypeMaturity",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "calculateInterestOn": {
                    "name": "calculateInterestOn",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loanInterestRateAfterMaturity": {
                    "name": "loanInterestRateAfterMaturity",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "recurringPeriodAfterMaturityUnit": {
                    "name": "recurringPeriodAfterMaturityUnit",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "institution": {
                    "name": "institution",
                    "isArray": false,
                    "type": {
                        "model": "Institution"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "institutionLoanProductsId"
                        ]
                    }
                },
                "branches": {
                    "name": "branches",
                    "isArray": true,
                    "type": {
                        "model": "BranchLoanProduct"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loanProduct"
                        ]
                    }
                },
                "loanFees": {
                    "name": "loanFees",
                    "isArray": true,
                    "type": {
                        "model": "LoanProductLoanFees"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loanProduct"
                        ]
                    }
                },
                "loanFeesConfigs": {
                    "name": "loanFeesConfigs",
                    "isArray": true,
                    "type": {
                        "model": "LoanProductLoanFeesConfig"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loanProduct"
                        ]
                    }
                },
                "loanPenalties": {
                    "name": "loanPenalties",
                    "isArray": true,
                    "type": {
                        "model": "LoanProductPenalty"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loanProduct"
                        ]
                    }
                },
                "applications": {
                    "name": "applications",
                    "isArray": true,
                    "type": {
                        "model": "Application"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loanProduct"
                        ]
                    }
                },
                "loans": {
                    "name": "loans",
                    "isArray": true,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loanProduct"
                        ]
                    }
                },
                "customLoanProductDetails": {
                    "name": "customLoanProductDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "institutionLoanProductsId": {
                    "name": "institutionLoanProductsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "LoanProducts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "CreditScore": {
            "name": "CreditScore",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "score": {
                    "name": "score",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "scoreDate": {
                    "name": "scoreDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "scoreSource": {
                    "name": "scoreSource",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "scoreStatus": {
                    "name": "scoreStatus",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "borrowerID": {
                    "name": "borrowerID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "borrower": {
                    "name": "borrower",
                    "isArray": false,
                    "type": {
                        "model": "Borrower"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "borrowerID"
                        ]
                    }
                },
                "createdByEmployeeID": {
                    "name": "createdByEmployeeID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "createdByEmployee": {
                    "name": "createdByEmployee",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "createdByEmployeeID"
                        ]
                    }
                },
                "customCreditScoreDetails": {
                    "name": "customCreditScoreDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "CreditScores",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byBorrowerID",
                        "fields": [
                            "borrowerID"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCreatedByEmployeeID",
                        "fields": [
                            "createdByEmployeeID"
                        ]
                    }
                }
            ]
        },
        "Document": {
            "name": "Document",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "documentType": {
                    "name": "documentType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "documentName": {
                    "name": "documentName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "documentDescription": {
                    "name": "documentDescription",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "serialNumber": {
                    "name": "serialNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "documentDate": {
                    "name": "documentDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "s3Key": {
                    "name": "s3Key",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "fileName": {
                    "name": "fileName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "contentType": {
                    "name": "contentType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "branch": {
                    "name": "branch",
                    "isArray": false,
                    "type": {
                        "model": "Branch"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "branchDocumentsId"
                        ]
                    }
                },
                "borrowers": {
                    "name": "borrowers",
                    "isArray": true,
                    "type": {
                        "model": "BorrowerDocument"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "document"
                        ]
                    }
                },
                "loans": {
                    "name": "loans",
                    "isArray": true,
                    "type": {
                        "model": "LoanDocument"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "document"
                        ]
                    }
                },
                "applications": {
                    "name": "applications",
                    "isArray": true,
                    "type": {
                        "model": "ApplicationDocument"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "document"
                        ]
                    }
                },
                "contracts": {
                    "name": "contracts",
                    "isArray": true,
                    "type": {
                        "model": "ContractDocument"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "document"
                        ]
                    }
                },
                "expenses": {
                    "name": "expenses",
                    "isArray": true,
                    "type": {
                        "model": "ExpenseDocument"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "document"
                        ]
                    }
                },
                "payments": {
                    "name": "payments",
                    "isArray": true,
                    "type": {
                        "model": "PaymentDocument"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "document"
                        ]
                    }
                },
                "moneyTransactions": {
                    "name": "moneyTransactions",
                    "isArray": true,
                    "type": {
                        "model": "MoneyTransactionDocument"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "document"
                        ]
                    }
                },
                "createdByEmployeeID": {
                    "name": "createdByEmployeeID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "createdByEmployee": {
                    "name": "createdByEmployee",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "createdByEmployeeID"
                        ]
                    }
                },
                "customDocumentDetails": {
                    "name": "customDocumentDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "branchDocumentsId": {
                    "name": "branchDocumentsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Documents",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCreatedByEmployeeID",
                        "fields": [
                            "createdByEmployeeID"
                        ]
                    }
                }
            ]
        },
        "Contract": {
            "name": "Contract",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "contractNumber": {
                    "name": "contractNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "contractType": {
                    "name": "contractType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "contractDate": {
                    "name": "contractDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "contractStatus": {
                    "name": "contractStatus",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "contractRecord": {
                    "name": "contractRecord",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "borrower": {
                    "name": "borrower",
                    "isArray": false,
                    "type": {
                        "model": "Borrower"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "borrowerContractsId"
                        ]
                    }
                },
                "applications": {
                    "name": "applications",
                    "isArray": true,
                    "type": {
                        "model": "ApplicationContract"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "contract"
                        ]
                    }
                },
                "collaterals": {
                    "name": "collaterals",
                    "isArray": true,
                    "type": {
                        "model": "CollateralContract"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "contract"
                        ]
                    }
                },
                "documents": {
                    "name": "documents",
                    "isArray": true,
                    "type": {
                        "model": "ContractDocument"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "contract"
                        ]
                    }
                },
                "loans": {
                    "name": "loans",
                    "isArray": true,
                    "type": {
                        "model": "LoanContract"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "contract"
                        ]
                    }
                },
                "customContractDetails": {
                    "name": "customContractDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "borrowerContractsId": {
                    "name": "borrowerContractsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Contracts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "Application": {
            "name": "Application",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "applicationNumber": {
                    "name": "applicationNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "requestedPrincipalAmount": {
                    "name": "requestedPrincipalAmount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "requestedTermMonths": {
                    "name": "requestedTermMonths",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "requestedFrequency": {
                    "name": "requestedFrequency",
                    "isArray": false,
                    "type": {
                        "enum": "Frequency"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "applicationDate": {
                    "name": "applicationDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "applicationRecord": {
                    "name": "applicationRecord",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "borrower": {
                    "name": "borrower",
                    "isArray": false,
                    "type": {
                        "model": "Borrower"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "borrowerApplicationsId"
                        ]
                    }
                },
                "guarantors": {
                    "name": "guarantors",
                    "isArray": true,
                    "type": {
                        "model": "ApplicationGuarantor"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "application"
                        ]
                    }
                },
                "collateral": {
                    "name": "collateral",
                    "isArray": true,
                    "type": {
                        "model": "ApplicationCollateral"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "application"
                        ]
                    }
                },
                "contracts": {
                    "name": "contracts",
                    "isArray": true,
                    "type": {
                        "model": "ApplicationContract"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "application"
                        ]
                    }
                },
                "expenses": {
                    "name": "expenses",
                    "isArray": true,
                    "type": {
                        "model": "ApplicationExpense"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "application"
                        ]
                    }
                },
                "loans": {
                    "name": "loans",
                    "isArray": true,
                    "type": {
                        "model": "LoanApplication"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "application"
                        ]
                    }
                },
                "documents": {
                    "name": "documents",
                    "isArray": true,
                    "type": {
                        "model": "ApplicationDocument"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "application"
                        ]
                    }
                },
                "loanProductID": {
                    "name": "loanProductID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanProduct": {
                    "name": "loanProduct",
                    "isArray": false,
                    "type": {
                        "model": "LoanProduct"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanProductID"
                        ]
                    }
                },
                "createdByEmployeeID": {
                    "name": "createdByEmployeeID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "createdByEmployee": {
                    "name": "createdByEmployee",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "createdByEmployeeID"
                        ]
                    }
                },
                "customFieldsData": {
                    "name": "customFieldsData",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "customApplicationDetails": {
                    "name": "customApplicationDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "borrowerApplicationsId": {
                    "name": "borrowerApplicationsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Applications",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoanProductID",
                        "fields": [
                            "loanProductID"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCreatedByEmployeeID",
                        "fields": [
                            "createdByEmployeeID"
                        ]
                    }
                }
            ]
        },
        "Collateral": {
            "name": "Collateral",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "type": {
                    "name": "type",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "location": {
                    "name": "location",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "value": {
                    "name": "value",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "serialNumber": {
                    "name": "serialNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "registrationNumber": {
                    "name": "registrationNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "insuranceDetails": {
                    "name": "insuranceDetails",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "insuranceExpiryDate": {
                    "name": "insuranceExpiryDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "insuranceCompany": {
                    "name": "insuranceCompany",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "storedAt": {
                    "name": "storedAt",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "customFieldsData": {
                    "name": "customFieldsData",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "borrower": {
                    "name": "borrower",
                    "isArray": false,
                    "type": {
                        "model": "Borrower"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "borrowerCollateralsId"
                        ]
                    }
                },
                "loans": {
                    "name": "loans",
                    "isArray": true,
                    "type": {
                        "model": "LoanCollateral"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "collateral"
                        ]
                    }
                },
                "applications": {
                    "name": "applications",
                    "isArray": true,
                    "type": {
                        "model": "ApplicationCollateral"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "collateral"
                        ]
                    }
                },
                "contracts": {
                    "name": "contracts",
                    "isArray": true,
                    "type": {
                        "model": "CollateralContract"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "collateral"
                        ]
                    }
                },
                "guarantors": {
                    "name": "guarantors",
                    "isArray": true,
                    "type": {
                        "model": "GuarantorCollateral"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "collateral"
                        ]
                    }
                },
                "customCollateralDetails": {
                    "name": "customCollateralDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "borrowerCollateralsId": {
                    "name": "borrowerCollateralsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Collaterals",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "Loan": {
            "name": "Loan",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "loanNumber": {
                    "name": "loanNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "approvedDate": {
                    "name": "approvedDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "principal": {
                    "name": "principal",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "fees": {
                    "name": "fees",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "interestRate": {
                    "name": "interestRate",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "startDate": {
                    "name": "startDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "maturityDate": {
                    "name": "maturityDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "stopDate": {
                    "name": "stopDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "extensionPeriod": {
                    "name": "extensionPeriod",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "duration": {
                    "name": "duration",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "durationInterval": {
                    "name": "durationInterval",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loanType": {
                    "name": "loanType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "rateInterval": {
                    "name": "rateInterval",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loanCurrency": {
                    "name": "loanCurrency",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loanPurpose": {
                    "name": "loanPurpose",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loanComputationRecord": {
                    "name": "loanComputationRecord",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "loanAttribute1": {
                    "name": "loanAttribute1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loanAttribute2": {
                    "name": "loanAttribute2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "numberOfPayments": {
                    "name": "numberOfPayments",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "paymentFrequency": {
                    "name": "paymentFrequency",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "customFieldsData": {
                    "name": "customFieldsData",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "borrowerID": {
                    "name": "borrowerID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "borrower": {
                    "name": "borrower",
                    "isArray": false,
                    "type": {
                        "model": "Borrower"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "borrowerID"
                        ]
                    }
                },
                "branchID": {
                    "name": "branchID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "branch": {
                    "name": "branch",
                    "isArray": false,
                    "type": {
                        "model": "Branch"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "branchID"
                        ]
                    }
                },
                "payments": {
                    "name": "payments",
                    "isArray": true,
                    "type": {
                        "model": "Payment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loan"
                        ]
                    }
                },
                "events": {
                    "name": "events",
                    "isArray": true,
                    "type": {
                        "model": "LoanEvent"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loan"
                        ]
                    }
                },
                "loanFees": {
                    "name": "loanFees",
                    "isArray": true,
                    "type": {
                        "model": "LoanFees"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loanLoanFeesId"
                        ]
                    }
                },
                "penalties": {
                    "name": "penalties",
                    "isArray": true,
                    "type": {
                        "model": "Penalty"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loanPenaltiesId"
                        ]
                    }
                },
                "applications": {
                    "name": "applications",
                    "isArray": true,
                    "type": {
                        "model": "LoanApplication"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loan"
                        ]
                    }
                },
                "accounts": {
                    "name": "accounts",
                    "isArray": true,
                    "type": {
                        "model": "LoanAccount"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loan"
                        ]
                    }
                },
                "guarantors": {
                    "name": "guarantors",
                    "isArray": true,
                    "type": {
                        "model": "LoanGuarantor"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loan"
                        ]
                    }
                },
                "collateral": {
                    "name": "collateral",
                    "isArray": true,
                    "type": {
                        "model": "LoanCollateral"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loan"
                        ]
                    }
                },
                "contracts": {
                    "name": "contracts",
                    "isArray": true,
                    "type": {
                        "model": "LoanContract"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loan"
                        ]
                    }
                },
                "expenses": {
                    "name": "expenses",
                    "isArray": true,
                    "type": {
                        "model": "LoanExpense"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loan"
                        ]
                    }
                },
                "documents": {
                    "name": "documents",
                    "isArray": true,
                    "type": {
                        "model": "LoanDocument"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loan"
                        ]
                    }
                },
                "moneyTransactions": {
                    "name": "moneyTransactions",
                    "isArray": true,
                    "type": {
                        "model": "MoneyTransaction"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loan"
                        ]
                    }
                },
                "loanProductID": {
                    "name": "loanProductID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanProduct": {
                    "name": "loanProduct",
                    "isArray": false,
                    "type": {
                        "model": "LoanProduct"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanProductID"
                        ]
                    }
                },
                "createdByEmployeeID": {
                    "name": "createdByEmployeeID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "createdByEmployee": {
                    "name": "createdByEmployee",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "createdByEmployeeID"
                        ]
                    }
                },
                "groupID": {
                    "name": "groupID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "group": {
                    "name": "group",
                    "isArray": false,
                    "type": {
                        "model": "Group"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "groupID"
                        ]
                    }
                },
                "relatedJournalEntries": {
                    "name": "relatedJournalEntries",
                    "isArray": true,
                    "type": {
                        "model": "JournalEntry"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "relatedLoan"
                        ]
                    }
                },
                "customLoanDetails": {
                    "name": "customLoanDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Loans",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoanNumber",
                        "fields": [
                            "loanNumber"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byBorrower",
                        "fields": [
                            "borrowerID",
                            "startDate"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byBranch",
                        "fields": [
                            "branchID",
                            "startDate"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoanProductID",
                        "fields": [
                            "loanProductID"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCreatedByEmployeeID",
                        "fields": [
                            "createdByEmployeeID"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byGroupLoan",
                        "fields": [
                            "groupID"
                        ]
                    }
                }
            ]
        },
        "LoanEvent": {
            "name": "LoanEvent",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "loanID": {
                    "name": "loanID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "loan": {
                    "name": "loan",
                    "isArray": false,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanID"
                        ]
                    }
                },
                "eventAt": {
                    "name": "eventAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": true,
                    "attributes": []
                },
                "eventType": {
                    "name": "eventType",
                    "isArray": false,
                    "type": {
                        "enum": "LoanEventType"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "actorEmployeeID": {
                    "name": "actorEmployeeID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "summary": {
                    "name": "summary",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "payload": {
                    "name": "payload",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "paymentID": {
                    "name": "paymentID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "payment": {
                    "name": "payment",
                    "isArray": false,
                    "type": {
                        "model": "Payment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "paymentID"
                        ]
                    }
                },
                "customLoanEventDetails": {
                    "name": "customLoanEventDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "LoanEvents",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoan",
                        "fields": [
                            "loanID",
                            "eventAt"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byPayment",
                        "fields": [
                            "paymentID"
                        ]
                    }
                }
            ]
        },
        "Investment": {
            "name": "Investment",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "principal": {
                    "name": "principal",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "fees": {
                    "name": "fees",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "interestRate": {
                    "name": "interestRate",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "startDate": {
                    "name": "startDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "maturityDate": {
                    "name": "maturityDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "stopDate": {
                    "name": "stopDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "extensionPeriod": {
                    "name": "extensionPeriod",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "duration": {
                    "name": "duration",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "durationInterval": {
                    "name": "durationInterval",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "type": {
                    "name": "type",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "rateInterval": {
                    "name": "rateInterval",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "investmentStatus": {
                    "name": "investmentStatus",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "investmentAttribute1": {
                    "name": "investmentAttribute1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "investmentAttribute2": {
                    "name": "investmentAttribute2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "numberOfPayments": {
                    "name": "numberOfPayments",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "paymentFrequency": {
                    "name": "paymentFrequency",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "accounts": {
                    "name": "accounts",
                    "isArray": true,
                    "type": {
                        "model": "InvestmentAccount"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "investment"
                        ]
                    }
                },
                "customInvestmentDetails": {
                    "name": "customInvestmentDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Investments",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "LoanFees": {
            "name": "LoanFees",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "amount": {
                    "name": "amount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFeesName": {
                    "name": "loanFeesName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFeesCategory": {
                    "name": "loanFeesCategory",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFeesCalculationMethod": {
                    "name": "loanFeesCalculationMethod",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFeesRate": {
                    "name": "loanFeesRate",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFeesDate": {
                    "name": "loanFeesDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFeesStatus": {
                    "name": "loanFeesStatus",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "notes": {
                    "name": "notes",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFeesType": {
                    "name": "loanFeesType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFeesDescription": {
                    "name": "loanFeesDescription",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFeesAttribute1": {
                    "name": "loanFeesAttribute1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFeesAttribute2": {
                    "name": "loanFeesAttribute2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loan": {
                    "name": "loan",
                    "isArray": false,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanLoanFeesId"
                        ]
                    }
                },
                "loanProducts": {
                    "name": "loanProducts",
                    "isArray": true,
                    "type": {
                        "model": "LoanProductLoanFees"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loanFees"
                        ]
                    }
                },
                "accountID": {
                    "name": "accountID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "account": {
                    "name": "account",
                    "isArray": false,
                    "type": {
                        "model": "Account"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "accountID"
                        ]
                    }
                },
                "loanFeesConfigs": {
                    "name": "loanFeesConfigs",
                    "isArray": true,
                    "type": {
                        "model": "LoanFeesLoanFeesConfig"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loanFees"
                        ]
                    }
                },
                "customLoanFeesDetails": {
                    "name": "customLoanFeesDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "loanLoanFeesId": {
                    "name": "loanLoanFeesId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "LoanFees",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byAccountID",
                        "fields": [
                            "accountID"
                        ]
                    }
                }
            ]
        },
        "Penalty": {
            "name": "Penalty",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "amount": {
                    "name": "amount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "penaltyName": {
                    "name": "penaltyName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "penaltyCategory": {
                    "name": "penaltyCategory",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "penaltyCalculationMethod": {
                    "name": "penaltyCalculationMethod",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "penaltyRate": {
                    "name": "penaltyRate",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "penaltyDate": {
                    "name": "penaltyDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "penaltyStatus": {
                    "name": "penaltyStatus",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "notes": {
                    "name": "notes",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "penaltyType": {
                    "name": "penaltyType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "penaltyDescription": {
                    "name": "penaltyDescription",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "penaltyAttribute1": {
                    "name": "penaltyAttribute1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "penaltyAttribute2": {
                    "name": "penaltyAttribute2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loan": {
                    "name": "loan",
                    "isArray": false,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanPenaltiesId"
                        ]
                    }
                },
                "loanProducts": {
                    "name": "loanProducts",
                    "isArray": true,
                    "type": {
                        "model": "LoanProductPenalty"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "penalty"
                        ]
                    }
                },
                "accountID": {
                    "name": "accountID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "account": {
                    "name": "account",
                    "isArray": false,
                    "type": {
                        "model": "Account"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "accountID"
                        ]
                    }
                },
                "customPenaltyDetails": {
                    "name": "customPenaltyDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "loanPenaltiesId": {
                    "name": "loanPenaltiesId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Penalties",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byAccountID",
                        "fields": [
                            "accountID"
                        ]
                    }
                }
            ]
        },
        "Payroll": {
            "name": "Payroll",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "periodStartDate": {
                    "name": "periodStartDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "periodEndDate": {
                    "name": "periodEndDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "payDate": {
                    "name": "payDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "processedByUserID": {
                    "name": "processedByUserID",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "totalGrossPay": {
                    "name": "totalGrossPay",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "totalLoanDeductions": {
                    "name": "totalLoanDeductions",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "totalSavingsDeductions": {
                    "name": "totalSavingsDeductions",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "totalShareDeductions": {
                    "name": "totalShareDeductions",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "totalNetPay": {
                    "name": "totalNetPay",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "details": {
                    "name": "details",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "branch": {
                    "name": "branch",
                    "isArray": false,
                    "type": {
                        "model": "Branch"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "branchPayrollsId"
                        ]
                    }
                },
                "employees": {
                    "name": "employees",
                    "isArray": true,
                    "type": {
                        "model": "PayrollEmployee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "payroll"
                        ]
                    }
                },
                "customPayrollDetails": {
                    "name": "customPayrollDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "branchPayrollsId": {
                    "name": "branchPayrollsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Payrolls",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "Account": {
            "name": "Account",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "accountType": {
                    "name": "accountType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "accountNumber": {
                    "name": "accountNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "currency": {
                    "name": "currency",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "currentBalance": {
                    "name": "currentBalance",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "openingBalance": {
                    "name": "openingBalance",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "interestRate": {
                    "name": "interestRate",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "interestCalculationMethod": {
                    "name": "interestCalculationMethod",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "interestPostingFrequency": {
                    "name": "interestPostingFrequency",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "interestPostingDate": {
                    "name": "interestPostingDate",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "interestAccrued": {
                    "name": "interestAccrued",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "interestAccruedDate": {
                    "name": "interestAccruedDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "accountStatus": {
                    "name": "accountStatus",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "institution": {
                    "name": "institution",
                    "isArray": false,
                    "type": {
                        "model": "Institution"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "institutionAccountsId"
                        ]
                    }
                },
                "branches": {
                    "name": "branches",
                    "isArray": true,
                    "type": {
                        "model": "AccountBranch"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "account"
                        ]
                    }
                },
                "moneyTransactions": {
                    "name": "moneyTransactions",
                    "isArray": true,
                    "type": {
                        "model": "MoneyTransaction"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "accountMoneyTransactionsId"
                        ]
                    }
                },
                "expenses": {
                    "name": "expenses",
                    "isArray": true,
                    "type": {
                        "model": "Expense"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "accountExpensesId"
                        ]
                    }
                },
                "loans": {
                    "name": "loans",
                    "isArray": true,
                    "type": {
                        "model": "LoanAccount"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "account"
                        ]
                    }
                },
                "investments": {
                    "name": "investments",
                    "isArray": true,
                    "type": {
                        "model": "InvestmentAccount"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "account"
                        ]
                    }
                },
                "otherIncomes": {
                    "name": "otherIncomes",
                    "isArray": true,
                    "type": {
                        "model": "OtherIncomeAccount"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "account"
                        ]
                    }
                },
                "loanFees": {
                    "name": "loanFees",
                    "isArray": true,
                    "type": {
                        "model": "LoanFees"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "account"
                        ]
                    }
                },
                "payments": {
                    "name": "payments",
                    "isArray": true,
                    "type": {
                        "model": "Payment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "account"
                        ]
                    }
                },
                "penalties": {
                    "name": "penalties",
                    "isArray": true,
                    "type": {
                        "model": "Penalty"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "account"
                        ]
                    }
                },
                "createdByEmployeeID": {
                    "name": "createdByEmployeeID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "createdByEmployee": {
                    "name": "createdByEmployee",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "createdByEmployeeID"
                        ]
                    }
                },
                "customAccountDetails": {
                    "name": "customAccountDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "institutionAccountsId": {
                    "name": "institutionAccountsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Accounts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCreatedByEmployeeID",
                        "fields": [
                            "createdByEmployeeID"
                        ]
                    }
                }
            ]
        },
        "MoneyTransaction": {
            "name": "MoneyTransaction",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "transactionType": {
                    "name": "transactionType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "transactionDate": {
                    "name": "transactionDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "amount": {
                    "name": "amount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "referenceNumber": {
                    "name": "referenceNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "relatedEntityType": {
                    "name": "relatedEntityType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "approvalStatus": {
                    "name": "approvalStatus",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "approvedDate": {
                    "name": "approvedDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "category": {
                    "name": "category",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "notes": {
                    "name": "notes",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "paymentMethod": {
                    "name": "paymentMethod",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "deviceInfo": {
                    "name": "deviceInfo",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "account": {
                    "name": "account",
                    "isArray": false,
                    "type": {
                        "model": "Account"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "accountMoneyTransactionsId"
                        ]
                    }
                },
                "loanID": {
                    "name": "loanID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loan": {
                    "name": "loan",
                    "isArray": false,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanID"
                        ]
                    }
                },
                "paymentID": {
                    "name": "paymentID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "payment": {
                    "name": "payment",
                    "isArray": false,
                    "type": {
                        "model": "Payment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "paymentID"
                        ]
                    }
                },
                "documents": {
                    "name": "documents",
                    "isArray": true,
                    "type": {
                        "model": "MoneyTransactionDocument"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "moneyTransaction"
                        ]
                    }
                },
                "createdByEmployeeID": {
                    "name": "createdByEmployeeID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "createdByEmployee": {
                    "name": "createdByEmployee",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "createdByEmployeeID"
                        ]
                    }
                },
                "paymentsLink": {
                    "name": "paymentsLink",
                    "isArray": true,
                    "type": {
                        "model": "Payment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "moneyTransaction"
                        ]
                    }
                },
                "customMoneyTransactionDetails": {
                    "name": "customMoneyTransactionDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "accountMoneyTransactionsId": {
                    "name": "accountMoneyTransactionsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "MoneyTransactions",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoan",
                        "fields": [
                            "loanID",
                            "transactionDate"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byPayment",
                        "fields": [
                            "paymentID"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCreatedByEmployeeID",
                        "fields": [
                            "createdByEmployeeID"
                        ]
                    }
                }
            ]
        },
        "Payment": {
            "name": "Payment",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "paymentDate": {
                    "name": "paymentDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "paymentType": {
                    "name": "paymentType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "amount": {
                    "name": "amount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "referenceNumber": {
                    "name": "referenceNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "paymentMethod": {
                    "name": "paymentMethod",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "paymentStatusEnum": {
                    "name": "paymentStatusEnum",
                    "isArray": false,
                    "type": {
                        "enum": "PaymentStatus"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "notes": {
                    "name": "notes",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "loanID": {
                    "name": "loanID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loan": {
                    "name": "loan",
                    "isArray": false,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanID"
                        ]
                    }
                },
                "moneyTransactionID": {
                    "name": "moneyTransactionID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "moneyTransaction": {
                    "name": "moneyTransaction",
                    "isArray": false,
                    "type": {
                        "model": "MoneyTransaction"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "moneyTransactionID"
                        ]
                    }
                },
                "accountID": {
                    "name": "accountID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "account": {
                    "name": "account",
                    "isArray": false,
                    "type": {
                        "model": "Account"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "accountID"
                        ]
                    }
                },
                "receivingEmployeeID": {
                    "name": "receivingEmployeeID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "receivingEmployee": {
                    "name": "receivingEmployee",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "receivingEmployeeID"
                        ]
                    }
                },
                "documents": {
                    "name": "documents",
                    "isArray": true,
                    "type": {
                        "model": "PaymentDocument"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "payment"
                        ]
                    }
                },
                "moneyTransactions": {
                    "name": "moneyTransactions",
                    "isArray": true,
                    "type": {
                        "model": "MoneyTransaction"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "payment"
                        ]
                    }
                },
                "events": {
                    "name": "events",
                    "isArray": true,
                    "type": {
                        "model": "LoanEvent"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "payment"
                        ]
                    }
                },
                "amountAllocatedToPrincipal": {
                    "name": "amountAllocatedToPrincipal",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "amountAllocatedToInterest": {
                    "name": "amountAllocatedToInterest",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "amountAllocatedToFees": {
                    "name": "amountAllocatedToFees",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "amountAllocatedToPenalty": {
                    "name": "amountAllocatedToPenalty",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "relatedJournalEntries": {
                    "name": "relatedJournalEntries",
                    "isArray": true,
                    "type": {
                        "model": "JournalEntry"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "relatedPayment"
                        ]
                    }
                },
                "customPaymentDetails": {
                    "name": "customPaymentDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Payments",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoan",
                        "fields": [
                            "loanID",
                            "paymentDate"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byMoneyTransaction",
                        "fields": [
                            "moneyTransactionID"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byAccountID",
                        "fields": [
                            "accountID"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byReceivingEmployeeID",
                        "fields": [
                            "receivingEmployeeID"
                        ]
                    }
                }
            ]
        },
        "Expense": {
            "name": "Expense",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "transactionDate": {
                    "name": "transactionDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "amount": {
                    "name": "amount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "referenceNumber": {
                    "name": "referenceNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "receiptDocumentS3Key": {
                    "name": "receiptDocumentS3Key",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "notes": {
                    "name": "notes",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "payee": {
                    "name": "payee",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "paymentMethod": {
                    "name": "paymentMethod",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "checkNumber": {
                    "name": "checkNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "approvedDate": {
                    "name": "approvedDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "type": {
                    "name": "type",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "category": {
                    "name": "category",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "account": {
                    "name": "account",
                    "isArray": false,
                    "type": {
                        "model": "Account"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "accountExpensesId"
                        ]
                    }
                },
                "loans": {
                    "name": "loans",
                    "isArray": true,
                    "type": {
                        "model": "LoanExpense"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "expense"
                        ]
                    }
                },
                "applications": {
                    "name": "applications",
                    "isArray": true,
                    "type": {
                        "model": "ApplicationExpense"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "expense"
                        ]
                    }
                },
                "documents": {
                    "name": "documents",
                    "isArray": true,
                    "type": {
                        "model": "ExpenseDocument"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "expense"
                        ]
                    }
                },
                "createdByEmployeeID": {
                    "name": "createdByEmployeeID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "createdByEmployee": {
                    "name": "createdByEmployee",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "createdByEmployeeID"
                        ]
                    }
                },
                "relatedJournalEntries": {
                    "name": "relatedJournalEntries",
                    "isArray": true,
                    "type": {
                        "model": "JournalEntry"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "relatedExpense"
                        ]
                    }
                },
                "customExpenseDetails": {
                    "name": "customExpenseDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "accountExpensesId": {
                    "name": "accountExpensesId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Expenses",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCreatedByEmployeeID",
                        "fields": [
                            "createdByEmployeeID"
                        ]
                    }
                }
            ]
        },
        "OtherIncome": {
            "name": "OtherIncome",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "amount": {
                    "name": "amount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "incomeDate": {
                    "name": "incomeDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "incomeType": {
                    "name": "incomeType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "accounts": {
                    "name": "accounts",
                    "isArray": true,
                    "type": {
                        "model": "OtherIncomeAccount"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "otherIncome"
                        ]
                    }
                },
                "customOtherIncomeDetails": {
                    "name": "customOtherIncomeDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "OtherIncomes",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "FinancialReport": {
            "name": "FinancialReport",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "reportName": {
                    "name": "reportName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "reportType": {
                    "name": "reportType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "reportDate": {
                    "name": "reportDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "startDate": {
                    "name": "startDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "endDate": {
                    "name": "endDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "reportData": {
                    "name": "reportData",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "branch": {
                    "name": "branch",
                    "isArray": false,
                    "type": {
                        "model": "Branch"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "branchFinancialReportsId"
                        ]
                    }
                },
                "customFinancialReportDetails": {
                    "name": "customFinancialReportDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "branchFinancialReportsId": {
                    "name": "branchFinancialReportsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "FinancialReports",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "CustomFormField": {
            "name": "CustomFormField",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "formKey": {
                    "name": "formKey",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "label": {
                    "name": "label",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "fieldType": {
                    "name": "fieldType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "options": {
                    "name": "options",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "required": {
                    "name": "required",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "order": {
                    "name": "order",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "createdBy": {
                    "name": "createdBy",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "branch": {
                    "name": "branch",
                    "isArray": false,
                    "type": {
                        "model": "Branch"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "branchCustomFormFieldsId"
                        ]
                    }
                },
                "institution": {
                    "name": "institution",
                    "isArray": false,
                    "type": {
                        "model": "Institution"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "institutionCustomFormFieldsId"
                        ]
                    }
                },
                "customCustomFormFieldDetails": {
                    "name": "customCustomFormFieldDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "institutionCustomFormFieldsId": {
                    "name": "institutionCustomFormFieldsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "branchCustomFormFieldsId": {
                    "name": "branchCustomFormFieldsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "CustomFormFields",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "LoanFeesConfig": {
            "name": "LoanFeesConfig",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "category": {
                    "name": "category",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "calculationMethod": {
                    "name": "calculationMethod",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "percentageBase": {
                    "name": "percentageBase",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "rate": {
                    "name": "rate",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "institution": {
                    "name": "institution",
                    "isArray": false,
                    "type": {
                        "model": "Institution"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "institutionLoanFeesConfigsId"
                        ]
                    }
                },
                "branches": {
                    "name": "branches",
                    "isArray": true,
                    "type": {
                        "model": "BranchLoanFeesConfig"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loanFeesConfig"
                        ]
                    }
                },
                "loanFees": {
                    "name": "loanFees",
                    "isArray": true,
                    "type": {
                        "model": "LoanFeesLoanFeesConfig"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loanFeesConfig"
                        ]
                    }
                },
                "loanProducts": {
                    "name": "loanProducts",
                    "isArray": true,
                    "type": {
                        "model": "LoanProductLoanFeesConfig"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "loanFeesConfig"
                        ]
                    }
                },
                "customLoanFeesConfigDetails": {
                    "name": "customLoanFeesConfigDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "institutionLoanFeesConfigsId": {
                    "name": "institutionLoanFeesConfigsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "LoanFeesConfigs",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "Message": {
            "name": "Message",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "subject": {
                    "name": "subject",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "body": {
                    "name": "body",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "sender": {
                    "name": "sender",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "senderUserId"
                        ]
                    }
                },
                "senderUserId": {
                    "name": "senderUserId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "recipient": {
                    "name": "recipient",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "recipientUserId"
                        ]
                    }
                },
                "recipientUserId": {
                    "name": "recipientUserId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "customMessageDetails": {
                    "name": "customMessageDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Messages",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "bySender",
                        "fields": [
                            "senderUserId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byRecipient",
                        "fields": [
                            "recipientUserId"
                        ]
                    }
                }
            ]
        },
        "Notification": {
            "name": "Notification",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "subject": {
                    "name": "subject",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "body": {
                    "name": "body",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "notificationType": {
                    "name": "notificationType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "approvalStatus": {
                    "name": "approvalStatus",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "referenceId": {
                    "name": "referenceId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "sender": {
                    "name": "sender",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "senderUserId"
                        ]
                    }
                },
                "senderUserId": {
                    "name": "senderUserId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "recipient": {
                    "name": "recipient",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "recipientUserId"
                        ]
                    }
                },
                "recipientUserId": {
                    "name": "recipientUserId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "institutionMessagesId": {
                    "name": "institutionMessagesId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "customNotificationDetails": {
                    "name": "customNotificationDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Notifications",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "bySender",
                        "fields": [
                            "senderUserId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byRecipient",
                        "fields": [
                            "recipientUserId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byInstitution",
                        "fields": [
                            "institutionMessagesId"
                        ]
                    }
                }
            ]
        },
        "Group": {
            "name": "Group",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "groupNumber": {
                    "name": "groupNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "formationDate": {
                    "name": "formationDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "meetingDay": {
                    "name": "meetingDay",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "meetingFrequency": {
                    "name": "meetingFrequency",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "chairpersonID": {
                    "name": "chairpersonID",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "secretaryID": {
                    "name": "secretaryID",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "viceChairpersonID": {
                    "name": "viceChairpersonID",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "treasurerID": {
                    "name": "treasurerID",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "branch": {
                    "name": "branch",
                    "isArray": false,
                    "type": {
                        "model": "Branch"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "branchGroupsId"
                        ]
                    }
                },
                "members": {
                    "name": "members",
                    "isArray": true,
                    "type": {
                        "model": "Borrower"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "group"
                        ]
                    }
                },
                "loans": {
                    "name": "loans",
                    "isArray": true,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "group"
                        ]
                    }
                },
                "groupSavingsAccount": {
                    "name": "groupSavingsAccount",
                    "isArray": false,
                    "type": {
                        "model": "SavingsAccount"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "HAS_ONE",
                        "associatedWith": [
                            "id"
                        ],
                        "targetNames": [
                            "groupGroupSavingsAccountId"
                        ]
                    }
                },
                "customGroupDetails": {
                    "name": "customGroupDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "branchGroupsId": {
                    "name": "branchGroupsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "groupGroupSavingsAccountId": {
                    "name": "groupGroupSavingsAccountId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Groups",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "SavingsProduct": {
            "name": "SavingsProduct",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "type": {
                    "name": "type",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "interestRate": {
                    "name": "interestRate",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "interestPostingFrequency": {
                    "name": "interestPostingFrequency",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "minBalance": {
                    "name": "minBalance",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "institution": {
                    "name": "institution",
                    "isArray": false,
                    "type": {
                        "model": "Institution"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "institutionSavingsProductsId"
                        ]
                    }
                },
                "savingsAccounts": {
                    "name": "savingsAccounts",
                    "isArray": true,
                    "type": {
                        "model": "SavingsAccount"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "savingsProductSavingsAccountsId"
                        ]
                    }
                },
                "customSavingsProductDetails": {
                    "name": "customSavingsProductDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "institutionSavingsProductsId": {
                    "name": "institutionSavingsProductsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "SavingsProducts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "SavingsAccount": {
            "name": "SavingsAccount",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "accountNumber": {
                    "name": "accountNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "balance": {
                    "name": "balance",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "borrower": {
                    "name": "borrower",
                    "isArray": false,
                    "type": {
                        "model": "Borrower"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "borrowerSavingsAccountsId"
                        ]
                    }
                },
                "savingsProduct": {
                    "name": "savingsProduct",
                    "isArray": false,
                    "type": {
                        "model": "SavingsProduct"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "savingsProductSavingsAccountsId"
                        ]
                    }
                },
                "lockedAmount": {
                    "name": "lockedAmount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "lockedForLoanID": {
                    "name": "lockedForLoanID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "transactions": {
                    "name": "transactions",
                    "isArray": true,
                    "type": {
                        "model": "SavingsTransaction"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "savingsAccountTransactionsId"
                        ]
                    }
                },
                "customSavingsAccountDetails": {
                    "name": "customSavingsAccountDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "borrowerSavingsAccountsId": {
                    "name": "borrowerSavingsAccountsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "savingsProductSavingsAccountsId": {
                    "name": "savingsProductSavingsAccountsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "SavingsAccounts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "SavingsTransaction": {
            "name": "SavingsTransaction",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "amount": {
                    "name": "amount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "type": {
                    "name": "type",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "date": {
                    "name": "date",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "savingsAccount": {
                    "name": "savingsAccount",
                    "isArray": false,
                    "type": {
                        "model": "SavingsAccount"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "savingsAccountTransactionsId"
                        ]
                    }
                },
                "initiatedBy": {
                    "name": "initiatedBy",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "employeeInitiatedSavingsTransactionsId"
                        ]
                    }
                },
                "customSavingsTransactionDetails": {
                    "name": "customSavingsTransactionDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "employeeInitiatedSavingsTransactionsId": {
                    "name": "employeeInitiatedSavingsTransactionsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "savingsAccountTransactionsId": {
                    "name": "savingsAccountTransactionsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "SavingsTransactions",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "ShareAccount": {
            "name": "ShareAccount",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "numberOfShares": {
                    "name": "numberOfShares",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "shareValue": {
                    "name": "shareValue",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "totalValue": {
                    "name": "totalValue",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "borrower": {
                    "name": "borrower",
                    "isArray": false,
                    "type": {
                        "model": "Borrower"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "shareAccountBorrowerId"
                        ]
                    }
                },
                "transactions": {
                    "name": "transactions",
                    "isArray": true,
                    "type": {
                        "model": "ShareTransaction"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "shareAccountTransactionsId"
                        ]
                    }
                },
                "customShareAccountDetails": {
                    "name": "customShareAccountDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "shareAccountBorrowerId": {
                    "name": "shareAccountBorrowerId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "ShareAccounts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "ShareTransaction": {
            "name": "ShareTransaction",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "type": {
                    "name": "type",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "numberOfShares": {
                    "name": "numberOfShares",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "amount": {
                    "name": "amount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "date": {
                    "name": "date",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "shareAccount": {
                    "name": "shareAccount",
                    "isArray": false,
                    "type": {
                        "model": "ShareAccount"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "shareAccountTransactionsId"
                        ]
                    }
                },
                "customShareTransactionDetails": {
                    "name": "customShareTransactionDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "shareAccountTransactionsId": {
                    "name": "shareAccountTransactionsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "ShareTransactions",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "ChartOfAccounts": {
            "name": "ChartOfAccounts",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "code": {
                    "name": "code",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "type": {
                    "name": "type",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "subtype": {
                    "name": "subtype",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "balance": {
                    "name": "balance",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "institution": {
                    "name": "institution",
                    "isArray": false,
                    "type": {
                        "model": "Institution"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "institutionChartOfAccountsId"
                        ]
                    }
                },
                "journalLines": {
                    "name": "journalLines",
                    "isArray": true,
                    "type": {
                        "model": "JournalLine"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "chartOfAccountsJournalLinesId"
                        ]
                    }
                },
                "customChartOfAccountsDetails": {
                    "name": "customChartOfAccountsDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "institutionChartOfAccountsId": {
                    "name": "institutionChartOfAccountsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "ChartOfAccounts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "JournalEntry": {
            "name": "JournalEntry",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "date": {
                    "name": "date",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "reference": {
                    "name": "reference",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "postedBy": {
                    "name": "postedBy",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "employeePostedJournalEntriesId"
                        ]
                    }
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "lines": {
                    "name": "lines",
                    "isArray": true,
                    "type": {
                        "model": "JournalLine"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "journalEntryLinesId"
                        ]
                    }
                },
                "relatedLoanID": {
                    "name": "relatedLoanID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "relatedLoan": {
                    "name": "relatedLoan",
                    "isArray": false,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "relatedLoanID"
                        ]
                    }
                },
                "relatedPaymentID": {
                    "name": "relatedPaymentID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "relatedPayment": {
                    "name": "relatedPayment",
                    "isArray": false,
                    "type": {
                        "model": "Payment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "relatedPaymentID"
                        ]
                    }
                },
                "relatedExpenseID": {
                    "name": "relatedExpenseID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "relatedExpense": {
                    "name": "relatedExpense",
                    "isArray": false,
                    "type": {
                        "model": "Expense"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "relatedExpenseID"
                        ]
                    }
                },
                "customJournalEntryDetails": {
                    "name": "customJournalEntryDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "employeePostedJournalEntriesId": {
                    "name": "employeePostedJournalEntriesId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "JournalEntries",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byRelatedLoanID",
                        "fields": [
                            "relatedLoanID"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byRelatedPaymentID",
                        "fields": [
                            "relatedPaymentID"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byRelatedExpenseID",
                        "fields": [
                            "relatedExpenseID"
                        ]
                    }
                }
            ]
        },
        "JournalLine": {
            "name": "JournalLine",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "journalEntry": {
                    "name": "journalEntry",
                    "isArray": false,
                    "type": {
                        "model": "JournalEntry"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "journalEntryLinesId"
                        ]
                    }
                },
                "chartOfAccounts": {
                    "name": "chartOfAccounts",
                    "isArray": false,
                    "type": {
                        "model": "ChartOfAccounts"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "chartOfAccountsJournalLinesId"
                        ]
                    }
                },
                "debit": {
                    "name": "debit",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "credit": {
                    "name": "credit",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "customJournalLineDetails": {
                    "name": "customJournalLineDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "chartOfAccountsJournalLinesId": {
                    "name": "chartOfAccountsJournalLinesId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "journalEntryLinesId": {
                    "name": "journalEntryLinesId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "JournalLines",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "Meeting": {
            "name": "Meeting",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "title": {
                    "name": "title",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "date": {
                    "name": "date",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "type": {
                    "name": "type",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "minutes": {
                    "name": "minutes",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "attendanceRecord": {
                    "name": "attendanceRecord",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "resolutionsRecord": {
                    "name": "resolutionsRecord",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "customMeetingDetails": {
                    "name": "customMeetingDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Meetings",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "DividendDeclaration": {
            "name": "DividendDeclaration",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "fiscalYear": {
                    "name": "fiscalYear",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "distributableSurplus": {
                    "name": "distributableSurplus",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "dividendRate": {
                    "name": "dividendRate",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "interestRebateRate": {
                    "name": "interestRebateRate",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "institution": {
                    "name": "institution",
                    "isArray": false,
                    "type": {
                        "model": "Institution"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "institutionDividendDeclarationsId"
                        ]
                    }
                },
                "customDividendDeclarationDetails": {
                    "name": "customDividendDeclarationDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "institutionDividendDeclarationsId": {
                    "name": "institutionDividendDeclarationsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "DividendDeclarations",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "Approval": {
            "name": "Approval",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "approvalType": {
                    "name": "approvalType",
                    "isArray": false,
                    "type": {
                        "enum": "ApprovalType"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "recordID": {
                    "name": "recordID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "approvalDate": {
                    "name": "approvalDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "notes": {
                    "name": "notes",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "employee": {
                    "name": "employee",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "employeeApprovalsId"
                        ]
                    }
                },
                "customApprovalDetails": {
                    "name": "customApprovalDetails",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "employeeApprovalsId": {
                    "name": "employeeApprovalsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Approvals",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "AccountBranch": {
            "name": "AccountBranch",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "branchId": {
                    "name": "branchId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "accountId": {
                    "name": "accountId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "branch": {
                    "name": "branch",
                    "isArray": false,
                    "type": {
                        "model": "Branch"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "branchId"
                        ]
                    }
                },
                "account": {
                    "name": "account",
                    "isArray": false,
                    "type": {
                        "model": "Account"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "accountId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "AccountBranches",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byBranch",
                        "fields": [
                            "branchId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byAccount",
                        "fields": [
                            "accountId"
                        ]
                    }
                }
            ]
        },
        "BranchLoanProduct": {
            "name": "BranchLoanProduct",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "branchId": {
                    "name": "branchId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanProductId": {
                    "name": "loanProductId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "branch": {
                    "name": "branch",
                    "isArray": false,
                    "type": {
                        "model": "Branch"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "branchId"
                        ]
                    }
                },
                "loanProduct": {
                    "name": "loanProduct",
                    "isArray": false,
                    "type": {
                        "model": "LoanProduct"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanProductId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "BranchLoanProducts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byBranch",
                        "fields": [
                            "branchId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoanProduct",
                        "fields": [
                            "loanProductId"
                        ]
                    }
                }
            ]
        },
        "BranchLoanFeesConfig": {
            "name": "BranchLoanFeesConfig",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "branchId": {
                    "name": "branchId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFeesConfigId": {
                    "name": "loanFeesConfigId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "branch": {
                    "name": "branch",
                    "isArray": false,
                    "type": {
                        "model": "Branch"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "branchId"
                        ]
                    }
                },
                "loanFeesConfig": {
                    "name": "loanFeesConfig",
                    "isArray": false,
                    "type": {
                        "model": "LoanFeesConfig"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanFeesConfigId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "BranchLoanFeesConfigs",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byBranch",
                        "fields": [
                            "branchId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoanFeesConfig",
                        "fields": [
                            "loanFeesConfigId"
                        ]
                    }
                }
            ]
        },
        "PayrollEmployee": {
            "name": "PayrollEmployee",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "employeeId": {
                    "name": "employeeId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "payrollId": {
                    "name": "payrollId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "employee": {
                    "name": "employee",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "employeeId"
                        ]
                    }
                },
                "payroll": {
                    "name": "payroll",
                    "isArray": false,
                    "type": {
                        "model": "Payroll"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "payrollId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "PayrollEmployees",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byEmployee",
                        "fields": [
                            "employeeId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byPayroll",
                        "fields": [
                            "payrollId"
                        ]
                    }
                }
            ]
        },
        "BorrowerLoanOfficer": {
            "name": "BorrowerLoanOfficer",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "employeeId": {
                    "name": "employeeId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "borrowerId": {
                    "name": "borrowerId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "employee": {
                    "name": "employee",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "employeeId"
                        ]
                    }
                },
                "borrower": {
                    "name": "borrower",
                    "isArray": false,
                    "type": {
                        "model": "Borrower"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "borrowerId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "BorrowerLoanOfficers",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byEmployee",
                        "fields": [
                            "employeeId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byBorrower",
                        "fields": [
                            "borrowerId"
                        ]
                    }
                }
            ]
        },
        "BorrowerDocument": {
            "name": "BorrowerDocument",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "borrowerId": {
                    "name": "borrowerId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "documentId": {
                    "name": "documentId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "borrower": {
                    "name": "borrower",
                    "isArray": false,
                    "type": {
                        "model": "Borrower"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "borrowerId"
                        ]
                    }
                },
                "document": {
                    "name": "document",
                    "isArray": false,
                    "type": {
                        "model": "Document"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "documentId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "BorrowerDocuments",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byBorrower",
                        "fields": [
                            "borrowerId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byDocument",
                        "fields": [
                            "documentId"
                        ]
                    }
                }
            ]
        },
        "LoanGuarantor": {
            "name": "LoanGuarantor",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "guarantorId": {
                    "name": "guarantorId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanId": {
                    "name": "loanId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "guarantor": {
                    "name": "guarantor",
                    "isArray": false,
                    "type": {
                        "model": "Guarantor"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "guarantorId"
                        ]
                    }
                },
                "loan": {
                    "name": "loan",
                    "isArray": false,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "LoanGuarantors",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byGuarantor",
                        "fields": [
                            "guarantorId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoan",
                        "fields": [
                            "loanId"
                        ]
                    }
                }
            ]
        },
        "ApplicationGuarantor": {
            "name": "ApplicationGuarantor",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "guarantorId": {
                    "name": "guarantorId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "applicationId": {
                    "name": "applicationId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "guarantor": {
                    "name": "guarantor",
                    "isArray": false,
                    "type": {
                        "model": "Guarantor"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "guarantorId"
                        ]
                    }
                },
                "application": {
                    "name": "application",
                    "isArray": false,
                    "type": {
                        "model": "Application"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "applicationId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "ApplicationGuarantors",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byGuarantor",
                        "fields": [
                            "guarantorId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byApplication",
                        "fields": [
                            "applicationId"
                        ]
                    }
                }
            ]
        },
        "GuarantorCollateral": {
            "name": "GuarantorCollateral",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "guarantorId": {
                    "name": "guarantorId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "collateralId": {
                    "name": "collateralId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "guarantor": {
                    "name": "guarantor",
                    "isArray": false,
                    "type": {
                        "model": "Guarantor"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "guarantorId"
                        ]
                    }
                },
                "collateral": {
                    "name": "collateral",
                    "isArray": false,
                    "type": {
                        "model": "Collateral"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "collateralId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "GuarantorCollaterals",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byGuarantor",
                        "fields": [
                            "guarantorId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCollateral",
                        "fields": [
                            "collateralId"
                        ]
                    }
                }
            ]
        },
        "LoanProductLoanFees": {
            "name": "LoanProductLoanFees",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "loanProductId": {
                    "name": "loanProductId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFeesId": {
                    "name": "loanFeesId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanProduct": {
                    "name": "loanProduct",
                    "isArray": false,
                    "type": {
                        "model": "LoanProduct"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanProductId"
                        ]
                    }
                },
                "loanFees": {
                    "name": "loanFees",
                    "isArray": false,
                    "type": {
                        "model": "LoanFees"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanFeesId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "LoanProductLoanFees",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoanProduct",
                        "fields": [
                            "loanProductId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoanFees",
                        "fields": [
                            "loanFeesId"
                        ]
                    }
                }
            ]
        },
        "LoanProductLoanFeesConfig": {
            "name": "LoanProductLoanFeesConfig",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "loanProductId": {
                    "name": "loanProductId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFeesConfigId": {
                    "name": "loanFeesConfigId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanProduct": {
                    "name": "loanProduct",
                    "isArray": false,
                    "type": {
                        "model": "LoanProduct"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanProductId"
                        ]
                    }
                },
                "loanFeesConfig": {
                    "name": "loanFeesConfig",
                    "isArray": false,
                    "type": {
                        "model": "LoanFeesConfig"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanFeesConfigId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "LoanProductLoanFeesConfigs",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoanProduct",
                        "fields": [
                            "loanProductId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoanFeesConfig",
                        "fields": [
                            "loanFeesConfigId"
                        ]
                    }
                }
            ]
        },
        "LoanProductPenalty": {
            "name": "LoanProductPenalty",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "loanProductId": {
                    "name": "loanProductId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "penaltyId": {
                    "name": "penaltyId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanProduct": {
                    "name": "loanProduct",
                    "isArray": false,
                    "type": {
                        "model": "LoanProduct"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanProductId"
                        ]
                    }
                },
                "penalty": {
                    "name": "penalty",
                    "isArray": false,
                    "type": {
                        "model": "Penalty"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "penaltyId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "LoanProductPenalties",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoanProduct",
                        "fields": [
                            "loanProductId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byPenalty",
                        "fields": [
                            "penaltyId"
                        ]
                    }
                }
            ]
        },
        "LoanDocument": {
            "name": "LoanDocument",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "documentId": {
                    "name": "documentId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanId": {
                    "name": "loanId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "document": {
                    "name": "document",
                    "isArray": false,
                    "type": {
                        "model": "Document"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "documentId"
                        ]
                    }
                },
                "loan": {
                    "name": "loan",
                    "isArray": false,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "LoanDocuments",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byDocument",
                        "fields": [
                            "documentId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoan",
                        "fields": [
                            "loanId"
                        ]
                    }
                }
            ]
        },
        "ApplicationDocument": {
            "name": "ApplicationDocument",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "documentId": {
                    "name": "documentId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "applicationId": {
                    "name": "applicationId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "document": {
                    "name": "document",
                    "isArray": false,
                    "type": {
                        "model": "Document"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "documentId"
                        ]
                    }
                },
                "application": {
                    "name": "application",
                    "isArray": false,
                    "type": {
                        "model": "Application"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "applicationId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "ApplicationDocuments",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byDocument",
                        "fields": [
                            "documentId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byApplication",
                        "fields": [
                            "applicationId"
                        ]
                    }
                }
            ]
        },
        "ContractDocument": {
            "name": "ContractDocument",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "documentId": {
                    "name": "documentId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "contractId": {
                    "name": "contractId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "document": {
                    "name": "document",
                    "isArray": false,
                    "type": {
                        "model": "Document"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "documentId"
                        ]
                    }
                },
                "contract": {
                    "name": "contract",
                    "isArray": false,
                    "type": {
                        "model": "Contract"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "contractId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "ContractDocuments",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byDocument",
                        "fields": [
                            "documentId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byContract",
                        "fields": [
                            "contractId"
                        ]
                    }
                }
            ]
        },
        "ExpenseDocument": {
            "name": "ExpenseDocument",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "documentId": {
                    "name": "documentId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "expenseId": {
                    "name": "expenseId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "document": {
                    "name": "document",
                    "isArray": false,
                    "type": {
                        "model": "Document"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "documentId"
                        ]
                    }
                },
                "expense": {
                    "name": "expense",
                    "isArray": false,
                    "type": {
                        "model": "Expense"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "expenseId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "ExpenseDocuments",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byDocument",
                        "fields": [
                            "documentId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byExpense",
                        "fields": [
                            "expenseId"
                        ]
                    }
                }
            ]
        },
        "PaymentDocument": {
            "name": "PaymentDocument",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "documentId": {
                    "name": "documentId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "paymentId": {
                    "name": "paymentId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "document": {
                    "name": "document",
                    "isArray": false,
                    "type": {
                        "model": "Document"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "documentId"
                        ]
                    }
                },
                "payment": {
                    "name": "payment",
                    "isArray": false,
                    "type": {
                        "model": "Payment"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "paymentId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "PaymentDocuments",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byDocument",
                        "fields": [
                            "documentId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byPayment",
                        "fields": [
                            "paymentId"
                        ]
                    }
                }
            ]
        },
        "MoneyTransactionDocument": {
            "name": "MoneyTransactionDocument",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "documentId": {
                    "name": "documentId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "moneyTransactionId": {
                    "name": "moneyTransactionId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "document": {
                    "name": "document",
                    "isArray": false,
                    "type": {
                        "model": "Document"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "documentId"
                        ]
                    }
                },
                "moneyTransaction": {
                    "name": "moneyTransaction",
                    "isArray": false,
                    "type": {
                        "model": "MoneyTransaction"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "moneyTransactionId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "MoneyTransactionDocuments",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byDocument",
                        "fields": [
                            "documentId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byMoneyTransaction",
                        "fields": [
                            "moneyTransactionId"
                        ]
                    }
                }
            ]
        },
        "ApplicationContract": {
            "name": "ApplicationContract",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "contractId": {
                    "name": "contractId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "applicationId": {
                    "name": "applicationId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "contract": {
                    "name": "contract",
                    "isArray": false,
                    "type": {
                        "model": "Contract"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "contractId"
                        ]
                    }
                },
                "application": {
                    "name": "application",
                    "isArray": false,
                    "type": {
                        "model": "Application"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "applicationId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "ApplicationContracts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byContract",
                        "fields": [
                            "contractId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byApplication",
                        "fields": [
                            "applicationId"
                        ]
                    }
                }
            ]
        },
        "CollateralContract": {
            "name": "CollateralContract",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "contractId": {
                    "name": "contractId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "collateralId": {
                    "name": "collateralId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "contract": {
                    "name": "contract",
                    "isArray": false,
                    "type": {
                        "model": "Contract"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "contractId"
                        ]
                    }
                },
                "collateral": {
                    "name": "collateral",
                    "isArray": false,
                    "type": {
                        "model": "Collateral"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "collateralId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "CollateralContracts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byContract",
                        "fields": [
                            "contractId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCollateral",
                        "fields": [
                            "collateralId"
                        ]
                    }
                }
            ]
        },
        "LoanContract": {
            "name": "LoanContract",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "contractId": {
                    "name": "contractId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanId": {
                    "name": "loanId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "contract": {
                    "name": "contract",
                    "isArray": false,
                    "type": {
                        "model": "Contract"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "contractId"
                        ]
                    }
                },
                "loan": {
                    "name": "loan",
                    "isArray": false,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "LoanContracts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byContract",
                        "fields": [
                            "contractId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoan",
                        "fields": [
                            "loanId"
                        ]
                    }
                }
            ]
        },
        "ApplicationCollateral": {
            "name": "ApplicationCollateral",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "applicationId": {
                    "name": "applicationId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "collateralId": {
                    "name": "collateralId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "application": {
                    "name": "application",
                    "isArray": false,
                    "type": {
                        "model": "Application"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "applicationId"
                        ]
                    }
                },
                "collateral": {
                    "name": "collateral",
                    "isArray": false,
                    "type": {
                        "model": "Collateral"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "collateralId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "ApplicationCollaterals",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byApplication",
                        "fields": [
                            "applicationId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCollateral",
                        "fields": [
                            "collateralId"
                        ]
                    }
                }
            ]
        },
        "ApplicationExpense": {
            "name": "ApplicationExpense",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "applicationId": {
                    "name": "applicationId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "expenseId": {
                    "name": "expenseId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "application": {
                    "name": "application",
                    "isArray": false,
                    "type": {
                        "model": "Application"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "applicationId"
                        ]
                    }
                },
                "expense": {
                    "name": "expense",
                    "isArray": false,
                    "type": {
                        "model": "Expense"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "expenseId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "ApplicationExpenses",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byApplication",
                        "fields": [
                            "applicationId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byExpense",
                        "fields": [
                            "expenseId"
                        ]
                    }
                }
            ]
        },
        "LoanApplication": {
            "name": "LoanApplication",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "applicationId": {
                    "name": "applicationId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanId": {
                    "name": "loanId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "application": {
                    "name": "application",
                    "isArray": false,
                    "type": {
                        "model": "Application"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "applicationId"
                        ]
                    }
                },
                "loan": {
                    "name": "loan",
                    "isArray": false,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "LoanApplications",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byApplication",
                        "fields": [
                            "applicationId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoan",
                        "fields": [
                            "loanId"
                        ]
                    }
                }
            ]
        },
        "LoanCollateral": {
            "name": "LoanCollateral",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "collateralId": {
                    "name": "collateralId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanId": {
                    "name": "loanId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "collateral": {
                    "name": "collateral",
                    "isArray": false,
                    "type": {
                        "model": "Collateral"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "collateralId"
                        ]
                    }
                },
                "loan": {
                    "name": "loan",
                    "isArray": false,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "LoanCollaterals",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCollateral",
                        "fields": [
                            "collateralId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoan",
                        "fields": [
                            "loanId"
                        ]
                    }
                }
            ]
        },
        "LoanAccount": {
            "name": "LoanAccount",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "loanId": {
                    "name": "loanId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "accountId": {
                    "name": "accountId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loan": {
                    "name": "loan",
                    "isArray": false,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanId"
                        ]
                    }
                },
                "account": {
                    "name": "account",
                    "isArray": false,
                    "type": {
                        "model": "Account"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "accountId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "LoanAccounts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoan",
                        "fields": [
                            "loanId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byAccount",
                        "fields": [
                            "accountId"
                        ]
                    }
                }
            ]
        },
        "LoanExpense": {
            "name": "LoanExpense",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "loanId": {
                    "name": "loanId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "expenseId": {
                    "name": "expenseId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loan": {
                    "name": "loan",
                    "isArray": false,
                    "type": {
                        "model": "Loan"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanId"
                        ]
                    }
                },
                "expense": {
                    "name": "expense",
                    "isArray": false,
                    "type": {
                        "model": "Expense"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "expenseId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "LoanExpenses",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoan",
                        "fields": [
                            "loanId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byExpense",
                        "fields": [
                            "expenseId"
                        ]
                    }
                }
            ]
        },
        "InvestmentAccount": {
            "name": "InvestmentAccount",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "investmentId": {
                    "name": "investmentId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "accountId": {
                    "name": "accountId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "investment": {
                    "name": "investment",
                    "isArray": false,
                    "type": {
                        "model": "Investment"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "investmentId"
                        ]
                    }
                },
                "account": {
                    "name": "account",
                    "isArray": false,
                    "type": {
                        "model": "Account"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "accountId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "InvestmentAccounts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byInvestment",
                        "fields": [
                            "investmentId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byAccount",
                        "fields": [
                            "accountId"
                        ]
                    }
                }
            ]
        },
        "LoanFeesLoanFeesConfig": {
            "name": "LoanFeesLoanFeesConfig",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "loanFeesId": {
                    "name": "loanFeesId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFeesConfigId": {
                    "name": "loanFeesConfigId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "loanFees": {
                    "name": "loanFees",
                    "isArray": false,
                    "type": {
                        "model": "LoanFees"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanFeesId"
                        ]
                    }
                },
                "loanFeesConfig": {
                    "name": "loanFeesConfig",
                    "isArray": false,
                    "type": {
                        "model": "LoanFeesConfig"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "loanFeesConfigId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "LoanFeesLoanFeesConfigs",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoanFees",
                        "fields": [
                            "loanFeesId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byLoanFeesConfig",
                        "fields": [
                            "loanFeesConfigId"
                        ]
                    }
                }
            ]
        },
        "OtherIncomeAccount": {
            "name": "OtherIncomeAccount",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "accountId": {
                    "name": "accountId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "otherIncomeId": {
                    "name": "otherIncomeId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "account": {
                    "name": "account",
                    "isArray": false,
                    "type": {
                        "model": "Account"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "accountId"
                        ]
                    }
                },
                "otherIncome": {
                    "name": "otherIncome",
                    "isArray": false,
                    "type": {
                        "model": "OtherIncome"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "otherIncomeId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "OtherIncomeAccounts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byAccount",
                        "fields": [
                            "accountId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byOtherIncome",
                        "fields": [
                            "otherIncomeId"
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "InterestCalculationMethod": {
            "name": "InterestCalculationMethod",
            "values": [
                "SIMPLE",
                "COMPOUND",
                "FLAT"
            ]
        },
        "Frequency": {
            "name": "Frequency",
            "values": [
                "DAILY",
                "WEEKLY",
                "BIWEEKLY",
                "MONTHLY",
                "QUARTERLY",
                "SEMIANNUALLY",
                "ANNUALLY"
            ]
        },
        "LoanStatus": {
            "name": "LoanStatus",
            "values": [
                "DRAFT",
                "APPROVED",
                "ACTIVE",
                "CLOSED",
                "WRITTEN_OFF",
                "VOIDED"
            ]
        },
        "LoanApprovalStatus": {
            "name": "LoanApprovalStatus",
            "values": [
                "PENDING",
                "APPROVED",
                "REJECTED"
            ]
        },
        "DisbursementStatus": {
            "name": "DisbursementStatus",
            "values": [
                "PENDING",
                "COMPLETED",
                "FAILED"
            ]
        },
        "PaymentStatus": {
            "name": "PaymentStatus",
            "values": [
                "PENDING",
                "COMPLETED",
                "REVERSED",
                "FAILED"
            ]
        },
        "LoanEventType": {
            "name": "LoanEventType",
            "values": [
                "CREATED",
                "APPROVED",
                "DISBURSED",
                "PAYMENT_POSTED",
                "PAYMENT_REVERSED",
                "STATUS_CHANGED",
                "OTHER"
            ]
        },
        "ApprovalType": {
            "name": "ApprovalType",
            "values": [
                "LOAN",
                "EXPENSE",
                "APPLICATION",
                "CREDIT_SCORE",
                "MONEY_TRANSACTION",
                "PAYMENT"
            ]
        }
    },
    "nonModels": {},
    "codegenVersion": "3.4.4",
    "version": "7c9a70499e521b2dd978d7be24e69001"
};