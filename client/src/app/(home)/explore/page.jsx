"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { weekTendence } from "@/redux/Slices/searchSlice";
import SearchSection from "@/components/SearchSection";

const ExploreHero = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(weekTendence());
  }, []);

  const trendingTags = useSelector((state) => state.search.weekTendece);

  return (
    <main className="max-w-[900px] mx-auto mt-[60px] px-5 text-center">
      <section className="flex flex-col items-center">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-[30px] text-gray-900">
          Explore Tawassol
        </h1>

        {/* Search Wrapper */}
        <div className="w-full max-w-[600px] pt-10 mb-10">
          <SearchSection />
        </div>

        {/* Trending Section */}
        <div className="w-full">
          <div className="flex items-center justify-center gap-2 font-semibold text-gray-500 mb-5">
            <span className="text-blue-500">↗</span>
            Trending this week
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {trendingTags &&
              trendingTags.map((tag) => (
                <Link
                  key={tag.tag_id}
                  href={`/hashtag/${tag.tag}`}
                  className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm text-gray-700 font-medium transition-all hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 active:scale-95"
                >
                  #{tag.tag}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ExploreHero;
