"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  CircularProgress,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PostCard from "@/components/Post";
import { likePost, deslikePost } from "@/redux/Slices/postSlice";
import { deslikeSearchPost, likeSearchPost, searchPosts } from "@/redux/Slices/searchSlice";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const seachParams = useSearchParams();
  const dispatch = useDispatch();
  const observerTarget = useRef(null);

  const q = seachParams.get("q");
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const searchState = useSelector((state) => state.search.searchResults);
  const loading = useSelector((state) => state.search.loadingSearch);
  const { data: postsData, current_page, last_page } = searchState || {};

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

    dispatch(searchPosts({ query: debouncedQuery, page: 1 }));
  }, [debouncedQuery, dispatch]);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && current_page < last_page && !loading) {
        dispatch(
          searchPosts({ query: debouncedQuery, page: current_page + 1 }),
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

  const handleLike = (post) => {
    if (post.user_has_liked) {
      dispatch(deslikePost(post.post_id));
      dispatch(deslikeSearchPost(post.post_id))
    } else {
      dispatch(likePost(post.post_id));
      dispatch(likeSearchPost(post.post_id))
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] py-6 px-4 transition-colors duration-300">
      <div className="max-w-[650px] mx-auto space-y-6">
        {/* Search Input Bar */}
        <div className="bg-[var(--card-bg)] p-4 rounded-2xl shadow-sm border border-[var(--card-border)] sticky top-4 z-10 transition-colors duration-300">
          <TextField
            fullWidth
            placeholder="Search posts..."
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

        {/* Results Info */}
        {debouncedQuery && (
          <Typography className="text-sm font-bold text-[var(--text-muted)] px-2">
            Showing results for "{debouncedQuery}"
          </Typography>
        )}

        {/* Search Results Feed */}
        <div className="flex flex-col items-center gap-4">
          {postsData?.length > 0 ? (
            <>
              {postsData.map((post) => (
                <div
                  key={post.post_id}
                  className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--card-border)] overflow-hidden transition-colors duration-300"
                >
                  <PostCard post={post} handelLike={handleLike} />
                </div>
              ))}

              {/* TRIGGER ELEMENT FOR PAGINATION */}
              <div
                ref={observerTarget}
                className="py-6 flex justify-center w-full"
              >
                {current_page < last_page && (
                  <CircularProgress size={24} sx={{ color: "#1477ff" }} />
                )}
                {current_page >= last_page && postsData.length > 5 && (
                  <Typography className="text-sm text-[var(--text-muted)]">
                    No more results found.
                  </Typography>
                )}
              </div>
            </>
          ) : !loading && debouncedQuery ? (
            <div className="text-center py-16 bg-[var(--card-bg)] rounded-2xl border border-dashed border-[var(--card-border)]">
              <Typography className="text-[var(--text-muted)] font-medium text-lg">
                No posts found.
              </Typography>
              <Typography className="text-[var(--text-muted)] text-sm mt-1">
                Try searching for a different keyword.
              </Typography>
            </div>
          ) : !loading && !debouncedQuery ? (
            <div className="text-center py-16">
              <SearchIcon
                sx={{ fontSize: 48, color: "var(--card-border)" }}
                className="mb-2"
              />
              <Typography className="text-[var(--text-muted)] font-medium">
                Type something above to search.
              </Typography>
            </div>
          ) : null}

          {/* Initial loading state spinner */}
          {loading && (!postsData || current_page === 1) && (
            <div className="flex justify-center py-10">
              <CircularProgress size={30} sx={{ color: "#1477ff" }} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
