"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import { Card, CardContent, Avatar, IconButton, Button, Divider } from '@mui/material';
import { MoreHoriz, FavoriteBorder, Favorite, ChatBubbleOutline, ShareOutlined } from '@mui/icons-material';
import Video from './video';
import releativeTime from 'dayjs/plugin/relativeTime'

import 'swiper/css';
import 'swiper/css/pagination';
import dayjs from 'dayjs';
import HashtagText from './hashtagText';
import Link from 'next/link';
import SharePost from './Share';
import Dropdown from './DropDown';
import { useSelector } from 'react-redux';

export default function PostCard({ post , handelLike }) {
  const user =useSelector((data)=>data.auth.userInfo.user )
  console.log(user)
  const mediaItems = typeof post.media === "string"? JSON.parse(post.media): post.media ||[]
  dayjs.extend(releativeTime)
  const time = dayjs(post.created_at).fromNow()
  return (
    <Card
  className={`mb-8 w-[600px] flex flex-col overflow-hidden rounded-xl border border-gray-200 shadow-sm ${
    mediaItems.length > 0 ? 'h-[600px]' : ''
  }`}
>
      {/* Header */}
      <div className="p-4 flex justify-between items-center shrink-0">
        <div className="flex gap-3 items-center">
          <Avatar src={`http://127.0.0.1:8000/storage/${post.avatar_url}`} className="border border-gray-100" />
          <div>
            <p className="font-bold text-sm leading-tight hover:underline cursor-pointer">{post.display_name}</p>
            <p className="text-gray-500 text-[11px] uppercase tracking-wider">{time}</p>
          </div>
        </div>
        {user && <IconButton size="small"><Dropdown isAuthor={post.author_id === user.user_id  } postId={post.post_id}  > <MoreHoriz /> </Dropdown> </IconButton>}
      </div>
      <div className="px-4 pb-3 text-[15px] leading-relaxed text-gray-800 shrink-0 line-clamp-2">
        <HashtagText text={post.content} /><br />
        <a className=' text-blue-600' href={post.external_link}>{post.external_link}</a>
      </div>

    
      {mediaItems.length > 0 && (
        <div className="relative flex-1 w-full bg-gray-50 border-y border-gray-100 overflow-hidden">
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="h-full w-full"
          >
            {mediaItems.map((item, index) => (
              <SwiperSlide key={item.media_id || index}>
                {item.type === "picture" ? (
                  <Image
                    src={`http://127.0.0.1:8000/storage/${item.url}`}
                    fill
                    className="object-cover"
                    alt="post-media"
                  />
                ) : (
                  <Video src={`http://127.0.0.1:8000/storage/${item.url}`} />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Footer: Kept at bottom */}
      <CardContent className="pt-3 shrink-0">
        <div className="flex justify-between items-center mb-2 px-1">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            {post.likes_count} likes
          </div>
          <div className="text-sm text-gray-500 hover:underline cursor-pointer">
            {post.comments_count} comments
          </div>
        </div>
        <Divider />
        <div className="flex justify-between items-center pt-1 h-8 -mx-2">
          <Button onClick={()=>handelLike(post)} fullWidth startIcon={post.user_has_liked ? <Favorite className="text-red-500" /> : <FavoriteBorder />} className="normal-case text-gray-600 font-normal">Like</Button>
          <Link href={`/post/${post.post_id}`} className="flex-1">
            <Button fullWidth startIcon={<ChatBubbleOutline />} className="normal-case text-gray-600 font-normal">Comment</Button>
          </Link>
          <Button fullWidth className="normal-case text-gray-600 font-normal"><SharePost url={`http://127.0.0.1:3000/post/${post.post_id}`} text={post.content} /></Button>
        </div>
      </CardContent>
      
    </Card>
  );
}
