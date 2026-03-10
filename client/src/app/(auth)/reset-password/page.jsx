"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Typography, 
  Button, 
  Paper, 
  TextField, 
  InputAdornment, 
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  LockReset, 
  CheckCircle 
} from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Get the token from URL

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <CheckCircle sx={{ fontSize: 80 }} className="text-green-500 mb-4" />
          <Typography variant="h4" className="font-black text-slate-900 dark:text-white mb-2">
            Password Updated!
          </Typography>
          <Typography className="text-slate-500">
            Your security is our priority. Redirecting to login...
          </Typography>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]  flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Paper className="p-10 rounded-[40px] shadow-xl dark:bg-slate-900 border-none">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-[#1477ff]">
              <LockReset sx={{ fontSize: 40 }} />
            </div>
          </div>

          <Typography variant="h4" className="text-center font-black text-slate-900 dark:text-white mb-2">
            New Password
          </Typography>
          <Typography className="text-center text-slate-500 dark:text-slate-400 mb-8 text-sm">
            Please enter a strong password that you haven't used before.
          </Typography>

          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-3">
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              InputProps={{
                className: "rounded-2xl",
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              required
              error={formData.password_confirmation !== '' && formData.password !== formData.password_confirmation}
              value={formData.password_confirmation}
              onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
              InputProps={{ className: "rounded-2xl" }}
              helperText={
                formData.password_confirmation !== '' && 
                formData.password !== formData.password_confirmation ? "Passwords must match" : ""
              }
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              className="py-4 rounded-2xl bg-[#1477ff] hover:bg-blue-700 font-black normal-case text-lg shadow-lg shadow-blue-200 dark:shadow-none transition-all"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
            </Button>
          </form>
        </Paper>
      </motion.div>
    </div>
  );
}
