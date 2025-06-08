import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormLabel from '@mui/material/FormLabel';
import { styled } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => {
  const colors = tokens(theme.palette.mode);
  return {
    border: `1px solid ${colors.grey[200]}`,
    fontSize: '1rem',
  };
});

/**
 * DropDownInputs
 * @param {Array} dropdowns - Array of dropdown configs:
 *   {
 *     label: string,
 *     id: string,
 *     value: string,
 *     onChange: function,
 *     options: array of { value, label },
 *     placeholder: string (optional),
 *     gridSize: object (optional, default { xs:12, md:6 })
 *   }
 */
export default function DropDownInputs({ dropdowns, editing = true }) {
  return (
    <>
      {dropdowns.map((dropdown) => (
        <FormGrid
          key={dropdown.id}
          size={dropdown.gridSize || { xs: 12, md: 6 }}
        >
          <FormLabel htmlFor={dropdown.id}>
            {dropdown.label}
          </FormLabel>
          <Select
            sx={{
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                },
              }}
            id={dropdown.id}
            
            name={dropdown.id}
            value={dropdown.value}
            onChange={dropdown.onChange}
            size="small"
            displayEmpty
            input={<StyledOutlinedInput label={dropdown.label} />}
            MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
            disabled={!editing}
          >
            <MenuItem 
              value=""
              sx={{
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              <em>{dropdown.placeholder || `Select ${dropdown.label}`}</em>
            </MenuItem>
            {dropdown.options.map((opt) => (
              <MenuItem 
                key={opt.value} 
                value={opt.value}
                sx={{
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormGrid>
      ))}
    </>
  );
}