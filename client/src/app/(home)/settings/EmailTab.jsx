import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Chip, TextField ,Button,Paper } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useState ,useEffect } from "react";
import { useRouter } from "next/navigation";
import { changeEmail } from "@/redux/Slices/AuthSlice";
import { validateEmail } from "@/lib/validation";
import VerifiedIcon from "@mui/icons-material/Verified";

export default function EmailTab() {
  const { userInfo } = useSelector((state) => state.auth);
  const user = userInfo?.user;
  const [email, setEmail] = useState("");
  const [errorObj, setErrorObj] = useState(null);
  const dispatch = useDispatch()
  useEffect(() => {
    setEmail(user?.email);
  }, [user]);

  const router = useRouter()

  const handleUpdate = async () => {
    const errorMsg = validateEmail(email);
    if (errorMsg) {
      setErrorObj(errorMsg);
      return;
    }
    setErrorObj(null);
    
    try {
      await dispatch(changeEmail(email)).unwrap();
    } catch (err) {
      setErrorObj(err.message || "Failed to update email.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in ">
      <Paper
        elevation={0}
        className="border border-[var(--card-border)] bg-[var(--card-bg)] rounded-3xl overflow-hidden shadow-sm"
      >
        <div className="bg-[var(--nav-pill-bg)] px-6 py-4 border-b border-[var(--card-border)] flex justify-between items-center">
          <Typography className="font-extrabold text-lg text-[var(--text-primary)]">
            Change Email Address
          </Typography>
          {user?.email_verified_at ? (
            <Chip
              icon={<VerifiedIcon />}
              label="Verified"
              color="primary"
              size="small"
              className="bg-blue-100 text-blue-700 font-bold"
            />
          ) : (
            <Chip
              icon={<ErrorOutlineIcon style={{ color: "#c2410c" }} />}
              label="Unverified"
              size="small"
              className="bg-orange-100 text-orange-700 font-bold"
            />
          )}
        </div>
        <div className="p-6 space-y-5">
          <TextField
            fullWidth
            label="New Email Address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            variant="outlined"
            error={!!errorObj}
            helperText={errorObj}
          />
          {!user?.email_verified_at && (
            <Button
              size="small"
              variant="text"
              color="warning"
              startIcon={<NotificationsNoneIcon />}
              className="text-orange-600 font-bold lowercase"
              onClick={() => router.push("/verify-email")}
            >
              Verify your email now
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleUpdate}
            className="font-bold normal-case rounded-xl py-2.5 px-6 block"
            sx={{ bgcolor: "var(--color-primary)", "&:hover": { bgcolor: "var(--color-primary-dark)" } }}
          >
            Update Email
          </Button>
        </div>
      </Paper>
    </div>
  );
}
