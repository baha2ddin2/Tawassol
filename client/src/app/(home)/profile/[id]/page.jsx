"use client";

import { Button, IconButton, Avatar,CircularProgress } from "@mui/material";
import {
  Edit as EditIcon,
  MoreHoriz as MoreIcon,
  FavoriteBorder as HeartIcon,
  ChatBubbleOutline as ChatIcon,
  IosShare as ShareIcon,
  Message,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useCallback } from "react";
import {
  deslikeProfilePost,
  likeProfilePost,
  postsByProfileId,
  ProfileById,
  followUser,
  unfollowUser,
} from "@/redux/Slices/profileSlice";
import PostCard from "@/components/Post";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Dropdown from "@/components/DropDown";

export default function ProfilePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const observerTarget = useRef(null);

  const user = useSelector((data) => data.auth.userInfo.user);
  const infos = useSelector((state) => state.profile.profileId);
  const postsState = useSelector((state) => state.profile.profilePosts);
  const loading = useSelector((state) => state.profile.loadingProfilePosts);

  const { data: postsData, current_page, last_page } = postsState || {};

  const router = useRouter();

  useEffect(() => {
    dispatch(ProfileById(id));
    dispatch(postsByProfileId({ userId: id, page: 1 }));
  }, []);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && current_page < last_page && !loading) {
        dispatch(postsByProfileId(current_page + 1));
      }
    },
    [dispatch, current_page, last_page, loading],
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

  useEffect(() => {
    if (user?.user_id === id) {
      router.push("/profile");
    }
  }, [user]);

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
                <Button
                  variant={"contained"}
                  color={"primary"}
                  className="rounded-full font-bold normal-case hover:bg-[var(--hover-overlay)] transition-transform active:scale-95"
                  onClick={() => {
                    if (infos.is_following) {
                      dispatch(unfollowUser(id));
                    } else {
                      dispatch(followUser(id));
                    }
                  }}
                >
                  {infos.is_following ? "Following" : "follow"}
                </Button>

                <Link href={`/messages/${id}`}>
                  <Button
                    variant="outlined"
                    startIcon={<Message />}
                    className="rounded-full font-bold border-[var(--card-border)] text-[var(--text-primary)] normal-case hover:bg-[var(--hover-overlay)] transition-transform active:scale-95"
                  >
                    Message
                  </Button>
                </Link>
                <Dropdown userId={id} isAuthor={false}>
                  <IconButton className="border border-[var(--card-border)] p-2">
                    <MoreIcon />
                  </IconButton>
                </Dropdown>
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
                  posts
                </div>
              </div>
              <Link href={`/profile/${id}/following`}>
                <div className="bg-[var(--nav-pill-bg)] border border-[var(--card-border)] py-4 rounded text-center shadow-sm">
                  <div className="text-xl font-black text-[var(--text-primary)]">
                    {infos.following_count}
                  </div>
                  <div className="text-[11px] font-extrabold text-[var(--color-primary)] uppercase tracking-tight">
                    following
                  </div>
                </div>
              </Link>
              <Link href={`/profile/${id}/followers`}>
                <div className="bg-[var(--nav-pill-bg)] border border-[var(--card-border)] py-4 rounded text-center shadow-sm">
                  <div className="text-xl font-black text-[var(--text-primary)]">
                    {infos.followers_count}
                  </div>
                  <div className="text-[11px] font-extrabold text-[var(--color-primary)] uppercase tracking-tight">
                    followers
                  </div>
                </div>
              </Link>
            </section>
          ) : null}

          {/* Feed */}
          <section className="mt-4 flex flex-col items-center gap-4">
            {postsData?.length > 0 ? (
              <>
                {postsData.map((post, key) => (
                  <PostCard handelLike={handelLike} key={key} post={post} />
                ))}

                {/* TRIGGER ELEMENT */}
                <div ref={observerTarget} className="py-6 flex justify-center w-full">
                  {current_page < last_page && (
                    <CircularProgress size={24} sx={{ color: "#1477ff" }} />
                  )}
                  {current_page >= last_page && postsData.length > 0 && (
                    <p className="text-sm text-[var(--text-muted)]">
                      You've reached the end of the profile.
                    </p>
                  )}
                </div>
              </>
            ) : !loading ? (
              <div className="text-center py-10">
                <p className="text-[var(--text-muted)] font-medium">No posts found.</p>
              </div>
            ) : null}

            {/* Initial loading state spinner */}
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
