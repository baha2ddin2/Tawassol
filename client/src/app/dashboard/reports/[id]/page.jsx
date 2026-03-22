"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
  Box,
  Stack,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import HistoryIcon from "@mui/icons-material/History";
import GavelIcon from "@mui/icons-material/Gavel";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useDispatch, useSelector } from "react-redux";
import { getReport, handelReport } from "@/redux/Slices/dashboardSlice";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

function safeLabel(value) {
  if (!value) return "-";
  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c?.toUpperCase());
}

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value.replace(" ", "T")));
  } catch {
    return value;
  }
}

export default function HandleReportPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter()

  const { report, loading } = useSelector((state) => state.dashboard);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (id) dispatch(getReport(id));
  }, [id, dispatch]);

  const targetInfo = useMemo(() => {
    if (!report) return null;

    if (report.report_type === "comment") {
      return {
        title: "Reported Comment",
        icon: <ChatBubbleOutlineIcon />,
        name: report.comment_owner_name || "Unknown user",
        avatar: report.comment_owner_avatar || null,
        content: report.comment_content || "No comment content",
        typeLabel: "Comment",
        id: report.comment_id || "-",
      };
    }

    if (report.report_type === "post") {
      return {
        title: "Reported Post",
        icon: <ArticleIcon />,
        name: report.post_owner_name || "Unknown user",
        avatar: report.post_owner_avatar || null,
        content: report.post_content || "No post content",
        typeLabel: "Post",
        id: report.post_id || "-",
      };
    }

    return {
      title: "Reported User",
      icon: <PersonIcon />,
      name: report.target_user_name || "Unknown user",
      avatar: report.target_user_avatar || null,
      content: null,
      typeLabel: "User",
      id: report.target_id || "-",
    };
  }, [report]);

  const evidenceMedia = useMemo(() => {
    if (!report?.post_media) return [];
    try {
      const parsed = JSON.parse(report.post_media);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [report]);

  const handleAction = async (action) => {
    if (!id) return;
    setLocalLoading(true);

    try {
      await dispatch(handelReport({ action, reportId: id }));
      router.push('/dashboard/reports')
      await dispatch(getReport(id));
    } finally {
      setLocalLoading(false);
    }
  };

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9]">
        <CircularProgress />
      </div>
    );
  }

  const isBusy = loading || localLoading;
  const isOpen = report.status === "in progress";
  const statusColor =
    report.status === "completed"
      ? "success"
      : report.status === "ignored"
      ? "default"
      : "warning";

  return (
    <div className="min-h-screen bg-[#F9FCFF] dark:bg-[#081F5C] p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-center gap-2 text-[#64748b] dark:text-[#D0E3FF] mb-6">
          <HistoryIcon fontSize="small" />
          <span className="text-sm font-bold hover:underline cursor-pointer transition-colors duration-300">
            Moderation Queue
          </span>
          <span className="text-xs">/</span>
          <span className="text-sm font-medium">
            Report #{report.report_id}
          </span>
        </div>

        <Paper
          elevation={0}
          className="rounded-[24px] border border-[#e2e8f0] dark:border-[#334EAC] overflow-hidden shadow-sm bg-transparent transition-colors duration-300"
        >
          <div className="bg-white dark:bg-[#081F5C] p-6 border-b border-[#f1f5f9] dark:border-[#334EAC] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <GavelIcon />
              </div>

              <div>
                <Typography className="font-black text-xl text-[#0f172a] dark:text-[#F9FCFF] transition-colors duration-300">
                  Handle Report
                </Typography>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Chip
                    label={safeLabel(report.report_type).toUpperCase()}
                    size="small"
                    className="bg-[#E7F1FF] dark:bg-[#334EAC] text-[#0f172a] dark:text-[#D0E3FF] font-black text-[10px] transition-colors duration-300"
                  />
                  <Chip
                    label={report?.status?.toUpperCase()}
                    size="small"
                    color={statusColor}
                    variant="outlined"
                    className="font-black text-[10px]"
                  />
                  <Typography className="text-[#64748b] dark:text-[#D0E3FF] text-xs font-bold uppercase tracking-widest transition-colors duration-300">
                    ID: {report.report_id}
                  </Typography>
                </div>
              </div>
            </div>

            {report.status !== "in progress" && (
              <Alert
                severity={report.status === "completed" ? "success" : "info"}
                className="rounded-xl font-bold py-0"
              >
                Case{" "}
                {report.status === "completed" ? "Resolved" : "Not Resolved"}
              </Alert>
            )}
          </div>

          <div className="p-6 md:p-8 bg-[#F9FCFF] dark:bg-[#081F5C] space-y-8 transition-colors duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Box className="p-4 rounded-2xl bg-white dark:bg-[#334EAC] border border-[#e2e8f0] dark:border-[#334EAC] transition-colors duration-300">
                <Typography className="text-[11px] font-black text-[#64748b] dark:text-[#D0E3FF] uppercase transition-colors duration-300">
                  Reporter
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center" mt={1}>
                  <Avatar src={`http://127.0.0.1:8000/storage/${report.reporter_avatar}` || undefined}>
                    {report.reporter_name?.[0]?.toUpperCase() || "U"}
                  </Avatar>
                  <Typography className="font-bold text-[#0f172a] dark:text-[#F9FCFF] transition-colors duration-300">
                    {report.reporter_name || "-"}
                  </Typography>
                </Stack>
              </Box>

              <Box className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/30 transition-colors duration-300">
                <Typography className="text-[11px] font-black text-red-500 dark:text-red-400 uppercase transition-colors duration-300">
                  Target
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center" mt={1}>
                  <Avatar src={ `http://127.0.0.1:8000/storage/${targetInfo?.avatar}` || undefined}>
                    {targetInfo?.name?.[0]?.toUpperCase() || "?"}
                  </Avatar>
                  <Box>
                    <Typography className="font-bold text-red-600 dark:text-red-300 transition-colors duration-300">
                      {targetInfo?.name || "-"}
                    </Typography>
                    <Typography className="text-xs text-red-500 font-medium opacity-90">
                      {targetInfo?.typeLabel} ID: {targetInfo?.id}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box className="p-4 rounded-2xl bg-white dark:bg-[#334EAC] border border-[#e2e8f0] dark:border-[#334EAC] transition-colors duration-300">
                <Typography className="text-[11px] font-black text-[#64748b] dark:text-[#D0E3FF] uppercase transition-colors duration-300">
                  Created At
                </Typography>
                <Typography className="font-bold text-[#0f172a] dark:text-[#F9FCFF] mt-1 transition-colors duration-300">
                  {formatDate(report.created_at)}
                </Typography>
              </Box>
            </div>

            <Divider className="dark:border-[#334EAC] transition-colors duration-300" />

            <div>
              <Typography className="text-xs font-black text-[#94a3b8] dark:text-[#D0E3FF] uppercase mb-2 transition-colors duration-300">
                Report Reason
              </Typography>
              <Paper
                variant="outlined"
                className="p-4 bg-white dark:bg-[#334EAC] border-[#e2e8f0] dark:border-[#334EAC] rounded-2xl transition-colors duration-300"
              >
                <Typography className="text-[#334155] dark:text-[#F9FCFF] leading-relaxed italic transition-colors duration-300">
                  “{report.reason || "-"}”
                </Typography>
              </Paper>
            </div>

            <div>
              <Typography className="text-xs font-black text-[#94a3b8] dark:text-[#D0E3FF] uppercase mb-3 transition-colors duration-300">
                Evidence Preview
              </Typography>

              <Paper
                variant="outlined"
                className="p-4 md:p-5 rounded-2xl border-[#e2e8f0] dark:border-[#334EAC] bg-white dark:bg-[#081F5C] transition-colors duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl mt-0.5 transition-colors duration-300">
                      <VisibilityOutlinedIcon />
                    </div>

                    <div>
                      <Typography className="font-bold text-sm text-[#0f172a] dark:text-[#F9FCFF] transition-colors duration-300">
                        {targetInfo?.title || "Evidence"}
                      </Typography>

                      <Typography className="text-sm text-[#64748b] dark:text-[#D0E3FF] mt-1 transition-colors duration-300">
                        {targetInfo?.content || "No content available."}
                      </Typography>

                      {evidenceMedia.length > 0 && (
                        <Typography className="text-xs text-[#94a3b8] dark:text-[#D0E3FF] opacity-80 mt-2 transition-colors duration-300">
                          {evidenceMedia.length} media file
                          {evidenceMedia.length > 1 ? "s" : ""} attached
                        </Typography>
                      )}
                    </div>
                  </div>

                  <Chip
                    label={safeLabel(report.report_type)}
                    size="small"
                    className="bg-[#E7F1FF] dark:bg-[#334EAC] text-[#64748b] dark:text-[#D0E3FF] font-bold transition-colors duration-300"
                  />
                </div>
              </Paper>
            </div>

            <Divider className="dark:border-[#334EAC] transition-colors duration-300" />

            {isOpen ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  fullWidth
                  variant="contained"
                  disabled={isBusy}
                  onClick={() => handleAction("ignore")}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl shadow-none normal-case"
                >
                  Ignore Report
                </Button>

                {(report.post_id || report.comment_id) && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    disabled={isBusy}
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => handleAction("delete")}
                    className="bg-red-500 hover:bg-red-600 font-bold py-3 rounded-xl shadow-lg shadow-red-500/20 normal-case"
                  >
                    Delete {safeLabel(report.report_type)}
                  </Button>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  disabled={isBusy}
                  startIcon={<BlockIcon />}
                  onClick={() => handleAction("block")}
                  className="bg-black hover:bg-gray-800 font-bold py-3 rounded-xl shadow-lg shadow-gray-900/20 normal-case"
                >
                  Block User Account
                </Button>
              </div>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CheckCircleOutlineIcon />}
                className="border-slate-200 text-slate-400 font-bold py-3 rounded-xl normal-case"
                disabled
              >
                Resolution Applied
              </Button>
            )}
          </div>

          <div className="bg-[#E7F1FF] dark:bg-[#334EAC] p-4 text-center transition-colors duration-300">
            <Typography className="text-[11px] font-bold text-[#64748b] dark:text-[#F9FCFF] uppercase tracking-tighter transition-colors duration-300">
              All moderation actions are logged for auditing purposes.
            </Typography>
          </div>
        </Paper>
      </div>
    </div>
  );
}