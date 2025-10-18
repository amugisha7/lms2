import { useContext, useEffect, useState, useRef } from "react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../../App";
import * as Yup from "yup";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { FormikProvider } from "formik";
import ClickableText from "../../../ComponentAssets/ClickableText";
import { useNavigate } from "react-router-dom";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const CustomUserFields = ({
  customFields = [],
  formik,
  editing = true,
  onEdit,
  onPrint,
}) => {
  const { userDetails } = useContext(UserContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  // Placeholder for custom fields functionality
  // Users don't have custom fields in the current schema

  return (
    <Box>
      <Typography variant="body1">
        Custom fields are not currently supported for users.
      </Typography>
    </Box>
  );
};

export default CustomUserFields;
