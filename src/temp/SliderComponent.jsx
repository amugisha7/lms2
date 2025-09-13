import React from "react";
import Drawer from "@mui/material/Drawer";
import { Box } from "@mui/material";

const SliderComponent = ({ open, onClose, children }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>{children}</Box>
    </Drawer>
  );
};

export default SliderComponent;
