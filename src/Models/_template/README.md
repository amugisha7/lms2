# Simplified Model Architecture

This is a much simpler, more maintainable approach to creating CRUD models without the complexity of the `CollectionsTemplate`.

## Why This Approach is Better

### ❌ Problems with CollectionsTemplate:

- **Over-engineered**: 25+ props making it complex and hard to understand
- **Tight coupling**: Combines data grid, dialogs, search, and state management in one component
- **Complex prop drilling**: Many props passed through multiple layers
- **Duplicate logic**: Models still need custom logic despite using the template
- **Hard to customize**: Adding model-specific features requires modifying the template
- **Poor separation of concerns**: UI, business logic, and data fetching mixed together

### ✅ Benefits of Simplified Approach:

- **Clear separation of concerns**: Each component has a single responsibility
- **Easy to understand**: Standard React patterns, no complex abstractions
- **Easy to customize**: Add model-specific logic without affecting other models
- **Better maintainability**: Changes to one model don't affect others
- **Faster development**: Copy template, modify specific parts, done!
- **Better debugging**: Clear data flow, easier to trace issues

## File Structure

```
src/Models/
├── _template/
│   ├── YourModelTemplate.jsx      # Copy this for new models
│   └── yourModelQueries.js        # Copy this for GraphQL queries
├── Borrowers/
│   ├── SimplifiedBorrowers.jsx    # Example implementation
│   ├── borrowerQueries.js         # GraphQL queries
│   ├── CreateBorrower/
│   └── BorrowerManagement.jsx     # Detail view
└── YourNewModel/                  # New model following the pattern
    ├── YourNewModels.jsx          # Main list component
    ├── yourNewModelQueries.js     # GraphQL queries
    ├── CreateYourNewModel/
    └── YourNewModelManagement.jsx # Detail view
```

## How to Create a New Model

### Step 1: Copy Template Files

```bash
# Copy the template folder
cp -r src/Models/_template src/Models/YourNewModel

# Rename the files
mv src/Models/YourNewModel/YourModelTemplate.jsx src/Models/YourNewModel/YourNewModels.jsx
mv src/Models/YourNewModel/yourModelQueries.js src/Models/YourNewModel/yourNewModelQueries.js
```

### Step 2: Replace Placeholders

In `YourNewModels.jsx`, replace:

- `YourModel` → `YourNewModel` (e.g., `Loan`, `Branch`)
- `YOUR_LIST_QUERY` → your actual query name
- `listYourModels` → your actual query result path
- Update the columns configuration
- Update the display name logic

In `yourNewModelQueries.js`, replace:

- `YourModel` → `YourNewModel`
- Add your actual model fields

### Step 3: Create Form Component

Create a form component (e.g., `CreateYourNewModel.jsx`) following the same pattern as `CreateBorrower.jsx`.

### Step 4: Add to Routes

Add your new model to the routing configuration.

## Example: Creating a "Loans" Model

1. **Copy template:**

   ```bash
   cp -r src/Models/_template src/Models/Loans
   mv src/Models/Loans/YourModelTemplate.jsx src/Models/Loans/Loans.jsx
   mv src/Models/Loans/yourModelQueries.js src/Models/Loans/loanQueries.js
   ```

2. **Update Loans.jsx:**

   ```jsx
   // Replace imports
   import {
     LIST_LOANS_QUERY,
     CREATE_LOAN_MUTATION,
     UPDATE_LOAN_MUTATION,
     DELETE_LOAN_MUTATION,
   } from "./loanQueries";
   import CreateLoan from "./CreateLoan/CreateLoan";

   // Update queries
   query: LIST_LOANS_QUERY,
     result?.data?.listLoans?.items || [],
     result?.data?.listLoans?.nextToken;

   // Update display logic
   const getLoanDisplayName = (loan) => {
     return `${loan.loanNumber} - ${loan.borrowerName}`;
   };

   // Update columns
   const columns = [
     {
       field: "loanNumber",
       headerName: "Loan Number",
       width: 150,
     },
     {
       field: "amount",
       headerName: "Amount",
       width: 120,
       renderCell: (params) => `$${params.value?.toLocaleString()}`,
     },
     // ... more columns
   ];
   ```

3. **Update loanQueries.js:**
   ```jsx
   export const LIST_LOANS_QUERY = `
     query ListLoans($branchId: ID!, $nextToken: String) {
       listLoans(
         filter: { branchLoansId: { eq: $branchId } }
         limit: 100
         nextToken: $nextToken
       ) {
         items {
           id
           loanNumber
           amount
           interestRate
           borrowerId
           # ... other fields
         }
         nextToken
       }
     }
   `;
   ```

## Component Responsibilities

### Main List Component (e.g., `Loans.jsx`)

- Fetch and display data
- Handle CRUD operations
- Manage dialog states
- Show notifications

### Form Component (e.g., `CreateLoan.jsx`)

- Handle form validation
- Process form submission
- Manage form state

### Queries File (e.g., `loanQueries.js`)

- Define all GraphQL operations
- Keep queries organized and reusable

### Management Component (e.g., `LoanManagement.jsx`)

- Handle detail view
- Show related data (tabs, etc.)
- Handle detail-specific actions

## Reusable Components Used

- `CustomDataGrid`: Styled data grid with search and export
- `CustomSlider`: Modal dialog component
- `DeleteDialog`: Confirmation dialog for deletions
- `NotificationBar`: Toast notifications
- `ClickableText`: Styled clickable text elements

## Best Practices

1. **Keep it simple**: Don't over-abstract unless you have 3+ identical use cases
2. **Single responsibility**: Each component should have one clear purpose
3. **Clear naming**: Use descriptive names that reflect the model
4. **Consistent patterns**: Follow the same structure across all models
5. **Error handling**: Always handle loading states and errors
6. **Type safety**: Consider adding TypeScript for better development experience

## Migration from CollectionsTemplate

To migrate existing models:

1. Copy the template
2. Move your GraphQL queries to the queries file
3. Move your form component logic
4. Update the columns configuration
5. Test thoroughly
6. Remove CollectionsTemplate dependencies

This approach gives you much more control and clarity while maintaining consistency across your application.
