"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchResult } from "@/redux/Slices/searchSlice";
import { Avatar, Card, CardContent, CircularProgress } from "@mui/material";
import Link from "next/link";
import HashtagText from "@/components/hashtagText";
import { deslikeFeedPost, likeFeedPost } from "@/redux/Slices/postSlice";
import PostCard from "@/components/Post";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const seachParams = useSearchParams();
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.search);
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?.user?.user_id;
  const q = seachParams.get("q");
  useEffect(() => {
    setQuery(q);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const timeout = setTimeout(() => {
        dispatch(searchResult(query));
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [query, dispatch]);
  function handelLike(post) {
    if (post.user_has_liked) {
      dispatch(deslikeFeedPost(post.post_id));
    } else {
      dispatch(likeFeedPost(post.post_id));
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <input
          type="text"
          placeholder="Search hashtags, posts, or users..."
          className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* {loading && (
        <div className="flex justify-center py-10">
          <CircularProgress />
        </div>
      )} */}

      {query && (
        <div className="space-y-6">
          {/* Hashtags */}
          {searchResults?.hashtags?.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Hashtags</h2>
              <div className="flex gap-2 flex-wrap">
                {searchResults.hashtags.map((h) => (
                  <Link
                    key={h.hashtag_id}
                    href={`/hashtag/${h.tag}`}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                  >
                    #{h.tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Profiles */}
          {searchResults?.profiles?.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Users</h2>
              <div className="space-y-2">
                {searchResults.profiles.map((p) => (
                  <Link key={p.user_id} href={`/profile/${p.user_id}`}>
                    <Card className="flex items-center gap-4 p-2 mt-2.5 hover:shadow-md transition">
                      <Avatar
                        src={`http://127.0.0.1:8000/storage/${p.avatar_url}`}
                      />
                      <div>
                        <p className="font-medium">{p.display_name}</p>
                        {p?.user_id !== userId
                          ? p.has_followed && (
                              <p className="text-xs text-gray-500">Following</p>
                            )
                          : null}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts */}
          {searchResults?.posts?.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Posts</h2>
              <div className="space-y-4">
                {searchResults.posts.map((post) => (
                  <PostCard
                    key={post.post_id}
                    handelLike={handelLike}
                    post={post}
                  />
                ))}
              </div>
            </div>
          )}

          {searchResults?.hashtags?.length === 0 &&
            searchResults?.profiles?.length === 0 &&
            searchResults?.posts?.length === 0 && (
              <p className="text-gray-500 text-center py-10">
                No results found
              </p>
            )}
        </div>
      )}
    </div>
  );
}
