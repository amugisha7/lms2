import React from "react";
import { generateClient } from "aws-amplify/api";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { UserContext } from "../../App";
import CustomDataGrid from "../../ModelAssets/CustomDataGrid";
import ClickableText from "../../ModelAssets/ClickableText";
import PlusButtonMain from "../../ModelAssets/PlusButtonMain";

export default function LoanProducts() {
  const [loanProducts, setLoanProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search] = React.useState("");
  const { userDetails } = React.useContext(UserContext);
  const navigate = useNavigate();
  const lastBranchIdRef = React.useRef();

  React.useEffect(() => {
    console.log("LoanProducts useEffect triggered");
    console.log("userDetails:", userDetails);
    console.log("userDetails?.branchUsersId:", userDetails?.branchUsersId);
    console.log("lastBranchIdRef.current:", lastBranchIdRef.current);

    const fetchLoanProducts = async () => {
      console.log("fetchLoanProducts called");
      setLoading(true);
      try {
        const client = generateClient();
        if (!userDetails?.branchUsersId) {
          console.log("No branchUsersId, returning early");
          setLoanProducts([]);
          setLoading(false);
          return;
        }

        let allLoanProducts = [];
        let nextToken = null;

        do {
          const result = await client.graphql({
            query: `
              query ListLoanProducts($institutionId: ID!, $nextToken: String) {
                listLoanProducts(
                  filter: { institutionLoanProductsId: { eq: $institutionId } }
                  limit: 100
                  nextToken: $nextToken
                ) {
                  nextToken
                  items {
                    calculateInterestOn
                    description
                    durationPeriod
                    extendLoanAfterMaturity
                    id
                    institutionLoanProductsId
                    interestCalculationMethod
                    interestPeriod
                    interestRateDefault
                    interestRateMax
                    interestRateMin
                    interestType
                    interestTypeMaturity
                    loanInterestRateAfterMaturity
                    name
                    status
                    principalAmountDefault
                    principalAmountMax
                    principalAmountMin
                    recurringPeriodAfterMaturityUnit
                    repaymentFrequency
                    repaymentOrder
                    termDurationDefault
                    termDurationMax
                    termDurationMin
                    customLoanProductDetails
                    branches {
                      items {
                        branch {
                          id
                          name
                        }
                      }
                    }
                    loanFeesConfigs {
                      items {
                        loanFeesConfig {
                          id
                          name
                        }
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              institutionId: userDetails.institutionUsersId,
              nextToken: nextToken,
            },
          });

          console.log("listLoanProducts response::: ", result);

          const items = result.data.listLoanProducts.items || [];
          allLoanProducts = [...allLoanProducts, ...items];
          nextToken = result.data.listLoanProducts.nextToken;
        } while (nextToken);

        // Remove duplicates if any
        const uniqueLoanProducts = Array.from(
          new Map(allLoanProducts.map((item) => [item.id, item])).values(),
        );

        setLoanProducts(uniqueLoanProducts);
        console.log("allLoanProducts::: ", uniqueLoanProducts);
      } catch (err) {
        console.log("err::: ", err);
        setLoanProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (
      userDetails?.branchUsersId &&
      userDetails.branchUsersId !== lastBranchIdRef.current
    ) {
      console.log("Condition met - calling fetchLoanProducts");
      lastBranchIdRef.current = userDetails.branchUsersId;
      fetchLoanProducts();
    } else if (!userDetails?.branchUsersId) {
      console.log("No branchUsersId - setting loading to false");
      setLoading(false);
    } else {
      console.log("branchUsersId same as last time, skipping fetch");
    }
  }, [userDetails?.branchUsersId]);

  const handleViewLoanProduct = (row) => {
    navigate(`/admin/loan-products/id/${row.id}/view`);
  };

  const handleCreateLoanProduct = () => {
    navigate("/admin/add-loan-product");
  };

  // Updated columns to show only name, branches, and status
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 250,
      renderCell: (params) => (
        <ClickableText onClick={() => handleViewLoanProduct(params.row)}>
          {params.value}
        </ClickableText>
      ),
    },
    {
      field: "branch",
      headerName: "Branch",
      width: 300,
      renderCell: (params) => {
        const branches = params.row.branches?.items || [];
        const branchNames = branches
          .map((item) => item.branch?.name)
          .filter(Boolean)
          .join(", ");
        return branchNames || "No branch assigned";
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        // Status is "Active" if not set or if explicitly active
        const status = params.row.status || "Active";
        return status;
      },
    },
  ];

  return (
    <Box
      sx={{
        mx: { xs: 0, sm: "auto" },
        mt: { xs: 0, sm: 0 },
        p: { xs: 0, sm: 0 },
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "100%", md: 1000 },
        width: "100%",
        flex: 1,
        mb: 6,
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 2, fontWeight: 600, my: 2, textTransform: "none" }}
        >
          Loan Products{" "}
          <Typography variant="caption" sx={{ color: "#90a4ae" }}>
            Help
          </Typography>
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <PlusButtonMain
            onClick={handleCreateLoanProduct}
            buttonText="NEW LOAN PRODUCT"
          />
        </Box>
      </Box>
      <Box sx={{ width: "100%" }}>
        {/* Show info text if no loan products */}
        {!loading && loanProducts.length === 0 && (
          <Typography sx={{ mb: 2 }}>
            No loan products found. Please create a loan product to get started.
          </Typography>
        )}
        {loading ? (
          <Typography sx={{ mt: 4 }}>Loading loan products...</Typography>
        ) : (
          <CustomDataGrid
            rows={
              search
                ? loanProducts.filter((row) =>
                    row.name?.toLowerCase().includes(search.toLowerCase()),
                  )
                : loanProducts
            }
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={25}
            pageSizeOptions={[25, 50, 100]}
            loading={loading}
          />
        )}
      </Box>
    </Box>
  );
}
