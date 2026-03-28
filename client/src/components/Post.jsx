"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import {
  Card,
  CardContent,
  Avatar,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import {
  MoreHoriz,
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
  ShareOutlined,
} from "@mui/icons-material";
import Video from "./Video";
import releativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import dayjs from "dayjs";
import HashtagText from "./HashtagText";
import Link from "next/link";
import SharePost from "./Share";
import Dropdown from "./DropDown";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function PostCard({ post, handelLike }) {
  const user = useSelector((data) => data.auth.userInfo.user);
  const { t } = useTranslation();
  const mediaItems =
    typeof post.media === "string" ? JSON.parse(post.media) : post.media || [];
  dayjs.extend(releativeTime);
  const time = dayjs(post.created_at).fromNow();
  return (
    <Card
      elevation={0}
      className={`mb-4 w-full md:mb-8 lg:w-[600px] flex flex-col overflow-hidden lg:rounded-xl border-y lg:border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm transition-colors duration-300 ${
        mediaItems.length > 0 ? "h-[450px] md:h-[600px]" : ""
      }`}
      sx={{ borderRadius: { xs: 0, lg: "12px" }, overflow: "hidden" }}
    >
      {/* Header */}
      <div className="p-3 md:p-4 flex justify-between items-center shrink-0">
        <div className="flex gap-3 items-center">
          <Avatar
            src={`http://127.0.0.1:8000/storage/${post.avatar_url}`}
            className="border border-[var(--card-border)]"
          />
          <div>
            <Link href={`/profile/${post.author_id}`}>
              <p className="font-bold text-sm leading-tight hover:underline cursor-pointer text-[var(--text-primary)]">
                {post.display_name}
              </p>
            </Link>
            <p className="text-[var(--text-muted)] text-[11px] uppercase tracking-wider">
              {time}
            </p>
          </div>
        </div>
        {user && (
          <IconButton size="small">
            <Dropdown
              isAuthor={post.author_id === user.user_id}
              postId={post.post_id}
            >
              {" "}
              <MoreHoriz />{" "}
            </Dropdown>{" "}
          </IconButton>
        )}
      </div>
      <div className="px-4 pb-3 text-[15px] leading-relaxed text-[var(--text-primary)] shrink-0 line-clamp-2">
        <HashtagText text={post.content} />
        <br />
        <a className=" text-blue-600" href={post.external_link}>
          {post.external_link}
        </a>
      </div>

      {mediaItems.length > 0 && (
        <div className="relative flex-1 w-full bg-black/90 border-y border-[var(--card-border)] overflow-hidden">
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation
            className="h-full w-full post-swiper"
          >
            {mediaItems.map((item, index) => (
              <SwiperSlide key={`media-${item.media_id || item.id}-${index}`} className="flex items-center justify-center">
                {item.type === "picture" ? (
                  <Image
                    src={`http://127.0.0.1:8000/storage/${item.url}`}
                    fill
                    className="object-contain"
                    alt="post-media"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                ) : (
                  <Video src={`http://127.0.0.1:8000/storage/${item.url}`} />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <CardContent className="pt-3 shrink-0">
        <div className="flex justify-between items-center mb-2 px-1">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
            {post.likes_count} likes
          </div>
          <div className="text-sm text-[var(--text-muted)] hover:underline cursor-pointer">
            {post.comments_count} comments
          </div>
        </div>
        <Divider />
       <div className="flex items-center gap-2 pt-1 h-10 -mx-2">
  
  {/* LIKE */}
  <motion.div className="relative flex-1" whileTap={{ scale: 0.95 }}>
    <Button
      onClick={() => handelLike(post)}
      startIcon={
        <motion.div
          key={post.user_has_liked ? "liked" : "not-liked"}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {post.user_has_liked ? (
            <Favorite className="text-red-500" />
          ) : (
            <FavoriteBorder sx={{ color: "var(--text-primary)" }} />
          )}
        </motion.div>
      }
      className="w-full normal-case text-[var(--text-primary)] font-normal"
    >
      {t("post.like", "Like")}
    </Button>

    {post.user_has_liked===1 && (
      <motion.span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-400 pointer-events-none"
        initial={{ scale: 0 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        ❤️
      </motion.span>
    )}
  </motion.div>

  {/* COMMENT */}
  <Link href={`/post/${post.post_id}`} className="flex-1">
    <Button
      className="w-full normal-case text-[var(--text-primary)] font-normal"
      startIcon={<ChatBubbleOutline sx={{ color: "var(--text-primary)" }} />}
    >
      {t("post.comment", "Comment")}
    </Button>
  </Link>

  {/* SHARE */}
  <div className="flex-1" onClick={(e) => e.stopPropagation()}>
    <Button component="div" className="w-full normal-case text-[var(--text-primary)] font-normal">
      <SharePost
        url={`http://127.0.0.1:3000/post/${post.post_id}`}
        text={post.content}
      />
    </Button>
  </div>

</div>
      </CardContent>
    </Card>
  );
}
