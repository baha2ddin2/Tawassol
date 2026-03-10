import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

export default function ErrorSnackbar({ error ,fun }) {
  const [open, setOpen] = useState(true);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => {
        setOpen(false)
        fun()
      }}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        severity="error"
        variant="filled"
        onClose={() => setOpen(false)}
      >
        {error}
      </Alert>
    </Snackbar>
  );
}