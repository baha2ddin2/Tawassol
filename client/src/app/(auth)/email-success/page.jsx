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
    <div className="wrap bg-[var(--background)] transition-colors duration-300">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Paper className="p-10 rounded-[40px] border border-[var(--card-border)] bg-[var(--card-bg)] shadow-md text-center transition-colors duration-300">
          
          {/* Animated Icon Section */}
          <Box className="relative flex justify-center mb-8">
            <motion.div 
              variants={airplaneVariants}
              animate="animate"
              className="w-24 h-24 bg-[var(--nav-pill-bg)] rounded-full flex items-center justify-center border border-[var(--card-border)] text-[var(--color-primary)]"
            >
              <MarkEmailReadIcon sx={{ fontSize: 48 }} />
            </motion.div>
            
            {/* Small floating "Check" decoration */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="absolute top-0 right-1/3 bg-[var(--success)] text-[var(--card-bg)] rounded-full p-1 border-4 border-[var(--card-bg)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </Box>

          {/* Text Content */}
          <motion.div variants={itemVariants}>
            <Typography variant="h4" className="font-black text-[var(--text-primary)] mb-3 tracking-tight">
              Check your inbox
            </Typography>
            <Typography className="text-[var(--text-muted)] font-medium leading-relaxed">
              We've sent a password recovery link to:
              <br />
              <span className="text-[var(--text-primary)] font-bold">{email}</span>
            </Typography>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="mt-10 space-y-4">
            <Button
              fullWidth
              variant="contained"
              className="btn bg-[var(--color-primary)] shadow-none"
              sx={{ background: "var(--color-primary)" }}
              onClick={() => window.open('https://mail.google.com', '_blank')}
            >
              Open Email App
            </Button>
            
            <Link href="/login" className="block no-underline">
              <Button
                fullWidth
                startIcon={<ArrowBackIcon />}
                className="text-[var(--text-muted)] font-bold normal-case hover:text-[var(--color-primary)]"
              >
                Back to Login
              </Button>
            </Link>
          </motion.div>

          {/* Footer Footer */}
          <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-[var(--card-border)]">
            <Typography className="text-sm text-[var(--text-muted)] font-medium">
              Didn't receive the email?{' '}
              <button className="text-[var(--color-primary)] font-black hover:underline">
                Click to resend
              </button>
            </Typography>
          </motion.div>

        </Paper>
      </motion.div>
    </div>
  );
}
