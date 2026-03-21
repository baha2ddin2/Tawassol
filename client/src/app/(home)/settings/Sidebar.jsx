"use client";
import { Typography } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailIcon from "@mui/icons-material/Email";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Dashboard, Palette, Language } from "@mui/icons-material";
import Link from "next/link";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { gooeyToast } from "goey-toast";
import { useTranslation } from "react-i18next";

const SidebarButton = ({ active, onClick, icon, label, color = "text-[var(--text-muted)]" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-left w-full ${
      active
        ? "bg-[var(--color-primary)] text-white shadow-lg"
        : `${color} hover:bg-[var(--hover-overlay)] hover:text-[var(--text-primary)]`
    }`}
  >
    {icon}
    {label}
  </button>
);

export default function Sidebar({ activeTab, setActiveTab, isAdmin, onDeleteClick }) {
    const router = useRouter();
    const { t } = useTranslation();
    
    function handleDelete(){
        api.delete('/user')
        .then((res)=>router.push('/'))
        .catch((err)=>gooeyToast.error(err.response.data.message))
    }
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <Typography variant="h4" className="font-black text-[32px] mb-6 tracking-tight" sx={{ color: "var(--text-primary)" }}>
        {t("settings.title")}
      </Typography>

      <div className="flex flex-col gap-2">
        <SidebarButton active={activeTab === "account"} onClick={() => setActiveTab("account")} icon={<PersonOutlineIcon />} label={t("settings.account")} />
        <SidebarButton active={activeTab === "email"} onClick={() => setActiveTab("email")} icon={<EmailIcon />} label={t("settings.email")} />
        <SidebarButton active={activeTab === "password"} onClick={() => setActiveTab("password")} icon={<LockOutlinedIcon />} label={t("settings.password")} />
        <SidebarButton active={activeTab === "reports"} onClick={() => setActiveTab("reports")} icon={<ReportProblemOutlinedIcon />} label={t("settings.reports")} />
        
        <hr className="my-4 border-[var(--card-border)]" />

        <SidebarButton active={activeTab === "appearance"} onClick={() => setActiveTab("appearance")} icon={<Palette />} label={t("settings.appearance")} />
        <SidebarButton active={activeTab === "language"} onClick={() => setActiveTab("language")} icon={<Language />} label={t("settings.language")} />

        <hr className="my-4 border-[var(--card-border)]" />

        <SidebarButton onClick={handleDelete} icon={<DeleteOutlineIcon />} label={t("settings.deleteAccount")} color="text-[var(--danger)]" />

        {isAdmin ? (
          <Link href="/dashboard/analytics" className="no-underline">
            <SidebarButton icon={<Dashboard />} label="Admin Dashboard" />
          </Link>
        ):null}
      </div>
    </aside>
  );
}
