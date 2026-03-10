"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Button, Box, Paper } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

export default function EmailSuccessPage({ email = "user@example.com" }) {
  
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const airplaneVariants = {
    animate: {
      y: [0, -15, 0],
      x: [0, 10, 0],
      rotate: [0, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] h-[calc(100hv-80px)] flex items-center justify-center p-6">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Paper className="p-10 rounded-[40px] border-none shadow-xl shadow-blue-100/50 dark:shadow-none dark:bg-slate-900 text-center">
          
          {/* Animated Icon Section */}
          <Box className="relative flex justify-center mb-8">
            <motion.div 
              variants={airplaneVariants}
              animate="animate"
              className="w-24 h-24 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-[#1477ff]"
            >
              <MarkEmailReadIcon sx={{ fontSize: 48 }} />
            </motion.div>
            
            {/* Small floating "Check" decoration */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="absolute top-0 right-1/3 bg-green-500 text-white rounded-full p-1 border-4 border-white dark:border-slate-900"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </Box>

          {/* Text Content */}
          <motion.div variants={itemVariants}>
            <Typography variant="h4" className="font-black text-slate-900 dark:text-white mb-3 tracking-tight">
              Check your inbox
            </Typography>
            <Typography className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              We've sent a password recovery link to:
              <br />
              <span className="text-slate-900 dark:text-slate-200 font-bold">{email}</span>
            </Typography>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="mt-10 space-y-4">
            <Button
              fullWidth
              variant="contained"
              className="py-4 rounded-2xl bg-[#1477ff] hover:bg-blue-700 font-black normal-case text-lg shadow-lg shadow-blue-200 dark:shadow-none"
              onClick={() => window.open('https://mail.google.com', '_blank')}
            >
              Open Email App
            </Button>
            
            <Link href="/login" className="block no-underline">
              <Button
                fullWidth
                startIcon={<ArrowBackIcon />}
                className="text-slate-400 font-bold normal-case hover:text-blue-600"
              >
                Back to Login
              </Button>
            </Link>
          </motion.div>

          {/* Footer Footer */}
          <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800">
            <Typography className="text-sm text-slate-400 font-medium">
              Didn't receive the email?{' '}
              <button className="text-[#1477ff] font-black hover:underline">
                Click to resend
              </button>
            </Typography>
          </motion.div>

        </Paper>
      </motion.div>
    </div>
  );
}
