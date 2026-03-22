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
import { availableMembers, contact, createGroup } from "@/redux/Slices/messageSlice";
import { validateGroupName } from "@/lib/validation";
import { useTranslation } from "react-i18next";

export default function CreateGroup({ open, setOpen }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const availableMembersOptions = useSelector(
    (state) => state.message.availableMembersOptions,
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [members, setMembers] = useState([]);
  const [nameError, setNameError] = useState(null);

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
    const errorMsg = validateGroupName(name);
    if (errorMsg) {
      setNameError(errorMsg);
      return;
    }
    setNameError(null);

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
    dispatch(contact());
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: "var(--card-bg)", color: "var(--text-primary)" } }}>
      <DialogContent className="p-6 bg-[var(--card-bg)]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">{t("messages.createGroup", "Create New Group")}</h2>

          <IconButton onClick={() => setOpen(false)}>
            <Close sx={{ color: "var(--text-muted)" }} />
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

            <div className="absolute bottom-0 right-0 p-1 rounded-full text-white" style={{ backgroundColor: "var(--color-primary)" }}>
              <PhotoCamera fontSize="small" />
            </div>
          </label>

          <p className="text-sm mt-2 text-[var(--text-muted)]">{t("messages.uploadGroupPhoto", "Upload Group Photo")}</p>
        </div>

        {/* Form */}
        <div className="space-y-4 flex flex-col gap-2.5">
          <TextField
            label={t("messages.groupName", "Group Name")}
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
          />

          <TextField
            label={t("messages.groupDescription", "Description (Optional)")}
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Members */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3 text-[var(--text-muted)] uppercase">
            {t("messages.suggestedFriends", "SUGGESTED FRIENDS")}
          </h3>

          <div className="space-y-3 max-h-[200px] overflow-y-auto scrollbar-thin">
            {availableMembersOptions?.map((friend) => (
              <div
                key={friend.user_id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--hover-overlay)] cursor-pointer transition-colors"
                onClick={() => toggleMember(friend.user_id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={`http://127.0.0.1:8000/storage/${friend.avatar_url}`}
                  />

                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{friend.display_name}</p>
                  </div>
                </div>

                <Checkbox
                  checked={members.includes(friend.user_id)}
                  onChange={(e) => { e.stopPropagation(); toggleMember(friend.user_id); }}
                  sx={{ color: "var(--text-muted)", "&.Mui-checked": { color: "var(--color-primary)" } }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outlined" sx={{ color: "var(--text-muted)", borderColor: "var(--card-border)" }} onClick={() => setOpen(false)}>
            {t("common.cancel", "Cancel")}
          </Button>

          <Button
            variant="contained"
            startIcon={<Group />}
            onClick={handleSubmit}
            sx={{ bgcolor: "var(--color-primary)", "&:hover": { bgcolor: "var(--color-primary-dark)" } }}
          >
            {t("messages.createGroup", "Create Group")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
