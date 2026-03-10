"use client";

import { useEffect, useState } from "react";
import { Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import api from "@/lib/api";
import { gooeyToast } from "goey-toast";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ next: null, prev: null, current: 1 });
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  // Fetch users (page optional)
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

  // Delete handlers
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="mb-6 font-bold">User Management</Typography>

      <div className="grid md:grid-cols-2 gap-6">
        {users.map(user => (
          <div key={user.user_id} className="bg-white p-4 rounded shadow flex items-center justify-between hover:shadow-lg transition">
            <div className="flex items-center gap-4">
              <Avatar src={`http://127.0.0.1:8000/storage/${user.avatar_url}`} />
              <div>
                <Typography className="font-semibold">{user.display_name}</Typography>
                <Typography className="text-sm text-gray-500">{user.email}</Typography>
                <Typography className="text-sm text-gray-400">{user.bio}</Typography>
                <Typography className={`text-xs ${user.is_active ? "text-green-600" : "text-red-500"}`}>
                  {user.is_active ? "online" : "offline"}
                </Typography>
              </div>
            </div>
            <div>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteClick(user.user_id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-6">
        <Button
          disabled={!pagination.prev}
          variant="outlined"
          onClick={() => fetchUsers(pagination.prev)}
        >
          Previous
        </Button>
        <Typography className="flex items-center justify-center px-2">{pagination.current}</Typography>
        <Button
          disabled={!pagination.next}
          variant="outlined"
          onClick={() => fetchUsers(pagination.next)}
        >
          Next
        </Button>
      </div>

      {/* Confirm Delete Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
