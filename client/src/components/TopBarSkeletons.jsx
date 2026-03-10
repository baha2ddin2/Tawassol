"use client";
import { Skeleton, Avatar } from "@mui/material";

const TopbarSkeleton = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-[1100px] mx-auto px-[18px] py-3.5 flex items-center justify-between gap-4">
        {/* Brand Skeleton */}
        <div className="flex items-center gap-2.5 font-bold">
          <Skeleton variant="rectangular" width={30} height={30} className="rounded-lg" />
          <Skeleton variant="text" width={80} height={20} />
        </div>

        {/* Navigation Skeleton */}
        <div className="flex gap-1.5 p-1.5 bg-[#f1f6ff] border border-gray-100 rounded-full">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={70}
              height={30}
              className="mx-1"
            />
          ))}
        </div>

        {/* Actions Skeleton */}
        <div className="flex items-center gap-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="circular"
              width={38}
              height={38}
            />
          ))}
        </div>
      </div>
    </header>
  );
};

export default TopbarSkeleton;