"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  IconButton,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useSelector } from "react-redux";
import api from "@/lib/api";
import { gooeyToast } from "goey-toast";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const { userInfo } = useSelector((state) => state.auth);
  const user = userInfo?.user;
  const router = useRouter();
  const codeSentRef = useRef(false);

  const sentVerificationCode = useCallback((force = false) => {
    if (codeSentRef.current && !force) return; // Prevent multiple sends unless forced
    codeSentRef.current = true;
    api
      .post("/email/send-code")
      .then((res) => {
        gooeyToast.success("the verification code sent successfuly");
      })
      .catch((err) => {
        codeSentRef.current = false; // Allow retry on error
        gooeyToast.error(
          err.response?.data?.message || err.message || "Sending failed",
        );
      });
  }, []);

  useEffect(() => {
    sentVerificationCode();
  }, []);

  const handleChange = (value, index) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  function verifyEmail() {
    api
      .post("/email/verify-email", {
        code: otp.join(""),
      })
      .then((res) => {
        gooeyToast.success("the email verify successfuly");
        router.push("/home");
      })
      .catch((err) =>
        gooeyToast.error(
          err.response?.data?.message || err.message || "Verification failed",
        ),
      );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      {/* Main Content */}
      <main className="w-full flex justify-center py-16 px-4">
        <Paper
          elevation={0}
          className="w-full max-w-[520px] rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] shadow-md"
        >
          <div className="bg-[var(--nav-pill-bg)] py-12 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center shadow-sm">
              <MailOutlineIcon
                sx={{ color: "var(--color-primary)" }}
                fontSize="large"
              />
            </div>
          </div>
          <div className="p-8 md:p-12 text-center">
            <Typography
              variant="h4"
              className="font-black text-[var(--text-primary)] mb-2"
              gutterBottom
            >
              Verify your email
            </Typography>

            <Typography className="text-[var(--text-muted)] text-sm md:text-base leading-relaxed mb-8">
              We’ve sent a 6-digit code to{" "}
              <span className="text-[var(--text-primary)] font-extrabold">
                {user?.email}
              </span>
              .<br />
              Enter it below to confirm your email.
            </Typography>

            <div className="flex justify-center gap-3 md:gap-4 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-11 h-11 md:w-14 md:h-14 text-center text-lg font-bold border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] rounded-xl focus:border-[var(--color-primary)] outline-none transition-all"
                />
              ))}
            </div>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={verifyEmail}
              endIcon={<ArrowForwardIcon />}
              className="btn mt-4 shadow-md text-white border-0 bg-blue-600 hover:opacity-90 transition-opacity"
              sx={{ background: "var(--color-primary)", color: "white" }}
            >
              Verify & Proceed
            </Button>

            <div className="mt-6 flex items-center justify-center gap-1 text-sm text-[var(--text-muted)]">
              Didn't receive the email?
              <button
                onClick={() => sentVerificationCode(true)}
                className="text-[var(--color-primary)] font-extrabold hover:underline flex items-center gap-1"
              >
                Resend Code
                <RefreshIcon sx={{ fontSize: 16 }} />
              </button>
            </div>
          </div>
        </Paper>
      </main>
    </div>
  );
}
