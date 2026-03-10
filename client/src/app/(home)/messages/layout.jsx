"use client";

import { contact } from "@/redux/reducers/messageReducer";
import { Avatar, Button } from "@mui/material";
import { GroupAdd } from "@mui/icons-material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateGroup from "@/components/create-group";

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { contacts } = useSelector((state) => state.message);

  useEffect(() => {
    dispatch(contact());
  }, [dispatch]);

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-gray-50">
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 bg-white flex flex-col border-r shadow-sm">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            size="small"
            startIcon={<GroupAdd />}
            className="!rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Group
          </Button>

          <CreateGroup open={open} setOpen={setOpen} />
        </div>

        {/* CONTACT LIST */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {contacts &&
            contacts.map((c) => (
              <Link
                key={c.user_id || c.group_id}
                href={
                  c.type === "private"
                    ? `/messages/${c.user_id}`
                    : `/messages/group/${c.group_id}`
                }
              >
                <div className="flex items-center gap-3 p-4 hover:bg-gray-100 transition-all cursor-pointer border-b rounded-r-xl">
                  {/* Avatar */}
                  <Avatar
                    src={`http://127.0.0.1:8000/storage/${
                      c.type === "private" ? c.avatar_url : c.photo_url
                    }`}
                    className="w-12 h-12 hover:scale-105 transition-transform duration-200"
                  />

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {c.type === "private" ? c.display_name : c.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {c.last_message || "Start a conversation"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="w-2/3 flex flex-col bg-gray-50 p-4 overflow-hidden">
        {children ? (
          children
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400 text-lg font-medium">
            Please select a conversation
          </div>
        )}
      </div>
    </div>
  );
}