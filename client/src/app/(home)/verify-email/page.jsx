"use client";

import React, { useState, useRef } from 'react';
import { Button, TextField, Box, Typography, Container, Paper, IconButton } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSelector } from 'react-redux';


export default function VerifyEmail() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const { userInfo } = useSelector((state) => state.auth);
  const user = userInfo?.user;

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
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen  bg-[#f4f6f9] font-sans">
      {/* Main Content */}
      <main className="flex h-[calc(100vh-90px)] items-center justify-center py-16 px-4">
        <Paper 
          elevation={0} 
          className="w-full max-w-[520px] rounded-2xl overflow-hidden border border-[#e7edf7] shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
        >
          <div className="bg-[#e9f4ff] py-12 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-white border border-[#e7edf7] flex items-center justify-center shadow-sm">
              <MailOutlineIcon className="text-blue-600" fontSize="large" />
            </div>
          </div>
          <div className="p-8 md:p-12 text-center">
            <Typography variant="h4" className="font-black text-[#0f172a] mb-2" gutterBottom>
              Verify your email
            </Typography>
            
            <Typography className="text-[#64748b] text-sm md:text-base leading-relaxed mb-8">
              We’ve sent a 6-digit code to <span className="text-[#0f172a] font-extrabold">{user?.email}</span>.<br />
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
                  className="w-11 h-11 md:w-14 md:h-14 text-center text-lg font-bold border border-[#dbe6f7] bg-[#fbfdff] rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              ))}
            </div>

            <Button
              variant="contained"
              fullWidth
              size="large"
              endIcon={<ArrowForwardIcon />}
              className="bg-[#1477ff] hover:bg-blue-700 py-3.5 rounded-xl font-extrabold normal-case shadow-[0_16px_24px_rgba(20,119,255,0.2)]"
            >
              Verify & Proceed
            </Button>

            <div className="mt-6 flex items-center justify-center gap-1 text-sm text-[#64748b]">
              Didn't receive the email?
              <button className="text-[#1477ff] font-extrabold hover:underline flex items-center gap-1">
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