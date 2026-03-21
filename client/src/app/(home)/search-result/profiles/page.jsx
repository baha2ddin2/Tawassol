"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  CircularProgress,
  Typography,
  InputAdornment,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { searchProfiles } from "@/redux/Slices/searchSlice";
import { useSearchParams } from "next/navigation";


export default function SearchProfilesPage() {
  const seachParams = useSearchParams();

  const dispatch = useDispatch();
  const observerTarget = useRef(null);

  const q = seachParams.get("q");
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const searchState = useSelector((state) => state.search.searchProfileResults);
  const loading = useSelector((state) => state.search.loadingProfileSearch);
  const { data: profilesData, current_page, last_page } = searchState || {};

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    if (q) {
      setInputValue(q);
    }
  }, [q]);

  useEffect(() => {
    if (debouncedQuery.trim() === "") return;
    dispatch(searchProfiles({ query: debouncedQuery, page: 1 }));
  }, [debouncedQuery, dispatch]);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && current_page < last_page && !loading) {
        dispatch(
          searchProfiles({ query: debouncedQuery, page: current_page + 1 }),
        );
      }
    },
    [dispatch, debouncedQuery, current_page, last_page, loading],
  );

  useEffect(() => {
    const element = observerTarget.current;
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  return (
    <main className="min-h-screen bg-[var(--background)] py-6 px-4 transition-colors duration-300">
      <div className="max-w-[650px] mx-auto space-y-6">
        {/* Search Input */}
        <div className="bg-[var(--card-bg)] p-4 rounded-2xl shadow-sm border border-[var(--card-border)] sticky top-4 z-10 transition-colors duration-300">
          <TextField
            fullWidth
            placeholder="Search for people..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "var(--text-muted)" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {debouncedQuery && (
          <Typography className="text-sm font-bold text-[var(--text-muted)] px-2">
            Showing people for "{debouncedQuery}"
          </Typography>
        )}

        {/* Search Results List */}
        <div className="flex flex-col gap-3">
          {profilesData?.length > 0 ? (
            <>
              {profilesData.map((profile) => (
                <Link
                  key={profile.user_id}
                  href={`/profile/${profile.user_id}`}
                >
                  <div className="bg-[var(--card-bg)] p-4 rounded-2xl shadow-sm border border-[var(--card-border)] flex items-center justify-between gap-4 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={`http://127.0.0.1:8000/storage/${profile.avatar_url}`}
                        sx={{ width: 56, height: 56 }}
                      />
                      <div>
                        <Typography className="font-bold text-[var(--text-primary)] hover:underline cursor-pointer">
                          {profile.display_name}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* TRIGGER ELEMENT FOR PAGINATION */}
              <div
                ref={observerTarget}
                className="py-6 flex justify-center w-full"
              >
                {current_page < last_page && (
                  <CircularProgress size={24} sx={{ color: "#1477ff" }} />
                )}
                {current_page >= last_page && profilesData.length > 5 && (
                  <Typography className="text-sm text-[var(--text-muted)]">
                    No more profiles found.
                  </Typography>
                )}
              </div>
            </>
          ) : !loading && debouncedQuery ? (
            <div className="text-center py-16 bg-[var(--card-bg)] rounded-2xl border border-dashed border-[var(--card-border)]">
              <Typography className="text-[var(--text-muted)] font-medium text-lg">
                No people found.
              </Typography>
            </div>
          ) : !loading && !debouncedQuery ? (
            <div className="text-center py-16">
              <SearchIcon
                sx={{ fontSize: 48, color: "var(--card-border)" }}
                className="mb-2"
              />
              <Typography className="text-[var(--text-muted)] font-medium">
                Type a name above to search for people.
              </Typography>
            </div>
          ) : null}

          {/* Initial loading spinner */}
          {loading && (!profilesData || current_page === 1) && (
            <div className="flex justify-center py-10">
              <CircularProgress size={30} sx={{ color: "#1477ff" }} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
