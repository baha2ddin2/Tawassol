"use client";
import Link from "next/link";
import { IconButton, Avatar, Tooltip ,Badge} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logout } from "@/redux/reducers/AuthReducer";
import { notificationCountUnread } from "@/redux/reducers/notificationReducer";
import Dropdown from "./DropDownProfile";
import { Add } from "@mui/icons-material";
import { GooeyToaster } from "goey-toast";
import socket from "@/lib/soket";
import TopbarSkeleton from "./TopBarSkeletons";

const Topbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuth ,checkAuthLoading} = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(checkAuth());
    dispatch(notificationCountUnread());
    socket.connect()
    return ()=>{
      socket.disconnect()
      socket.on()
    }
  }, []);

  useEffect(() => {
    if (!isAuth && !checkAuthLoading) {
      router.push("/");
    }
  }, [isAuth,checkAuthLoading]);

  const user = useSelector((state) => state.auth.userInfo);
  const unreadCount = useSelector((state) => state.notification.unReadCount);
  const pathname = usePathname();
  const navLinks = [
    { name: "Home", href: "/home" },
    { name: "Explore", href: "/explore" },
    { name: "Messages", href: "/messages" },
    { name: "Profile", href: "/profile" },
  ];

  const handleLogout = async () => {
    const result = await dispatch(logout());
    if (logout.fulfilled.match(result)) router.push("/");
  };
  return (<>
    <GooeyToaster  position="top-center"/>
    {checkAuthLoading ? <TopbarSkeleton/> : <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b  border-gray-100">
      <div className="max-w-[1100px] mx-auto px-[18px] py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 font-bold">
          <Image
            width={30}
            height={30}
            className="w-7 h-7 rounded-lg object-cover"
            src="/logo.jpeg"
            alt="Logo"
          />
          <span className="text-base text-gray-900 hidden sm:block">
            Tawassol
          </span>
        </div>

        {/* Navigation - Pill Style */}
        <nav className="flex gap-1.5 p-1.5 bg-[#f1f6ff] border border-gray-100 rounded-full">
          {navLinks.map((item) => {
            const isActive = pathname == item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3.5 py-2 rounded-full text-[13px] font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-blue-600 border border-gray-100 shadow-sm"
                    : "text-[#3b4a67] hover:bg-[#eaf2ff]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Tooltip title="Notifications">
            <IconButton
              size="small"
              sx={{
                width: 38,
                height: 38,
                bgcolor: "white",
                border: "1px solid #f1f5f9",
                boxShadow: "0 10px 20px rgba(15,23,42,.05)",
              }}
            >
              <Link href={"/notification"}>
                {unreadCount === 0 ? (
                  <NotificationsNoneIcon fontSize="small" />
                ) : (
                  <Badge badgeContent={unreadCount} color="primary">
                    <NotificationsNoneIcon fontSize="small" />
                  </Badge>
                )}
              </Link>
            </IconButton>
          </Tooltip>
          <Tooltip title="create post">
            <IconButton
              size="small"
              sx={{
                width: 38,
                height: 38,
                bgcolor: "white",
                border: "1px solid #f1f5f9",
                boxShadow: "0 10px 20px rgba(15,23,42,.05)",
              }}
            >
              <Link href={"/create-post"}>
                  <Add fontSize="small" />
              </Link>
            </IconButton>
          </Tooltip>

          <Dropdown logout={handleLogout}>
            <Avatar
              src={
                user?.profile?.avatar_url &&
                `http://127.0.0.1:8000/storage/${user.profile.avatar_url}`
              }
              alt="user"
              sx={{
                width: 38,
                height: 38,
                border: "2px solid white",
                boxShadow: "0 10px 20px rgba(15,23,42,.08)",
              }}
            />
          </Dropdown>
        </div>
      </div>
    </header> }
    </>
  );
};

export default Topbar;
