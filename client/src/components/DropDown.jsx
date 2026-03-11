"use client";
import { deleteComment, deletePost } from "@/redux/Slices/postSlice";
import { deletePostProfile } from "@/redux/Slices/profileSlice";
import { Flag } from "@mui/icons-material";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import ReportModal from "./reportModel";

export default function Dropdown({ children, isAuthor, postId, commentId }) {
  const [open, setOpen] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  function handelDelete() {
    if (postId) {
      dispatch(deletePost(postId));
      dispatch(deletePostProfile(postId));
    } else {
      dispatch(deleteComment(commentId));
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)}>{children}</button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-3 w-44 bg-white rounded-2xl shadow-xl border 
        transform transition-all duration-200 ease-out z-50
        ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <ul className="py-2 text-sm text-gray-700">
          {!isAuthor ? (
            <li>
              <button
                onClick={() => setOpenReport(true)}
                className="w-full text-left flex justify-between text-red-600 px-4 py-2 hover:bg-gray-100 transition"
              >
                <span>report</span> <Flag />
              </button>
            </li>
          ) : (
            <li>
              <button
                onClick={handelDelete}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
              >
                delete {postId ? "post" : "comment"}
              </button>
            </li>
          )}
        </ul>
        <ReportModal
          open={openReport}
          onClose={() => setOpenReport(false)}
          type="post"
          id={postId}
        />
      </div>
    </div>
  );
}
