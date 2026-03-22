"use client";
import {
  feedPosts,
  followSuggetion,
  suggetionFriends,
  unfollowSuggestion,
} from "@/redux/Slices/postSlice";
import { useSelector, useDispatch } from "react-redux";
import PostCard from "@/components/Post";
import { useEffect, useRef, useCallback } from "react";
import SkeletonChildren from "@/components/Skelatons";
import { deslikeFeedPost, likeFeedPost } from "@/redux/Slices/postSlice";
import RightSidebar from "@/components/RightSidebar";
import SuggestionSkeleton from "@/components/SuggestionSkeleton";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function HomePage() {
  const dispatch = useDispatch();
  const {
    data: postsData,
    current_page,
    last_page,
  } = useSelector((state) => state.post.feedPosts);
  const suggestions = useSelector((state) => state.post.suggetionFriends);

  const observerTarget = useRef(null);

  useEffect(() => {
    dispatch(feedPosts(1));
    dispatch(suggetionFriends());
  }, [dispatch]);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && current_page < last_page) {
        dispatch(feedPosts(current_page + 1));
      }
    },
    [dispatch, current_page, last_page],
  );

  useEffect(() => {
    const element = observerTarget.current;
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });

    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  function handelLike(post) {
    if (post.user_has_liked) {
      dispatch(deslikeFeedPost(post.post_id));
    } else {
      dispatch(likeFeedPost(post.post_id));
    }
  }

  function handelFollow(user) {
    if (user.has_followed) {
      dispatch(unfollowSuggestion(user.user_id));
    } else {
      dispatch(followSuggetion(user.user_id));
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-center lg:gap-10 p-4 lg:p-6">
        
        {/* MOBILE SUGGESTIONS (TOP) */}
        <div className="block lg:hidden w-full max-w-[600px] mx-auto mb-6">
            {postsData?.length > 0 ? (
               <RightSidebar suggestions={suggestions} handelFollow={handelFollow} />
            ) : (
               <SuggestionSkeleton />
            )}
        </div>

        <main className="w-full max-w-[600px] mx-auto lg:mx-0 space-y-6">
          <div className="flex flex-col w-full">
            {postsData?.length > 0 ? (
              <>
                {postsData.map((post, key) => (
                  <PostCard handelLike={handelLike} key={key} post={post} />
                ))}
                
                <div ref={observerTarget} className="h-10 flex justify-center items-center">
                  {current_page < last_page && <LoadingSpinner/> }
                </div>
              </>
            ) : (
              <SkeletonChildren />
            )}
          </div>
        </main>

        {/* DESKTOP SUGGESTIONS (RIGHT SIDEBAR) */}
        <div className="hidden lg:block">
            {postsData?.length > 0 ? (
               <RightSidebar suggestions={suggestions} handelFollow={handelFollow} />
            ) : (
               <SuggestionSkeleton />
            )}
        </div>
      </div>
    </div>
  );
}
