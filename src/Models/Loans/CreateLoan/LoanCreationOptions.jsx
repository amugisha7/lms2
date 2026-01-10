import React, { useState, useContext, useEffect, useRef } from "react";
import { Box, Tabs, Tab, Typography, useTheme, Grid } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateLoan from "./CreateLoan";
import UseLoanProduct from "./UseLoanProduct";
import { UserContext } from "../../../App";
import { fetchBorrowers, fetchLoanProducts } from "./createLoanHelpers";
import DropDownSearchable from "../../../Resources/FormComponents/DropDownSearchable";
import { getLoanDraftById } from "../LoanDrafts/loanDraftHelpers";

export default function LoanCreationOptions(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const [tabValue, setTabValue] = useState(0);
  const { userDetails } = useContext(UserContext);
  const [borrowers, setBorrowers] = useState([]);
  const [borrowersLoading, setBorrowersLoading] = useState(true);
  const [loanProducts, setLoanProducts] = useState([]);
  const [loanProductsLoading, setLoanProductsLoading] = useState(true);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [loadingDraft, setLoadingDraft] = useState(!!draftId);
  const borrowersFetchedRef = useRef(false);
  const loanProductsFetchedRef = useRef(null); // store last fetched branch id

  useEffect(() => {
    const loadBorrowers = async () => {
      if (!userDetails?.branchUsersId) {
        setBorrowersLoading(false);
        return;
      }

      if (borrowersFetchedRef.current) {
        setBorrowersLoading(false);
        return;
      }

      try {
        const borrowersList = await fetchBorrowers(userDetails.branchUsersId);
        setBorrowers(borrowersList);
        borrowersFetchedRef.current = true;
        // If a borrower was passed as prop, set it as selected
        if (props.borrower) {
          setSelectedBorrower(props.borrower);
        }
      } catch (err) {
        console.error("Error loading borrowers:", err);
      } finally {
        setBorrowersLoading(false);
      }
    };

    loadBorrowers();
  }, [userDetails?.branchUsersId, props.borrower]);

  // Load draft if draftId is in URL
  useEffect(() => {
    const loadDraft = async () => {
      if (!draftId || !borrowers.length) return;

      try {
        setLoadingDraft(true);
        const draft = await getLoanDraftById(draftId);
        if (draft && draft.borrowerID) {
          const borrower = borrowers.find((b) => b.id === draft.borrowerID);
          if (borrower) {
            setSelectedBorrower(borrower);
          }
        }
      } catch (err) {
        console.error("Error loading draft:", err);
      } finally {
        setLoadingDraft(false);
      }
    };

    loadDraft();
  }, [draftId, borrowers]);

  useEffect(() => {
    const loadLoanProducts = async () => {
      // Require both institution and branch to determine branch-scoped products
      if (!userDetails?.institutionUsersId || !userDetails?.branchUsersId) {
        setLoanProductsLoading(false);
        return;
      }

      // If we've already fetched for this branch, skip
      if (loanProductsFetchedRef.current === userDetails.branchUsersId) {
        setLoanProductsLoading(false);
        return;
      }

      try {
        const productsList = await fetchLoanProducts(
          userDetails.institutionUsersId,
          userDetails.branchUsersId
        );
        setLoanProducts(productsList);
        loanProductsFetchedRef.current = userDetails.branchUsersId;
      } catch (err) {
        console.error("Error loading loan products:", err);
      } finally {
        setLoanProductsLoading(false);
      }
    };

    loadLoanProducts();
  }, [userDetails?.institutionUsersId, userDetails?.branchUsersId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreateSuccess = (createdLoan) => {
    if (props.onCreateSuccess) {
      props.onCreateSuccess(createdLoan);
    }
    // Create Loan flow now creates/updates a LoanDraft.
    if (createdLoan?.id) {
      navigate(`/admin/loan-drafts/id/${createdLoan.id}/view`);
      return;
    }
    navigate("/admin/loan-drafts");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Create a new Loan
      </Typography>
      {!borrowersLoading && borrowers.length === 0 && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: 1,
          }}
        >
          <Typography variant="body1" sx={{ color: "#856404" }}>
            No borrowers found in the system.{" "}
            <a
              href="/borrowers"
              style={{
                color: "#0056b3",
                fontWeight: 600,
                textDecoration: "underline",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#003d82")}
              onMouseLeave={(e) => (e.target.style.color = "#0056b3")}
            >
              Add a borrower
            </a>{" "}
            before creating a loan.
          </Typography>
        </Box>
      )}
      {borrowers.length > 0 && (
        <>
          <Box sx={{ width: "100%", mb: 2 }}>
            <DropDownSearchable
              label="Select Borrower"
              name="borrower"
              placeholder="type to search borrowers..."
              required={true}
              options={borrowers.map((borrower) => ({
                value: borrower.id,
                label:
                  `${borrower.firstname || ""} ${borrower.othername || ""} ${
                    borrower.businessName || ""
                  }`.trim() || borrower.uniqueIdNumber,
              }))}
              value={selectedBorrower?.id || ""}
              onChange={(e) => {
                const selectedId = e.target.value;
                const borrower = borrowers.find((b) => b.id === selectedId);
                setSelectedBorrower(borrower || null);
              }}
              helperText="Choose a borrower for the loan."
            />
          </Box>
          <Box sx={{ width: "100%", mb: 2 }}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.paper,
                opacity: selectedBorrower ? 1 : 0.5,
                pointerEvents: selectedBorrower ? "auto" : "none",
                // borderRadius: "8px 8px 0 0",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="loan creation options tabs"
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                disabled={!selectedBorrower}
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: theme.palette.blueText.main,
                    height: 3,
                    borderRadius: "1.5px",
                  },
                  "& .MuiTab-root": {
                    fontFamily: theme.typography.fontFamily,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textTransform: "none",
                    letterSpacing: "0.02em",
                    color: theme.palette.text.secondary,
                    minHeight: 48,
                    padding: "12px 24px",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      color: theme.palette.blueText.main,
                    },
                    "&.Mui-selected": {
                      color: theme.palette.blueText.main,
                      fontWeight: 600,
                    },
                    "&.Mui-focusVisible": {
                      backgroundColor: theme.palette.action.focus,
                    },
                  },
                  "& .MuiTabs-flexContainer": {
                    gap: 1,
                  },
                }}
              >
                <Tab label="Use Blank Form" />
                <Tab label="Use Loan Product Template" />
              </Tabs>
            </Box>
          </Box>

          {!selectedBorrower && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                backgroundColor: "#e3f2fd",
                border: "1px solid #2196f3",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" sx={{ color: "#1565c0" }}>
                Please select a borrower above to proceed with creating a loan.
              </Typography>
            </Box>
          )}

          {selectedBorrower && tabValue === 0 && (
            <CreateLoan
              {...props}
              onCreateSuccess={handleCreateSuccess}
              borrowers={borrowers}
              borrowersLoading={borrowersLoading}
              borrower={selectedBorrower}
              draftId={draftId}
            />
          )}
          {selectedBorrower && tabValue === 1 && (
            <UseLoanProduct
              {...props}
              onCreateSuccess={handleCreateSuccess}
              borrowers={borrowers}
              borrowersLoading={borrowersLoading}
              borrower={selectedBorrower}
              loanProducts={loanProducts}
              loanProductsLoading={loanProductsLoading}
              draftId={draftId}
            />
          )}
        </>
      )}
    </Box>
  );
}
