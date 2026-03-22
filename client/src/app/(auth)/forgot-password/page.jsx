"use client";
import {
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Link,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const sendEmail = () => {
    api
      .post("/password/forgot-password",{
        email,
      })
      .then((res) =>{
        setError('')
        router.push("/email-success")
      })
      .catch((err) => setError(err.response?.data?.message || err.message || "An error occurred"));
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <Card
        className="w-full max-w-[420px] p-10 rounded-[20px] border border-[var(--card-border)] bg-[var(--card-bg)] shadow-md border-t-[5px] border-t-[var(--color-primary)] text-center"
        elevation={0}
      >
        <div className="w-[60px] h-[60px] bg-[var(--nav-pill-bg)] rounded-full flex items-center justify-center mx-auto mb-5 text-[var(--color-primary)] text-2xl border border-[var(--card-border)]">
          <MailOutlineIcon fontSize="inherit" />
        </div>

        <Typography variant="h5" className="font-bold mb-2 text-[var(--text-primary)]">
          Forgot Password?
        </Typography>

        <Typography className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
          No worries! Enter the email associated with your account and we'll
          send you a link to reset your password.
        </Typography>

        <div className="text-left mb-6">
          <Typography className="text-sm font-semibold mb-1.5 text-[var(--text-primary)]">
            Email address
          </Typography>
          <TextField
            fullWidth
            placeholder="name@example.com"
            variant="outlined"
            className="bg-[var(--input-bg)] rounded-xl border-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon sx={{ color: "var(--text-muted)" }} className="text-xl" />
                </InputAdornment>
              ),
              sx: {
                "& fieldset": { border: "none" },
                borderRadius: "12px",
              },
            }}
          />
        </div>
        {
          error && <span className=" text-[var(--danger)]" >{error}</span>
        }
        <Button
          onClick={sendEmail}
          fullWidth
          variant="contained"
          className="btn shadow-none bg-[var(--color-primary)] hover:opacity-90"
          sx={{ background: "var(--color-primary)" }}
        >
          Send Reset Link
        </Button>

        <Typography className="mt-5 text-sm text-[var(--text-muted)]">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-[var(--color-primary)] font-bold no-underline hover:underline flex items-center justify-center gap-1 inline-flex"
          >
            <ArrowBackIcon fontSize="inherit" /> Back to Log In
          </Link>
        </Typography>
      </Card>
    </div>
  );
};

export default ForgotPassword;
