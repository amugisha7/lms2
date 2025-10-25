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
                        "model": "Account"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "branchAccountsId"
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
                "approvedLoans": {
                    "name": "approvedLoans",
                    "isArray": true,
                    "type": {
                        "model": "LoanApprovedByEmployee"
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
                "approvedExpenses": {
                    "name": "approvedExpenses",
                    "isArray": true,
                    "type": {
                        "model": "ExpenseApprovedByEmployee"
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
                "approvedApplications": {
                    "name": "approvedApplications",
                    "isArray": true,
                    "type": {
                        "model": "ApplicationApprovedByEmployee"
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
                "approvedCreditScores": {
                    "name": "approvedCreditScores",
                    "isArray": true,
                    "type": {
                        "model": "CreditScoreApprovedByEmployee"
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
                "approvedMoneyTransactions": {
                    "name": "approvedMoneyTransactions",
                    "isArray": true,
                    "type": {
                        "model": "MoneyTransactionApprovedByEmployee"
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
                "approvedPayments": {
                    "name": "approvedPayments",
                    "isArray": true,
                    "type": {
                        "model": "PaymentApprovedByEmployee"
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
                            "borrowerLoansId"
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
                }
            },
            "syncable": true,
            "pluralName": "Borrowers",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
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
                "approvedByEmployees": {
                    "name": "approvedByEmployees",
                    "isArray": true,
                    "type": {
                        "model": "CreditScoreApprovedByEmployee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "creditScore"
                        ]
                    }
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
                "approvedByEmployees": {
                    "name": "approvedByEmployees",
                    "isArray": true,
                    "type": {
                        "model": "ApplicationApprovedByEmployee"
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
                "loanStatus": {
                    "name": "loanStatus",
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
                            "borrowerLoansId"
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
                            "loanPaymentsId"
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
                "approvedByEmployees": {
                    "name": "approvedByEmployees",
                    "isArray": true,
                    "type": {
                        "model": "LoanApprovedByEmployee"
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
                "borrowerLoansId": {
                    "name": "borrowerLoansId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
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
                            "branchAccountsId"
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
                "branchAccountsId": {
                    "name": "branchAccountsId",
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
                "approvedByEmployees": {
                    "name": "approvedByEmployees",
                    "isArray": true,
                    "type": {
                        "model": "MoneyTransactionApprovedByEmployee"
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
                "notes": {
                    "name": "notes",
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
                            "loanPaymentsId"
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
                "approvedByEmployees": {
                    "name": "approvedByEmployees",
                    "isArray": true,
                    "type": {
                        "model": "PaymentApprovedByEmployee"
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
                "loanPaymentsId": {
                    "name": "loanPaymentsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
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
                "approvedByEmployees": {
                    "name": "approvedByEmployees",
                    "isArray": true,
                    "type": {
                        "model": "ExpenseApprovedByEmployee"
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
        "LoanApprovedByEmployee": {
            "name": "LoanApprovedByEmployee",
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
                "loanId": {
                    "name": "loanId",
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
            "pluralName": "LoanApprovedByEmployees",
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
                        "name": "byLoan",
                        "fields": [
                            "loanId"
                        ]
                    }
                }
            ]
        },
        "ExpenseApprovedByEmployee": {
            "name": "ExpenseApprovedByEmployee",
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
                "expenseId": {
                    "name": "expenseId",
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
            "pluralName": "ExpenseApprovedByEmployees",
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
                        "name": "byExpense",
                        "fields": [
                            "expenseId"
                        ]
                    }
                }
            ]
        },
        "ApplicationApprovedByEmployee": {
            "name": "ApplicationApprovedByEmployee",
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
                "applicationId": {
                    "name": "applicationId",
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
            "pluralName": "ApplicationApprovedByEmployees",
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
                        "name": "byApplication",
                        "fields": [
                            "applicationId"
                        ]
                    }
                }
            ]
        },
        "CreditScoreApprovedByEmployee": {
            "name": "CreditScoreApprovedByEmployee",
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
                "creditScoreId": {
                    "name": "creditScoreId",
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
                "creditScore": {
                    "name": "creditScore",
                    "isArray": false,
                    "type": {
                        "model": "CreditScore"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetNames": [
                            "creditScoreId"
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
            "pluralName": "CreditScoreApprovedByEmployees",
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
                        "name": "byCreditScore",
                        "fields": [
                            "creditScoreId"
                        ]
                    }
                }
            ]
        },
        "MoneyTransactionApprovedByEmployee": {
            "name": "MoneyTransactionApprovedByEmployee",
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
                "moneyTransactionId": {
                    "name": "moneyTransactionId",
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
            "pluralName": "MoneyTransactionApprovedByEmployees",
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
                        "name": "byMoneyTransaction",
                        "fields": [
                            "moneyTransactionId"
                        ]
                    }
                }
            ]
        },
        "PaymentApprovedByEmployee": {
            "name": "PaymentApprovedByEmployee",
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
                "paymentId": {
                    "name": "paymentId",
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
            "pluralName": "PaymentApprovedByEmployees",
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
                        "name": "byPayment",
                        "fields": [
                            "paymentId"
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
        }
    },
    "nonModels": {},
    "codegenVersion": "3.4.4",
    "version": "cfc3af6272c8925b84c8b7130e045c27"
};