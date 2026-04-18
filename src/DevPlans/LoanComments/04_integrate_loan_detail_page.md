# Prompt 4: Integrate Loan Comments Tab into LoanDetailPage

## Context

You are adding a "Comments" tab to the existing `LoanDetailPage.jsx`. Currently the page has two tabs: **Details** (index 0) and **Files** (index 1). You will add **Comments** as tab index 2. The `LoanComments` component has already been created at `src/Models/Loans/LoanComments/LoanComments.jsx`.

## File to Modify: `src/Models/Loans/LoanDetailPage.jsx`

### Changes Required

#### 1. Add Import

Add this import near the other loan sub-feature imports (near the `LoanFiles` import, around line 17):

```js
import LoanComments from "./LoanComments/LoanComments";
```

#### 2. Add the Tab

Find the `<Tabs>` component that contains:

```jsx
<Tab label="Details" id="loan-tab-0" />
<Tab label="Files" id="loan-tab-1" />
```

Add a third tab after "Files":

```jsx
<Tab label="Comments" id="loan-tab-2" />
```

#### 3. Add the TabPanel

Find the Files TabPanel:

```jsx
{
  /* Files Tab */
}
<TabPanel value={tabValue} index={1}>
  <LoanFiles
    loan={loan}
    setNotification={(n) =>
      setNotification({
        type: n.color === "green" ? "success" : "error",
        message: n.message,
      })
    }
  />
</TabPanel>;
```

Add a new TabPanel immediately after it (before the closing `</Box>` of the tabs container):

```jsx
{
  /* Comments Tab */
}
<TabPanel value={tabValue} index={2}>
  <LoanComments
    loan={loan}
    setNotification={(n) =>
      setNotification({
        type: n.color === "green" ? "success" : "error",
        message: n.message,
      })
    }
  />
</TabPanel>;
```

### Summary of Exact Edits

**Edit 1 — Import** (add after the LoanFiles import line):

```diff
 import LoanFiles from "./LoanFiles/LoanFiles";
+import LoanComments from "./LoanComments/LoanComments";
 import LoanStatementPopup from "./LoanStatements/LoanStatementPopup";
```

**Edit 2 — Tab label** (add after the Files tab):

```diff
               <Tab label="Details" id="loan-tab-0" />
               <Tab label="Files" id="loan-tab-1" />
+              <Tab label="Comments" id="loan-tab-2" />
             </Tabs>
```

**Edit 3 — TabPanel** (add after the Files TabPanel):

```diff
           {/* Files Tab */}
           <TabPanel value={tabValue} index={1}>
             <LoanFiles
               loan={loan}
               setNotification={(n) =>
                 setNotification({
                   type: n.color === "green" ? "success" : "error",
                   message: n.message,
                 })
               }
             />
           </TabPanel>
+
+          {/* Comments Tab */}
+          <TabPanel value={tabValue} index={2}>
+            <LoanComments
+              loan={loan}
+              setNotification={(n) =>
+                setNotification({
+                  type: n.color === "green" ? "success" : "error",
+                  message: n.message,
+                })
+              }
+            />
+          </TabPanel>
         </Box>
```

## Verification

After making these changes:

1. Navigate to any loan detail page (e.g., `/loans/:loanId`)
2. Confirm three tabs appear: **Details**, **Files**, **Comments**
3. Click **Comments** tab — it should render the `LoanComments` component
4. The Details and Files tabs should continue to work exactly as before
5. No console errors on tab switching
