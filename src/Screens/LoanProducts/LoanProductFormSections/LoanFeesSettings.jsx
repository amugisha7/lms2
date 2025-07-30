import React from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../../App";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export default function LoanFeesSettings({ value = [], onChange }) {
  const [assign, setAssign] = React.useState("no");
  const [loading, setLoading] = React.useState(false);
  const [loanFees, setLoanFees] = React.useState([]);
  const [selected, setSelected] = React.useState(value);
  const [fetched, setFetched] = React.useState(false);
  const { userDetails } = React.useContext(UserContext);

  React.useEffect(() => {
    if (assign === "yes" && !fetched) {
      setLoading(true);
      (async () => {
        try {
          const client = generateClient();
          const result = await client.graphql({
            query: `
              query ListLoanFeesConfigs($institutionId: ID!) {
                listLoanFeesConfigs(
                  filter: { institutionLoanFeesConfigsId: { eq: $institutionId } }
                  limit: 100
                ) {
                  items {
                    id
                    name
                    calculationMethod
                    rate
                    percentageBase
                  }
                }
              }
            `,
            variables: {
              institutionId: userDetails?.institutionUsersId,
            },
          });
          setLoanFees(result.data.listLoanFeesConfigs.items || []);
          setFetched(true);
        } catch {
          setLoanFees([]);
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line
  }, [assign, userDetails?.institutionUsersId]);

  React.useEffect(() => {
    if (onChange) onChange(selected);
    // eslint-disable-next-line
  }, [selected]);

  const handleToggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAssignChange = (e) => {
    setAssign(e.target.value);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid size={{ xs: 12, md: 12 }}>
        <hr style={{ width: "100%", marginBottom: "20px" }} />
        <Typography variant="caption">LOAN FEES SETTINGS:</Typography>
      </Grid>
      {/* Replace FormLabel with Typography */}
      <Typography sx={{ mt: 2 }}>Assign Loan Fees?</Typography>
      <RadioGroup
        row
        name="assignLoanFees"
        value={assign}
        onChange={handleAssignChange}
      >
        <FormControlLabel value="no" control={<Radio />} label="No" />
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
      </RadioGroup>
      {assign === "yes" && (
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="caption" sx={{ mb: 1, display: "block" }}>
                Select loan fees to assign to this product:
              </Typography>
              <List dense>
                {loanFees.map((fee) => (
                  <ListItem
                    key={fee.id}
                    dense
                    // button
                    // onClick={() => handleToggle(fee.id)}
                    sx={{ pl: 0 }}
                  >
                    <Checkbox
                      checked={selected.includes(fee.id)}
                      tabIndex={-1}
                      disableRipple
                      onChange={() => handleToggle(fee.id)}
                    />
                    <ListItemText
                      primary={fee.name}
                      secondary={
                        fee.calculationMethod === "percentage"
                          ? `${fee.rate}%`
                          : fee.rate
                      }
                    />
                  </ListItem>
                ))}
                {loanFees.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No loan fees found." />
                  </ListItem>
                )}
              </List>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
