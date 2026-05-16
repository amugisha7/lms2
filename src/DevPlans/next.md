- Create loans form. Also create from loan product.
  - Resume:
    - Fix the closing balance on loan schedules and statements.
    - Deploy reports.
      - Work on Profitability Report with Income Statement and Balance Sheet.
      - Work on the Transactions sheet to replace Shammy's excel.
    - Work on Portfolio page to function as dashboard of app.
    - Check validity of loan statements; add loan balance to statement.
    - What happens if a customer logs in on the main portal?

    Put the contracts, collateral and gurantors, other incomes and expenses as tabs on loan drafts and loans.
    i Enable loan contracts
    i Enable loan collateral
    i Enable gurantors

  - Test out creating draft from useLoanProduct.
  - review how draft creation and copying to new loan works.
  - Create loan from loan schedule. Ensure loan calculations are accurate.
  - Ensure that disabling a customer locks them out of the portal.

- Finish the loan module then return to the begining via the Loan Progress gdoc
- Implement security using branchId so that copying a URL of a loan or User doesn't allow someone logged into a different branch to view the details.
  - You can do this by returning the branch id in api calls and comparing it with the local branch id. This means the admin has to have a branch loaded to use the URL route.
- Upon login, redirect to tutorials with option of go to platform.
- Identify which functionality is core for admin to view all branches.
- redo the side menu similar to Khoros with slide out arrow pointer in the center.
