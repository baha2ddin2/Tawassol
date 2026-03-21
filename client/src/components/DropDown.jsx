"use client";
import { deleteComment, deletePost } from "@/redux/Slices/postSlice";
import { deletePostProfile } from "@/redux/Slices/profileSlice";
import { Flag } from "@mui/icons-material";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import ReportModal from "./ReportModel";
import { useTranslation } from "react-i18next";

export default function Dropdown({
  children,
  isAuthor,
  postId,
  commentId,
  userId,
}) {
  const [open, setOpen] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
      <div onClick={() => setOpen(!open)}>{children}</div>

      <div
        className={`absolute right-0 mt-3 w-44 bg-[var(--card-bg)] rounded-2xl shadow-xl border border-[var(--card-border)] 
        transform transition-all duration-200 ease-out z-50
        ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <ul className="py-2 text-sm text-[var(--text-primary)]">
          {!isAuthor ? (
            <li>
              <div
                onClick={() => setOpenReport(true)}
                className="w-full cursor-pointer text-left flex justify-between text-red-600 px-4 py-2 hover:bg-[var(--hover-overlay)] transition"
              >
                <span>{t("post.report", "report")}</span> <Flag />
              </div>
            </li>
          ) : (
            <li>
              <div
                onClick={handelDelete}
                className="w-full cursor-pointer text-left px-4 py-2 text-red-600 hover:bg-[var(--hover-overlay)] transition"
              >
                {t("post.delete", "delete")} {postId ? t("post.post", "post") : t("post.comment", "comment")}
              </div>
            </li>
          )}
        </ul>

        {postId ? (
          <ReportModal
            open={openReport}
            onClose={() => setOpenReport(false)}
            type="post"
            id={postId}
          />
        ) : null}

        {commentId ? (
          <ReportModal
            open={openReport}
            onClose={() => setOpenReport(false)}
            type="comment"
            id={commentId}
          />
        ) : null}

        {userId ? (
          <ReportModal
            open={openReport}
            onClose={() => setOpenReport(false)}
            type="user"
            id={userId}
          />
        ) : null}
      </div>
    </div>
  );
}
