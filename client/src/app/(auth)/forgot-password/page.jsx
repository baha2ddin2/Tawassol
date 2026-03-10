"use client"
import { Card, TextField, Button, Typography, InputAdornment, Link } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ForgotPassword = () => {
  const [email,setEmail] = useState()
  const router = useRouter()

  const sendEmail=()=>{
    router.push('/email-success')
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-slate-50 p-4">
      <Card 
        className="w-full max-w-[420px] p-10 rounded-[20px] shadow-xl border-t-[5px] border-blue-600 text-center"
        elevation={0}
      >
        <div className="w-[60px] h-[60px] bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5 text-blue-600 text-2xl">
          <MailOutlineIcon fontSize="inherit" />
        </div>

        <Typography variant="h5" className="font-bold mb-2 text-slate-900">
          Forgot Password?
        </Typography>
        
        <Typography className="text-sm text-slate-500 mb-6 leading-relaxed">
          No worries! Enter the email associated with your account and we'll send you a link to reset your password.
        </Typography>

        <div className="text-left mb-6">
          <Typography className="text-sm font-semibold mb-1.5 text-slate-800">
            Email address
          </Typography>
          <TextField
            fullWidth
            placeholder="name@example.com"
            variant="outlined"
            className="bg-slate-100 rounded-xl border-none"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon className="text-slate-400 text-xl" />
                </InputAdornment>
              ),
              sx: {
                '& fieldset': { border: 'none' },
                borderRadius: '12px',
              }
            }}
          />
        </div>

        {/* Action Button */}
        <Button 
          onClick={sendEmail}
          fullWidth
          variant="contained"
          className="py-3.5 rounded-full font-bold text-base capitalize shadow-none bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90"
        >
          Send Reset Link
        </Button>

        {/* Back Link */}
        <Typography className="mt-5 text-sm text-slate-500">
          Remember your password?{' '}
          <Link 
            href="/login" 
            className="text-blue-600 font-medium no-underline hover:underline flex items-center justify-center gap-1 inline-flex"
          >
            <ArrowBackIcon fontSize="inherit" /> Back to Log In
          </Link>
        </Typography>
      </Card>
    </div>
  );
};

export default ForgotPassword;
