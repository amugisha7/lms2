import React, { useState } from "react";
import Button from "@mui/material/Button";
import CustomSlider from "../ComponentAssets/CustomSlider";
import FormTemplate from "./FormTemplate";

export default function Temp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Launch Temp Form
      </Button>
      <CustomSlider open={open} onClose={() => setOpen(false)}>
        <FormTemplate />
      </CustomSlider>
    </>
  );
}
