import React, { useEffect, useState, useContext } from "react";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../../App";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";

export default function LoanBranchesSelect({ formik, disabled = false }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userDetails } = useContext(UserContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const client = generateClient();
        const institutionId = userDetails?.institutionUsersId;
        if (!institutionId) {
          setBranches([]);
          setLoading(false);
          return;
        }
        const result = await client.graphql({
          query: `
            query ListBranches($filter: ModelBranchFilterInput) {
              listBranches(filter: $filter) {
                items {
                  id
                  name
                }
              }
            }
          `,
          variables: {
            filter: {
              institutionBranchesId: { eq: institutionId },
            },
          },
        });
        setBranches(result?.data?.listBranches?.items || []);
      } catch (err) {
        setBranches([]);
      }
      setLoading(false);
    };
    fetchBranches();
  }, [userDetails?.institutionUsersId]);

  return (
    <>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="branch">Branch</FormLabel>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Select
            id="branch"
            name="branch"
            multiple
            value={formik.values.branch}
            onChange={formik.handleChange}
            input={<OutlinedInput label="Branch" />}
            size="small"
            disabled={disabled}
            renderValue={(selected) =>
              branches
                .filter((b) => selected.includes(b.id))
                .map((b) => b.name)
                .join(", ")
            }
            sx={{
              border:
                formik.touched.branch && Boolean(formik.errors.branch)
                  ? "1.5px solid #d32f2f"
                  : `1px solid ${colors.grey[200]}`,
              width: "100%",
            }}
          >
            {branches.map((branch) => (
              <MenuItem
                key={branch.id}
                value={branch.id}
                sx={{
                  "&:hover": {
                    color: "#fff",
                    backgroundColor: "primary.main",
                  },
                }}
              >
                <Checkbox
                  checked={formik.values.branch.indexOf(branch.id) > -1}
                />
                {branch.name}
              </MenuItem>
            ))}
          </Select>
        )}
        {!loading &&
          (!formik.values.branch || formik.values.branch.length === 0) && (
            <Typography variant="caption" sx={{ my: 2, color: "red" }}>
              WARNING: If you do not select any branch, then this loan product
              will not be available to any branch.
            </Typography>
          )}
      </Grid>
    </>
  );
}
