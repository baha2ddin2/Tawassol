"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Checkbox,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { addMembersToGroup } from "@/redux/Slices/messageSlice";

export default function AddMemberModal({
  open,
  onClose,
  groupId,
  existingMembers,
}) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const availableMembersOptions = useSelector(
    (state) => state.message.availableMembersOptions,
  );

  const availableUsers = availableMembersOptions?.filter(
    (contact) =>
      !existingMembers.some((member) => member.user_id === contact.user_id) &&
      contact?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleAdd = () => {
    dispatch(addMembersToGroup({ groupId, userIds: selectedUsers }));
    setSelectedUsers([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ className: "rounded-3xl p-2" }}
    >
      <DialogTitle className="flex justify-between items-center pb-2">
        <span className="font-black text-xl text-slate-900">Add Members</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          size="small"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-slate-400" />
              </InputAdornment>
            ),
            className: "rounded-xl bg-slate-50 border-none",
          }}
        />

        <List className="max-h-[300px] overflow-y-auto">
          {availableUsers?.length > 0 ? (
            availableUsers.map((user) => (
              <ListItem
                key={user.user_id}
                button
                onClick={() => handleToggle(user.user_id)}
                className="rounded-xl mb-1 hover:bg-blue-50"
              >
                <ListItemAvatar>
                  <Avatar
                    src={`http://127.0.0.1:8000/storage/${user.avatar_url}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <span className="font-bold text-sm">
                      {user.display_name}
                    </span>
                  }
                />
                <Checkbox
                  checked={selectedUsers.includes(user.user_id)}
                  className="text-[#1477ff]"
                />
              </ListItem>
            ))
          ) : (
            <p className="text-center text-slate-400 py-10 text-sm font-medium">
              No contacts available to add.
            </p>
          )}
        </List>
      </DialogContent>

      <DialogActions className="p-4 border-t border-slate-50">
        <Button
          onClick={onClose}
          className="text-slate-500 font-bold normal-case"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={selectedUsers.length === 0}
          onClick={handleAdd}
          className="bg-[#1477ff] hover:bg-blue-700 disabled:bg-slate-200 rounded-xl px-6 font-bold normal-case"
        >
          Add {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
