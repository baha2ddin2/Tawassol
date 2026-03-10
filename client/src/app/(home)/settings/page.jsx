"use client";

import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Switch,
  Chip,
  Paper,
  Typography,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VerifiedIcon from "@mui/icons-material/Verified";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Dashboard } from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { myReport } from "@/redux/reducers/reportReducer";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const [isPrivate, setIsPrivate] = useState(false);
  const [email, setEmail] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const { reports } = useSelector((state) => state.report);
  const user = userInfo?.user;
  const is_private = userInfo?.user?.is_private;
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(myReport());
    setIsPrivate(is_private);
    setEmail(user?.email);
    console.log(user?.is_admin)
  }, [user]);
  return (
    <div className="min-h-screen bg-[#f6f8fc] font-sans text-[#0f172a]">
      <main className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <Typography
            variant="h4"
            className="font-black text-[32px] mb-6 tracking-tight"
          >
            Settings
          </Typography>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-left ${
                activeTab === "account"
                  ? "bg-[#1477ff] text-white shadow-lg shadow-blue-500/20"
                  : "text-[#64748b] hover:bg-[#eef3fb] hover:text-[#0f172a]"
              }`}
            >
              <PersonOutlineIcon />
              Account Info
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-left ${
                activeTab === "reports"
                  ? "bg-[#1477ff] text-white shadow-lg shadow-blue-500/20"
                  : "text-[#64748b] hover:bg-[#eef3fb] hover:text-[#0f172a]"
              }`}
            >
              <ReportProblemOutlinedIcon />
              My Reports
            </button>

            {/* --- Admin Dashboard Button --- */}
            {user?.is_admin ? 
                <Link href={"/dashboard/analytics"}>
                  <button className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-left text-[#64748b] hover:bg-[#eef3fb] hover:text-[#0f172a]">
                    <Dashboard />
                    Admin Dashboard
                  </button>
                </Link>
              :null}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-grow max-w-[800px]">
          {activeTab === "account" && (
            <div className="space-y-6 animate-fade-in">
              {/* Profile Information Section */}
              <Paper
                elevation={0}
                className="border border-[#e7edf7] rounded-3xl overflow-hidden shadow-sm"
              >
                <div className="bg-[#f8fafd] px-6 py-4 border-b border-[#e7edf7] flex justify-between items-center">
                  <Typography className="font-extrabold text-lg">
                    Profile Information
                  </Typography>
                  {user?.email_verified_at !== null ? (
                    <Chip
                      icon={<VerifiedIcon />}
                      label="Email validated"
                      color="primary"
                      size="small"
                      className="bg-blue-100 text-blue-700 font-bold"
                    />
                  ) : (
                    <Chip
                      icon={<ErrorOutlineIcon style={{ color: "#c2410c" }} />}
                      label="Email not validated"
                      size="small"
                      className="bg-orange-100 text-orange-700 font-bold border border-orange-200"
                    />
                  )}
                </div>

                <div className="p-6 flex flex-col gap-1 space-y-5">
                  <div className="space-y-3">
                    <TextField
                      fullWidth
                      label="Email Address"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      variant="outlined"
                    />
                    {user?.email_verified_at === null && (
                      <Button
                        size="small"
                        variant="text"
                        color="warning"
                        startIcon={<NotificationsNoneIcon />}
                        className="text-orange-600 font-bold hover:bg-orange-50 lowercase transition-all"
                        onClick={() => {
                          router.push("/verify-email");
                        }}
                      >
                        Verify your email now
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="contained"
                    className="bg-[#1477ff] hover:bg-blue-700 font-bold normal-case rounded-xl py-2.5 px-6 shadow-md shadow-blue-500/20"
                  >
                    Save Changes
                  </Button>
                </div>
              </Paper>

              {/* Password Section */}
              <Paper
                elevation={0}
                className="border border-[#e7edf7] rounded-3xl overflow-hidden shadow-sm"
              >
                <div className="bg-[#f8fafd] px-6 py-4 border-b border-[#e7edf7]">
                  <Typography className="font-extrabold text-lg">
                    Change Password
                  </Typography>
                </div>
                <div className="p-6 flex flex-col gap-2 space-y-5">
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    variant="outlined"
                  />
                  <Button
                    variant="outlined"
                    className="border-[#1477ff] text-[#1477ff] font-bold normal-case rounded-xl py-2.5 px-6"
                  >
                    Update Password
                  </Button>
                </div>
              </Paper>

              {/* Privacy Section */}
              <Paper
                elevation={0}
                className="border border-[#e7edf7] rounded-3xl overflow-hidden shadow-sm"
              >
                <div className="bg-[#f8fafd] px-6 py-4 border-b border-[#e7edf7]">
                  <Typography className="font-extrabold text-lg">
                    Account Privacy
                  </Typography>
                </div>
                <div className="p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <LockOutlinedIcon />
                    </div>
                    <div>
                      <Typography className="font-bold text-[#0f172a]">
                        Private Account
                      </Typography>
                      <Typography className="text-sm text-[#64748b]">
                        When private, only people you approve can see your
                        content.
                      </Typography>
                    </div>
                  </div>
                  <Switch
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    color="primary"
                  />
                </div>
              </Paper>

              {/* Danger Zone */}
              <Paper
                elevation={0}
                className="border border-red-100 rounded-3xl overflow-hidden shadow-sm bg-red-50/30"
              >
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <Typography className="font-extrabold text-red-600 text-lg">
                      Delete Account
                    </Typography>
                    <Typography className="text-sm text-red-600/80">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </Typography>
                  </div>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    className="bg-red-600 hover:bg-red-700 font-bold normal-case rounded-xl w-full py-2.5 px-6 shadow-md shadow-red-500/20 whitespace-nowrap"
                  >
                    Delete Account
                  </Button>
                </div>
              </Paper>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6 animate-fade-in">
              <Typography variant="h5" className="font-black mb-4">
                Report History
              </Typography>

              <div className="space-y-4">
                {reports?.data?.map((report) => (
                  <Paper
                    key={report.report_id}
                    elevation={0}
                    className="p-5 border border-[#e7edf7] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-blue-200 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Typography className="font-extrabold text-[#0f172a]">
                          Report #{report.report_id}
                        </Typography>
                        <Chip
                          label={report.report_type.toUpperCase()}
                          size="small"
                          className="bg-slate-100 text-slate-600 text-[11px] font-black tracking-wider"
                        />
                      </div>
                      <Typography className="text-[#64748b] text-sm font-medium">
                        Reason: {report.reason}
                      </Typography>
                      <Typography className="text-[#94a3b8] text-xs mt-2">
                        Submitted:{" "}
                        {new Date(report.created_at).toLocaleDateString()}
                      </Typography>
                    </div>

                    <div>
                      <Chip
                        label={
                          report.status.charAt(0).toUpperCase() +
                          report.status.slice(1)
                        }
                        className={`font-bold ${
                          report.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : report.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                        }`}
                      />
                    </div>
                  </Paper>
                ))}

                {reports?.data?.length === 0 && (
                  <div className="text-center py-12 text-[#64748b]">
                    <ReportProblemOutlinedIcon
                      sx={{ fontSize: 48, opacity: 0.5, mb: 2 }}
                    />
                    <Typography>
                      You haven't submitted any reports yet.
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
