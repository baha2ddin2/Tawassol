"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";

const TYPED_WORDS = [
  "friends",
  "the world",
  "your story",
  "your community",
  "everyone",
];

function TypingWord() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = TYPED_WORDS[wordIndex];
    let timeout;

    if (!isDeleting && displayed.length < word.length) {
      // Typing forward
      timeout = setTimeout(() => {
        setDisplayed(word.slice(0, displayed.length + 1));
      }, 90);
    } else if (!isDeleting && displayed.length === word.length) {
      // Pause at full word
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayed.length > 0) {
      // Deleting
      timeout = setTimeout(() => {
        setDisplayed(word.slice(0, displayed.length - 1));
      }, 50);
    } else if (isDeleting && displayed.length === 0) {
      // Move to next word
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % TYPED_WORDS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex]);

  return (
    <span className="relative inline-block">
      <span className="text-blue-500 font-bold">{displayed}</span>
      <span className="animate-blink border-r-2 border-blue-500 ml-0.5 h-[1em] inline-block align-middle" />
    </span>
  );
}

const FLOATING_IMAGES = [
  { src: "/images/p1.jpg", rotate: "-6deg", delay: 0, duration: 4, yRange: 15 },
  { src: "/images/p2.jpg", rotate: "3deg",  delay: 0.3, duration: 5, yRange: 20 },
  { src: "/images/p3.jpg", rotate: "6deg",  delay: 0.6, duration: 3.5, yRange: 12 },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex items-center justify-center px-6 overflow-hidden transition-colors duration-300">
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
              className="font-bold text-[var(--text-primary)] leading-tight transition-colors"
            >
              Share your moments <br />
              with{" "}
              <TypingWord />
            </Typography>

            <Typography className="text-[var(--text-muted)] text-lg max-w-md transition-colors">
              Tawassol is a social network where you can share posts, chat with
              friends, and discover new people around the world.
            </Typography>

            {/* Floating Photo Cards */}
            <div className="flex gap-4 pt-6">
              {FLOATING_IMAGES.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: [0, -img.yRange, 0] }}
                  transition={{
                    opacity: { duration: 0.6, delay: img.delay },
                    y: {
                      repeat: Infinity,
                      duration: img.duration,
                      ease: "easeInOut",
                      delay: img.delay,
                    },
                  }}
                  className="relative w-32 h-44 rounded-2xl shadow-xl overflow-hidden flex-shrink-0"
                  style={{ rotate: img.rotate }}
                >
                  <Image
                    src={img.src}
                    alt={`social-moment-${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  {/* Subtle overlay gloss */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-2xl rounded-2xl backdrop-blur-lg bg-[var(--card-bg)] text-[var(--text-primary)] transition-colors border-none">
              <CardContent className="p-10">
                <Stack spacing={3}>
                  <Typography variant="h4" className="font-bold text-center text-[var(--text-primary)]">
                    Welcome to Tawassol
                  </Typography>

                  <Typography className="text-[var(--text-muted)] text-center">
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
      </div>
    </>
  );
}
