import React from 'react';
import { Stepper, Step, StepLabel, Box } from '@mui/material';

const steps = [
  "Order Placed",
  "Order Confirmed",
  "Order Shipped",
  "Out for Delivery",
  "Delivered"
];

const OrderTraker = ({ activeStep }) => {
  return (
    <Box sx={{ width: '100%', py: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  color: "#a1a1aa",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  mt: 1,
                  "&.Mui-active": { color: "#e6c687" },
                  "&.Mui-completed": { color: "#ff2a85" },
                },
                "& .MuiStepIcon-root": {
                  color: "rgba(255,255,255,0.15)",
                  fontSize: "1.75rem",
                  "&.Mui-active": { color: "#e6c687" },
                  "&.Mui-completed": { color: "#ff2a85" },
                },
                "& .MuiStepIcon-text": {
                  fill: "#000",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default OrderTraker;