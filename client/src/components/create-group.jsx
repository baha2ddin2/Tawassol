"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Avatar,
  Checkbox,
  IconButton,
  Button,
} from "@mui/material";

import { Close, PhotoCamera, Group } from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { availableMembers, createGroup } from "@/redux/Slices/messageSlice";
export default function CreateGroup({ open, setOpen }) {
  const dispatch = useDispatch();
  const availableMembersOptions = useSelector(
    (state) => state.message.availableMembersOptions,
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    dispatch(availableMembers());
  }, []);

  const handlePhoto = (e) => {
    setPhoto(e.target.files[0]);
  };

  const toggleMember = (id) => {
    setMembers((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id];
      return updated;
    });
  };
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (photo) formData.append("photo", photo);
    members.forEach((id) => {
      formData.append("members[]", id);
    });

    dispatch(createGroup(formData));
    setPhoto(null);
    setName("");
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogContent className="p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create New Group</h2>

          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </div>

        <div className="border-b my-4"></div>

        {/* Upload photo */}
        <div className="flex flex-col items-center mb-6">
          <label className="cursor-pointer relative">
            <Avatar
              src={photo ? URL.createObjectURL(photo) : ""}
              sx={{ width: 90, height: 90 }}
            />

            <input hidden type="file" accept="image/*" onChange={handlePhoto} />

            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1">
              <PhotoCamera fontSize="small" />
            </div>
          </label>

          <p className="text-sm text-gray-500 mt-2">Upload Group Photo</p>
        </div>

        {/* Form */}
        <div className="space-y-4 flex flex-col gap-2.5">
          <TextField
            label="Group Name"
            fullWidth
            className=""
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Description (Optional)"
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Members */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3 text-gray-500">
            SUGGESTED FRIENDS
          </h3>

          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {availableMembersOptions?.map((friend) => (
              <div
                key={friend.user_id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={`http://127.0.0.1:8000/storage/${friend.avatar_url}`}
                  />

                  <div>
                    <p className="text-sm font-medium">{friend.display_name}</p>
                  </div>
                </div>

                <Checkbox
                  checked={members.includes(friend.user_id)}
                  onChange={() => toggleMember(friend.user_id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={<Group />}
            onClick={handleSubmit}
          >
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
