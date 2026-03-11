"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import {
  reportPost,
  reportComment,
  reportUser,
} from "@/redux/Slices/reportSlice";

export default function ReportModal({ open, onClose, type, id }) {
  const [reason, setReason] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!reason.trim()) return;

    switch (type) {
      case "post":
        dispatch(reportPost({ postId: id, reason }));
        break;
      case "comment":
        dispatch(reportComment({ commentId: id, reason }));
        break;
      case "user":
        dispatch(reportUser({ userId: id, reason }));
        break;
      default:
        break;
    }
    onClose();
    setReason("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-lg font-semibold">Report {type}</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <TextField
          autoFocus
          multiline
          minRows={3}
          label="Reason for reporting"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="error">
          Report
        </Button>
      </DialogActions>
    </Dialog>
  );
}
