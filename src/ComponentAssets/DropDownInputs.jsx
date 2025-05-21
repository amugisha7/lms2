import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormLabel from '@mui/material/FormLabel';
import { styled } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const StyledOutlinedInput = styled(OutlinedInput)({
  border: '1px solid #708090',
  fontSize: '1rem',
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
export default function DropDownInputs({ dropdowns }) {
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
            id={dropdown.id}
            name={dropdown.id}
            value={dropdown.value}
            onChange={dropdown.onChange}
            size="small"
            displayEmpty
            input={<StyledOutlinedInput label={dropdown.label} />}
            MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
          >
            <MenuItem value="">
              <em>{dropdown.placeholder || `Select ${dropdown.label}`}</em>
            </MenuItem>
            {dropdown.options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormGrid>
      ))}
    </>
  );
}