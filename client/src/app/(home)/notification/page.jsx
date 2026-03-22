"use client";

import NotificationItem from "@/components/NotificationItem";
import { markRead, notification } from "@/redux/Slices/notificationSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markAllRead } from "@/redux/Slices/notificationSlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useTranslation } from "react-i18next";

export default function Page() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { 
    data: notifications, 
    current_page, 
    last_page 
  } = useSelector((state) => state.notification.notificationData) || {};
  
  const loading = useSelector((state) => state.notification.loading);


  useEffect(() => {
    dispatch(notification(1));
  }, [dispatch]);

  const handleMarkAllRead = () => {
    dispatch(markAllRead());
  };

  const handleLoadMore = () => {
    if (current_page < last_page) {
      dispatch(notification(current_page + 1));
    }
  };

  return (
    <div className="w-full lg:w-2/3 mx-auto p-4 bg-[var(--background)] min-h-screen transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">{t("notification.title", "Notifications")}</h2>
        <button
          onClick={handleMarkAllRead}
          className="text-xs text-[var(--color-primary)] hover:underline font-medium"
        >
          {t("notification.markAllAsRead", "Mark all as read")}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {notifications &&
          notifications.map((n) => (
            <NotificationItem
              key={n.notification_id}
              notification={n}
              isSmall={true}
            />
          ))}
        <div className="mt-6 flex flex-col items-center">
          {loading ? (
            <LoadingSpinner />
          ) : (
            current_page < last_page && (
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--hover-overlay)] hover:border-[var(--color-primary)] transition-all shadow-sm"
              >
                {t("notification.loadMore", "Load More Notifications")}
              </button>
            )
          )}

          {current_page >= last_page && notifications?.length > 0 && (
            <p className="text-sm text-[var(--text-muted)] py-4">{t("notification.allCaughtUp", "You're all caught up!")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
