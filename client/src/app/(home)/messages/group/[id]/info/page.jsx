"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { 
  deleteGroup, 
  getGroupDetails,
  removeMemberFromGroup,
  makeMemberAdmin
} from "@/redux/Slices/messageSlice";
import {
  Avatar,
  CircularProgress,
  Chip,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import dayjs from "dayjs";
import AddMemberModal from "@/components/AddMembersModel";
import { useTranslation } from "react-i18next";

export default function GroupDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: "", title: "", content: "" });
  
  const { groupInfo, loading } = useSelector((state) => state.message);
  const { user } = useSelector((data) => data.auth.userInfo);
  const { t } = useTranslation();

  const router = useRouter();

  const me = groupInfo?.members?.find((m) => m.user_id === user?.user_id);
  const isAdmin = me?.role === "admin";
  const isOldestAdmin = groupInfo?.members
    ?.filter((m) => m.role === "admin")
    ?.sort((a, b) => new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime())[0]?.user_id === user?.user_id;

  useEffect(() => {
    dispatch(getGroupDetails(id));
  }, [id, dispatch]);

  const handleOpenMenu = (event, member) => {
    setSelectedMember(member);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedMember(null);
  };

  const handleOpenConfirm = (type) => {
    if (type === "remove") {
      setConfirmDialog({ 
        open: true, type: "remove", 
        title: t("messages.removeMember", "Remove Member"), content: t("messages.confirmRemoveMember", "Are you sure you want to remove this member?") 
      });
    } else if (type === "make_admin") {
      setConfirmDialog({ 
        open: true, type: "make_admin", 
        title: t("messages.makeAdmin", "Make Admin"), content: t("messages.confirmMakeAdmin", "Are you sure you want to make this user an admin?") 
      });
    } else if (type === "delete_group") {
      setConfirmDialog({ 
        open: true, type: "delete_group", 
        title: t("messages.deleteGroup", "Delete Group"), content: "Are you sure you want to delete this entire group? This action is permanent." 
      });
    }
  };

  const handleConfirmAction = () => {
    if (confirmDialog.type === "remove" && selectedMember) {
      dispatch(removeMemberFromGroup({ groupId: id, userId: selectedMember.user_id }));
    } else if (confirmDialog.type === "make_admin" && selectedMember) {
      dispatch(makeMemberAdmin({ groupId: id, userId: selectedMember.user_id }));
    } else if (confirmDialog.type === "delete_group") {
      dispatch(deleteGroup(id)).then(() => router.push("/messages"));
    }
    setConfirmDialog({ ...confirmDialog, open: false });
    handleCloseMenu();
  };

  const handleCancelAction = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
    handleCloseMenu();
  };

  const handleRemoveMember = () => handleOpenConfirm("remove");
  const handleMakeAdmin = () => handleOpenConfirm("make_admin");

  if (loading || !groupInfo) {
    return (
      <div className="flex items-center justify-center h-full bg-[var(--background)] transition-colors duration-300">
        <CircularProgress sx={{ color: "var(--color-primary)" }} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 h-[calc(100dvh-70px)] md:h-[calc(100vh-70px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--card-border)] scrollbar-track-transparent bg-[var(--background)] transition-colors duration-300 relative">
      {/* Group Header */}
      <div className="flex flex-col items-center text-center mb-8 p-6 bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] shadow-sm transition-colors duration-300">
        <Avatar
          src={groupInfo.photo_url ? `http://127.0.0.1:8000/storage/${groupInfo.photo_url}` : "/groupAvatar.jpeg"}
          sx={{ width: 120, height: 120 }}
          className="border-4 border-[var(--card-border)] shadow-sm"
        />
        <h1 className="text-2xl font-black text-[var(--text-primary)] mt-4 tracking-tight">
          {groupInfo.name}
        </h1>
        <p className="text-[var(--text-muted)] mt-2 max-w-md">
          {groupInfo.description || t("messages.noDescription")}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
          <Chip
            icon={<GroupIcon style={{ fontSize: 16 }} />}
            label={`${groupInfo?.members?.length || 0} ${t("messages.members")}`}
            className="bg-[var(--nav-pill-bg)] text-[var(--color-primary)] font-bold border border-[var(--card-border)]"
            sx={{
               backgroundColor: 'var(--nav-pill-bg)',
               color: 'var(--color-primary)',
               border: '1px solid var(--card-border)',
               fontWeight: 'bold'
            }}
          />
          <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest">
            {t("messages.created")} {dayjs(groupInfo.created_at).format("MMM D, YYYY")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          {isAdmin && (
            <Button
              variant="outlined"
              onClick={() => router.push(`/messages/group/${id}/info/edit`)}
              className="rounded-xl font-bold normal-case px-4 py-2"
              sx={{
                borderColor: "var(--color-primary)",
                color: "var(--color-primary)",
                "&:hover": { bgcolor: "var(--hover-overlay)", borderColor: "var(--color-primary-dark)" }
              }}
            >
              {t("messages.editGroup")}
            </Button>
          )}

          {isOldestAdmin && (
            <Button
              variant="contained"
              onClick={() => handleOpenConfirm("delete_group")}
              className="rounded-xl font-bold normal-case px-4 py-2 bg-red-600 hover:bg-red-700 shadow-md"
            >
              {t("messages.deleteGroup")}
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-lg font-black text-[var(--text-primary)]">{t("messages.members")}</h2>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl font-bold normal-case px-4 py-2 shadow-md hover:shadow-lg transition-shadow"
            sx={{ bgcolor: "var(--color-primary)", "&:hover": { bgcolor: "var(--color-primary-dark)" } }}
          >
            {t("messages.addMembers")}
          </Button>
        )}
      </div>

      <div className="space-y-3 pr-1">
        {groupInfo?.members?.map((member) => (
          <div
            key={member.user_id}
            className="flex items-center justify-between bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={member.avatar_url ? `http://127.0.0.1:8000/storage/${member.avatar_url}` : undefined}
                className="w-10 h-10 border border-[var(--card-border)]"
              />
              <div>
                <p className="font-bold text-[var(--text-primary)] text-sm">
                  {member.display_name}
                  {member.user_id === user?.user_id && " (You)"}
                </p>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                  {t("common.joined")} {dayjs(member.joined_at).format("MMM D")}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Chip
                label={member.role}
                size="small"
                sx={
                  member.role === "admin"
                    ? { bgcolor: "var(--color-accent)", color: "white", fontWeight: "bold", fontSize: "10px" }
                    : { bgcolor: "var(--nav-pill-bg)", color: "var(--text-muted)", fontWeight: "bold", fontSize: "10px" }
                }
              />
              
              {/* Manage Member Menu (Only visible to admins, and only for other members) */}
              {isAdmin && member.user_id !== user?.user_id && (
                <>
                  <IconButton size="small" onClick={(e) => handleOpenMenu(e, member)}>
                    <MoreVertIcon sx={{ color: "var(--text-muted)" }} />
                  </IconButton>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        disableScrollLock={true}
        sx={{ zIndex: 99999 }}
        PaperProps={{
          sx: {
            bgcolor: "var(--card-bg)",
            color: "var(--text-primary)",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--card-border)",
            borderRadius: "12px"
          }
        }}
      >
        {selectedMember?.role !== "admin" && (
          <MenuItem onClick={handleMakeAdmin} sx={{ fontSize: "14px", "&:hover": { bgcolor: "var(--hover-overlay)" } }}>
            <AdminPanelSettingsIcon fontSize="small" sx={{ mr: 1, color: "var(--text-primary)" }} />
            {t("messages.makeAdmin")}
          </MenuItem>
        )}
        <MenuItem onClick={handleRemoveMember} sx={{ fontSize: "14px", color: "var(--danger)", "&:hover": { bgcolor: "var(--hover-overlay)" } }}>
          <PersonRemoveIcon fontSize="small" sx={{ mr: 1, color: "var(--danger)" }} />
          {t("messages.removeMember")}
        </MenuItem>
      </Menu>

      {/* Custom Confirmation Modal */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={handleCancelAction}
        PaperProps={{
          sx: {
            bgcolor: "var(--card-bg)",
            color: "var(--text-primary)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--card-border)",
            borderRadius: "16px",
            minWidth: "300px"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: "900", pb: 1 }}>{confirmDialog.title}</DialogTitle>
        <DialogContent sx={{ color: "var(--text-muted)" }}>{confirmDialog.content}</DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCancelAction} sx={{ color: "var(--text-muted)", fontWeight: "bold" }}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmAction} 
            sx={{ bgcolor: confirmDialog.type === "delete_group" || confirmDialog.type === "remove" ? "var(--danger)" : "var(--color-primary)", fontWeight: "bold", "&:hover": { opacity: 0.9 } }}
          >
            {t("common.confirm", "Confirm")}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Member Modal */}
      <AddMemberModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        groupId={id}
        existingMembers={groupInfo?.members || []}
      />
    </div>
  );
}
