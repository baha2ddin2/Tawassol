"use client";

import { Button } from "@mui/material";
import { Home } from "@mui/icons-material";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">

      <div className="bg-white border rounded-2xl shadow-sm p-10 text-center max-w-md w-full">

        {/* 404 number */}
        <h1 className="text-7xl font-extrabold text-blue-500 mb-4">
          404
        </h1>

        {/* title */}
        <h2 className="text-xl font-semibold mb-2">
          Page Not Found
        </h2>

        {/* description */}
        <p className="text-gray-500 mb-6">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        {/* button */}
        <Link href="/home">
          <Button
            variant="contained"
            startIcon={<Home />}
            sx={{ borderRadius: "999px", paddingX: 3 }}
          >
            Back to Home
          </Button>
        </Link>

      </div>

    </div>
  );
}