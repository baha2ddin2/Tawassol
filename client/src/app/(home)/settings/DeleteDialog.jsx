import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

export default function DeleteDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { borderRadius: 24, padding: 8 } }}>
      <DialogTitle className="font-black text-red-600">Delete your account?</DialogTitle>
      <DialogContent>
        <DialogContentText className="font-medium text-[#64748b]">
          This action is permanent and cannot be undone. All your reports, data, and profile information will be deleted forever.
        </DialogContentText>
      </DialogContent>
      <DialogActions className="p-4 gap-2">
        <Button onClick={onClose} className="font-bold text-[#64748b] normal-case">Cancel</Button>
        <Button onClick={onConfirm} variant="contained" className="bg-red-600 hover:bg-red-700 font-bold normal-case rounded-xl px-6">
          Yes, Delete Forever
        </Button>
      </DialogActions>
    </Dialog>
  );
}
