"use client";

import NotificationItem from "@/components/NotificationItem";
import { notification,  } from "@/redux/reducers/notificationReducer"; 
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Page() {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.notification.notificationData);

    useEffect(() => {
        dispatch(notification());
    }, [dispatch]);

    const handleMarkAllRead = () => {
        dispatch(markAllAsRead());
    };

    return (
        <div className="w-2/3 mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Notifications</h2>
                <button 
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 hover:underline font-medium"
                >
                    Mark all as read
                </button>
            </div>

            <div className="flex flex-col gap-2"> 
                {data?.data && data?.data.map((n) => (
                    <NotificationItem 
                        key={n.notification_id} 
                        notification={n} 
                        isSmall={true} 
                    />
                ))}
            </div>
        </div>
    );
}
