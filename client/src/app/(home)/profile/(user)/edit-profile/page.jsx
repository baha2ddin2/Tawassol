"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
} from "@mui/material";
import AvatarUpload from "@/components/AvatarUpload";
import { profileInfo } from "@/redux/Slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateAvatar, updateProfile } from "@/redux/Slices/profileSlice";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function EditProfilePage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const infos = useSelector((state) => state.profile.profileInfo);

  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  useEffect(() => {
    dispatch(profileInfo());
  }, []);

  useEffect(() => {
    if (infos) {
      setBio(infos.bio??"");
      setUsername(infos.display_name??"");
    }
  }, [infos]);

  const handleSave = async () => {
    if (avatar) {
      console.log(avatar);
      dispatch(updateAvatar(avatar));
    }

    const profileData = {
      display_name: username,
      bio,
    };
    dispatch(updateProfile(profileData));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex justify-between">
        {t("editProfile.title", "Edit Profile")}
      </h1>

      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4">
        <AvatarUpload
          currentUrl={infos?.avatar_url}
          onImageSelect={(file) => setAvatar(file)}
        />
      </div>

      {/* Profile Form */}
      <div
        className="space-y-4"
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        <TextField
          className=" mb-6"
          label={t("editProfile.name", "name")}
          value={username??""}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          label={t("editProfile.bio", "Bio")}
          multiline
          minRows={3}
          value={bio??""}
          onChange={(e) => setBio(e.target.value)}
          fullWidth
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-4">
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setAvatar(null);
            setUsername("");
            setBio("");
          }}
        >
          {t("editProfile.reset", "Reset")}
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          {t("editProfile.save", "Save")}
        </Button>
      </div>
    </div>
  );
}
