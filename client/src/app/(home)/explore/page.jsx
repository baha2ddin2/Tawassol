"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { weekTendence } from "@/redux/Slices/searchSlice";
import SearchSection from "@/components/SearchSection";
import { useTranslation } from "react-i18next";

const ExploreHero = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(weekTendence());
  }, []);

  const trendingTags = useSelector((state) => state.search.weekTendece);

  return (
    <main className="max-w-[900px] mx-auto mt-[60px] px-5 text-center">
      <section className="flex flex-col items-center">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-[30px] text-[var(--text-primary)]">
          {t("explore.title", "Explore Tawassol")}
        </h1>

        {/* Search Wrapper */}
        <div className="w-full max-w-[600px] pt-10 mb-10">
          <SearchSection />
        </div>

        {/* Trending Section */}
        <div className="w-full">
          <div className="flex items-center justify-center gap-2 font-semibold text-[var(--text-muted)] mb-5">
            <span className="text-[var(--color-primary)]">↗</span>
            {t("explore.trending", "Trending this week")}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {trendingTags &&
              trendingTags.map((tag) => (
                <Link
                  key={tag.tag}
                  href={`/hashtag/${tag.tag}`}
                  className="bg-[var(--card-bg)] border border-[var(--card-border)] px-4 py-2 rounded-full text-sm text-[var(--text-primary)] font-medium transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--hover-overlay)] active:scale-95"
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
