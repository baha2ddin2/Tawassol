"use client";

import { useEffect, useState } from "react";
import { Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useTranslation } from "react-i18next";
import api from "@/lib/api";
import { gooeyToast } from "goey-toast";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ next: null, prev: null, current: 1 });
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { t } = useTranslation();

  const fetchUsers = async (url = "/dashboard/users") => {
    try {
      const res = await api.get(url);
      setUsers(res.data.data);
      setPagination({
        next: res.data.next_page_url,
        prev: res.data.prev_page_url,
        current: res.data.current_page
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/dashboard/users/${deleteUserId}`);
      gooeyToast.success("User deleted successfully");
      setUsers(users.filter(u => u.user_id !== deleteUserId));
      setOpenConfirm(false);
    } catch (err) {
      gooeyToast.error("Failed to delete user");
      console.log(err);
    }
  };

  return (
    <div className="p-6 md:p-8 bg-[#F9FCFF] dark:bg-[#081F5C] min-h-screen transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <Typography variant="h4" className="font-black text-[#081F5C] dark:text-[#F9FCFF] tracking-tight mb-1">
          {t("dashboard.userManagement", "User Management")}
        </Typography>

      <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-[#D0E3FF] dark:border-[#334EAC] overflow-hidden shadow-sm bg-white dark:bg-[#334EAC] transition-colors duration-300 mt-6">
        <Table>
          <TableHead className="bg-[#E7F1FF] dark:bg-[#081F5C] transition-colors duration-300">
            <TableRow>
              <TableCell className="font-bold text-[#334EAC] dark:text-[#D0E3FF] uppercase text-[11px] tracking-wider border-b border-[#D0E3FF] dark:border-[#334EAC]">{t("dashboard.user", "User")}</TableCell>
              <TableCell className="font-bold text-[#334EAC] dark:text-[#D0E3FF] uppercase text-[11px] tracking-wider border-b border-[#D0E3FF] dark:border-[#334EAC]">{t("dashboard.status", "Status")}</TableCell>
              <TableCell align="right" className="border-b border-[#D0E3FF] dark:border-[#334EAC]"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="bg-white dark:bg-[#334EAC] transition-colors duration-300">
            {users.map(user => (
              <TableRow key={user.user_id} className="hover:bg-[#E7F1FF] dark:hover:bg-[#081F5C] transition-colors duration-300 group border-b border-[#D0E3FF] dark:border-[#334EAC]">
                <TableCell className="border-none">
                  <div className="flex items-center gap-4">
                    <Avatar src={user.avatar_url ? `http://127.0.0.1:8000/storage/${user.avatar_url}` : null} />
                    <div>
                      <Typography className="font-semibold text-[#081F5C] dark:text-[#F9FCFF]">{user.display_name}</Typography>
                      <Typography className="text-sm text-[#334EAC] dark:text-[#D0E3FF]">{user.email}</Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="border-none">
                  <Typography className={`text-xs font-bold capitalize ${user.is_active ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                    {user.is_active ? t("dashboard.online", "online") : t("dashboard.offline", "offline")}
                  </Typography>
                </TableCell>
                <TableCell align="right" className="border-none">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteClick(user.user_id)}
                    className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold rounded-lg normal-case shadow-none text-xs py-1 transition-colors"
                  >
                    {t("dashboard.delete", "Delete")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow><TableCell colSpan={3} align="center" className="py-10 text-[#334EAC] dark:text-[#F9FCFF] border-none">{t("dashboard.noUsers", "No users found.")}</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-6">
        <Button
          disabled={!pagination.prev}
          variant="outlined"
          onClick={() => fetchUsers(pagination.prev)}
        >
          {t("dashboard.previous", "Previous")}
        </Button>
        <Typography className="flex items-center justify-center px-2">{pagination.current}</Typography>
        <Button
          disabled={!pagination.next}
          variant="outlined"
          onClick={() => fetchUsers(pagination.next)}
        >
          {t("dashboard.next", "Next")}
        </Button>
      </div>

      {/* Confirm Delete Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} PaperProps={{ className: "bg-white dark:bg-[#081F5C] text-[#081F5C] dark:text-[#F9FCFF]" }}>
        <DialogTitle className="font-bold text-[#081F5C] dark:text-[#F9FCFF]">{t("dashboard.confirmDelete", "Confirm Delete")}</DialogTitle>
        <DialogContent className="text-[#334EAC] dark:text-[#D0E3FF]">
          {t("dashboard.deleteUserConfirmation", "Are you sure you want to delete this user? This action cannot be undone.")}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} className="dark:text-[#D0E3FF]">{t("dashboard.cancel", "Cancel")}</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            {t("dashboard.delete", "Delete")}
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    </div>
  );
}
