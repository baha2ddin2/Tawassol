"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack
} from "@mui/material";

export default function Home() {
  return (
    <>
      <Navbar />

      <Box className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-6 overflow-hidden">

        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT SECTION */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >

            <Typography
              variant="h2"
              className="font-bold text-gray-900 leading-tight"
            >
              Share your moments <br />
              with your <span className="text-blue-600">friends</span>
            </Typography>

            <Typography className="text-gray-600 text-lg max-w-md">
              Tawassol is a social network where you can share posts,
              chat with friends, and discover new people around the world.
            </Typography>

            {/* Floating images */}
            <div className="flex gap-4 pt-6">

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-32 h-40 rounded-xl shadow-lg rotate-[-6deg] bg-cover bg-center"
                style={{ backgroundImage: "url('/images/p1.jpg')" }}
              />

              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 5 }}
                className="w-32 h-40 rounded-xl shadow-xl rotate-3 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/p2.jpg')" }}
              />

              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 3.5 }}
                className="w-32 h-40 rounded-xl shadow-lg rotate-6 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/p3.jpg')" }}
              />

            </div>

          </motion.div>

          {/* RIGHT SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
          >

            <Card className="shadow-2xl rounded-2xl backdrop-blur-lg">

              <CardContent className="p-10">

                <Stack spacing={3}>

                  <Typography
                    variant="h4"
                    className="font-bold text-center"
                  >
                    Welcome to Tawassol
                  </Typography>

                  <Typography
                    className="text-gray-500 text-center"
                  >
                    Log in or create an account to continue
                  </Typography>

                  <Link href="/login">
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        className="!rounded-xl !py-3"
                      >
                        Log In
                      </Button>
                    </motion.div>
                  </Link>

                  <Link href="/register">
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        size="large"
                        className="!rounded-xl !py-3"
                      >
                        Create Account
                      </Button>
                    </motion.div>
                  </Link>

                </Stack>

              </CardContent>

            </Card>

          </motion.div>

        </div>

      </Box>
    </>
  );
}
