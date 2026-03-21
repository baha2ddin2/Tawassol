"use client";
import Link from "next/link";
import { IconButton, Avatar, Tooltip, Badge } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logout } from "@/redux/Slices/AuthSlice";
import { notificationCountUnread } from "@/redux/Slices/notificationSlice";
import Dropdown from "./DropDownProfile";
import { Add } from "@mui/icons-material";
import { gooeyToast, GooeyToaster } from "goey-toast";
import socket from "@/lib/soket";
import TopbarSkeleton from "./TopBarSkeletons";
import { useTranslation } from "react-i18next";

const Topbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuth, checkAuthLoading } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(notificationCountUnread());
    socket.connect();
    const handel = (data) => {
      console.log(data);
    };
    socket.emit("joinNotificationRoom");
    socket.on("joinedNotificationRoom", handel);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const inMessages = pathname.startsWith("/messages");
    const handelNewNotification = (data) => {
      if (!inMessages) {
        gooeyToast(data.message, {
          description: `${data.data.content} ${data.data.content && data?.data?.media?.length !== 0 ? "and" : ""} ${data?.data?.media?.length == 0 ? "" : ` ${data?.data?.media?.length} 📷 `}`,
        });
      }
    };
    socket.on("new_message", handelNewNotification);
    return () => socket.off("new_message", handelNewNotification);
  }, [pathname]);

  useEffect(() => {
    if (!isAuth && !checkAuthLoading) {
      router.push("/");
    }
  }, [isAuth, checkAuthLoading]);

  const user = useSelector((state) => state.auth.userInfo);
  const unreadCount = useSelector((state) => state.notification.unReadCount);

  const navLinks = [
    { name: t("nav.home"), href: "/home" },
    { name: t("nav.explore"), href: "/explore" },
    { name: t("nav.messages"), href: "/messages" },
    { name: t("nav.profile"), href: "/profile" },
  ];

  const handleLogout = async () => {
    const result = await dispatch(logout());
    if (logout.fulfilled.match(result)) router.push("/");
  };

  return (
    <>
      <GooeyToaster position="top-center" />
      {checkAuthLoading ? (
        <TopbarSkeleton />
      ) : (
        <header className="sticky top-0 z-50 bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--topbar-border)] transition-colors duration-300">
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
              <span className="text-base text-[var(--text-primary)] hidden sm:block font-bold">
                Tawassol
              </span>
            </div>

            {/* Navigation - Pill Style (hidden on mobile) */}
            <nav className="hidden md:flex gap-1.5 p-1.5 bg-[var(--nav-pill-bg)] border border-[var(--card-border)] rounded-full transition-colors duration-300">
              {navLinks.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3.5 py-2 rounded-full text-[13px] font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)] border border-[var(--card-border)] shadow-sm"
                        : "text-[var(--nav-text)] hover:bg-[var(--hover-overlay)]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Tooltip title={t("nav.notifications")}>
                <IconButton
                  size="small"
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    boxShadow: "var(--shadow-sm)",
                    "&:hover": { bgcolor: "var(--hover-overlay)" },
                  }}
                >
                  <Link href={"/notification"}>
                    {unreadCount === 0 ? (
                      <NotificationsNoneIcon fontSize="small" sx={{ color: "var(--text-muted)" }} />
                    ) : (
                      <Badge badgeContent={unreadCount} color="primary">
                        <NotificationsNoneIcon fontSize="small" sx={{ color: "var(--text-muted)" }} />
                      </Badge>
                    )}
                  </Link>
                </IconButton>
              </Tooltip>
              <Tooltip title={t("nav.createPost")}>
                <IconButton
                  size="small"
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    boxShadow: "var(--shadow-sm)",
                    "&:hover": { bgcolor: "var(--hover-overlay)" },
                  }}
                >
                  <Link href={"/create-post"}>
                    <Add fontSize="small" sx={{ color: "var(--text-muted)" }} />
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
                    border: "2px solid var(--card-border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                />
              </Dropdown>
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default Topbar;
