"use client";

import { Button, Avatar, CircularProgress } from "@mui/material";
import {
  Edit as EditIcon,
  MoreHoriz as MoreIcon,
  FavoriteBorder as HeartIcon,
  ChatBubbleOutline as ChatIcon,
  IosShare as ShareIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useCallback } from "react";
import {
  deslikeProfilePost,
  likeProfilePost,
  profileInfo,
  profilePosts,
} from "@/redux/Slices/profileSlice";
import PostCard from "@/components/Post";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const observerTarget = useRef(null);

  const infos = useSelector((state) => state.profile.profileInfo);
  const postsState = useSelector((state) => state.profile.profilePosts);
  const loading = useSelector((state) => state.profile.loadingProfilePosts);

  const { data: postsData, current_page, last_page } = postsState || {};

  // 1. Initial Load
  useEffect(() => {
    dispatch(profileInfo());
    dispatch(profilePosts(1)); 
  }, [dispatch]);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && current_page < last_page && !loading) {
        dispatch(profilePosts(current_page + 1));
      }
    },
    [dispatch, current_page, last_page, loading]
  );

  useEffect(() => {
    const element = observerTarget.current;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });

    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  function handelLike(post) {
    if (post.user_has_liked) {
      dispatch(deslikeProfilePost(post.post_id));
    } else {
      dispatch(likeProfilePost(post.post_id));
    }
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-[1100px] mx-auto">
        {/* Main Shell */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-xl p-5 md:p-8">
          {/* Profile Section */}
          {infos ? (
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[var(--card-border)] rounded-2xl p-6 bg-[var(--card-bg)] shadow-sm">
              <div className="flex items-center gap-6">
                <Avatar
                  src={`http://127.0.0.1:8000/storage/${infos.avatar_url}`}
                  sx={{
                    width: 92,
                    height: 92,
                    border: "4px solid var(--card-bg)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                />
                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-[var(--text-primary)]">
                    {infos.display_name}
                  </h1>
                  <p className="text-sm text-[var(--text-muted)] max-w-md leading-relaxed">
                    {infos.bio}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <Link href={"/profile/edit-profile"}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    className="rounded-full font-bold border-[var(--card-border)] text-[var(--text-primary)] normal-case hover:bg-[var(--hover-overlay)] transition-transform active:scale-95"
                  >
                    {t("profile.editProfile", "Edit Profile")}
                  </Button>
                </Link>
              </div>
            </section>
          ) : null}

          {infos ? (
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="bg-[var(--nav-pill-bg)] border border-[var(--card-border)] py-4 rounded text-center shadow-sm">
                <div className="text-xl font-black text-[var(--text-primary)]">
                  {infos.posts_count}
                </div>
                <div className="text-[11px] font-extrabold text-[var(--color-primary)] uppercase tracking-tight">
                  {t("profile.posts", "posts")}
                </div>
              </div>
              <Link href={"/profile/following"}>
                <div className="bg-[var(--nav-pill-bg)] border border-[var(--card-border)] py-4 rounded text-center shadow-sm">
                  <div className="text-xl font-black text-[var(--text-primary)]">
                    {infos.following_count}
                  </div>
                  <div className="text-[11px] font-extrabold text-[var(--color-primary)] uppercase tracking-tight">
                    {t("profile.following", "following")}
                  </div>
                </div>
              </Link>
              <Link href={"/profile/followers"}>
                <div className="bg-[var(--nav-pill-bg)] border border-[var(--card-border)] py-4 rounded text-center shadow-sm">
                  <div className="text-xl font-black text-[var(--text-primary)]">
                    {infos.followers_count}
                  </div>
                  <div className="text-[11px] font-extrabold text-[var(--color-primary)] uppercase tracking-tight">
                    {t("profile.followers", "followers")}
                  </div>
                </div>
              </Link>
            </section>
          ) : null}

          {/* Feed */}
          <section className="mt-4 flex flex-col justify-center items-center gap-4">
            {postsData?.length > 0 ? (
              <>
                {postsData.map((post, key) => (
                  <PostCard handelLike={handelLike} key={key} post={post} />
                ))}

                <div ref={observerTarget} className="py-6 flex justify-center w-full">
                  {current_page < last_page && (
                    <CircularProgress size={24} sx={{ color: "#1477ff" }} />
                  )}
                  {current_page >= last_page && postsData.length > 0 && (
                    <p className="text-sm text-[var(--text-muted)]">
                      {t("profile.endOfProfile", "You've reached the end of the profile.")}
                    </p>
                  )}
                </div>
              </>
            ) : !loading ? (
              <div className="text-center py-10">
                <p className="text-[var(--text-muted)] font-medium">{t("profile.noPosts", "No posts found.")}</p>
              </div>
            ) : null}

            {loading && !postsData && (
              <div className="flex justify-center py-10">
                <CircularProgress size={30} sx={{ color: "#1477ff" }} />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
