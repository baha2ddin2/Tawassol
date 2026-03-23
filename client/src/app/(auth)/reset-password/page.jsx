"use client";

import React, { useState, useEffect, Suspense } from 'react';
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
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');

  // Protect against direct access without token/email
  useEffect(() => {
    if (!token || !email) {
      setError("Invalid or missing reset token.");
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !email) {
       setError("Invalid or missing reset token.");
       return;
    }
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    setError('');

    api.post(`/password/change-password`, {
      ...formData,
      token,
      email
    })
    .then((res) => {
      setLoading(false);
      setIsSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    })
    .catch((err) => {
      setLoading(false);
      setError(err?.response?.data?.message || err?.data?.message || err?.message || "An error occurred");
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <CheckCircle sx={{ fontSize: 80 }} className="text-green-500 mb-4" />
          <Typography variant="h4" className="font-black text-[var(--text-primary)] mb-2">
            Password Updated!
          </Typography>
          <Typography className="text-[var(--text-muted)]">
            Your security is our priority. Redirecting to login...
          </Typography>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Paper className="p-10 rounded-[40px] shadow-xl bg-[var(--card-bg)] border-none">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[var(--nav-pill-bg)] rounded-2xl text-[var(--color-primary)]">
              <LockReset sx={{ fontSize: 40 }} />
            </div>
          </div>

          <Typography variant="h4" className="text-center font-black text-[var(--text-primary)] mb-2">
            New Password
          </Typography>
          <Typography className="text-center text-[var(--text-muted)] mb-8 text-sm">
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
                className: "rounded-2xl bg-[var(--input-bg)]",
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: { color: "var(--text-primary)" }
              }}
              sx={{
                 "& .MuiOutlinedInput-root": {
                     "& fieldset": { borderColor: "var(--input-border)" },
                 },
                 "& .MuiInputLabel-root": { color: "var(--text-muted)" },
                 "& .MuiInputBase-input": { color: "var(--text-primary)" },
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
              InputProps={{ 
                className: "rounded-2xl bg-[var(--input-bg)]",
                style: { color: "var(--text-primary)" }
              }}
              helperText={
                formData.password_confirmation !== '' && 
                formData.password !== formData.password_confirmation ? "Passwords must match" : ""
              }
              sx={{
                 "& .MuiOutlinedInput-root": {
                     "& fieldset": { borderColor: "var(--input-border)" },
                 },
                 "& .MuiInputLabel-root": { color: "var(--text-muted)" },
                 "& .MuiInputBase-input": { color: "var(--text-primary)" },
              }}
            />

            {error && <span className='text-red-500 font-medium text-center text-sm'>{error}</span> }

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading || !token || !email}
              className="py-4 rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] font-black normal-case text-lg text-white shadow-lg transition-all"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
            </Button>
          </form>
        </Paper>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <CircularProgress />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
