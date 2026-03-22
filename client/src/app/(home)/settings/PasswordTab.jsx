import api from "@/lib/api";
import { Paper, Typography, TextField, Button } from "@mui/material";
import { gooeyToast } from "goey-toast";
import { useState } from "react";
import { validateChangePasswordForm } from "@/lib/validation";
import { useTranslation } from "react-i18next";

export default function PasswordTab() {
  const { t } = useTranslation();
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});

  function changePassword() {
    const vErrors = validateChangePasswordForm({
      currentPassword: passwords.current,
      newPassword: passwords.new,
      confirmPassword: passwords.confirm
    });
    
    if (vErrors) {
      setErrors({
        current: vErrors.currentPassword,
        new: vErrors.newPassword,
        confirm: vErrors.confirmPassword
      });
      return;
    }
    setErrors({});

    api
      .put("/changePassword", {
        current_password: passwords.current,
        new_password: passwords.new,
        new_password_confirmation: passwords.confirm,
      })
      .then(() => {
        gooeyToast.success("Password changed successfully");

        setPasswords({
          current: "",
          new: "",
          confirm: "",
        });

        setErrors({});
      })
      .catch((err) => {
        const message =
          err.response?.data?.message || "Something went wrong";

        gooeyToast.error(message);
      });
  }

  return (
    <Paper
      elevation={0}
      className="border border-[var(--card-border)] bg-[var(--card-bg)] rounded-3xl overflow-hidden shadow-sm animate-fade-in"
    >
      <div className="bg-[var(--nav-pill-bg)] px-6 py-4 border-b border-[var(--card-border)]">
        <Typography className="font-extrabold text-lg text-[var(--text-primary)]">
          {t("settings.updatePassword", "Update Password")}
        </Typography>
      </div>

      <div className="p-6 space-y-5 flex flex-col gap-2">
        <TextField
          fullWidth
          value={passwords.current}
          label={t("settings.currentPassword", "Current Password")}
          type="password"
          error={Boolean(errors.current)}
          helperText={errors.current}
          onChange={(e) =>
            setPasswords({ ...passwords, current: e.target.value })
          }
        />

        <TextField
          fullWidth
          value={passwords.new}
          label={t("settings.newPassword", "New Password")}
          type="password"
          error={Boolean(errors.new)}
          helperText={errors.new}
          onChange={(e) =>
            setPasswords({ ...passwords, new: e.target.value })
          }
        />

        <TextField
          fullWidth
          label={t("settings.confirmNewPassword", "Confirm New Password")}
          value={passwords.confirm}
          type="password"
          error={Boolean(errors.confirm)}
          helperText={errors.confirm}
          onChange={(e) =>
            setPasswords({ ...passwords, confirm: e.target.value })
          }
        />

        <Button
          onClick={changePassword}
          variant="contained"
          className="font-bold normal-case rounded-xl py-2.5 px-6"
          sx={{ bgcolor: "var(--color-primary)", "&:hover": { bgcolor: "var(--color-primary-dark)" } }}
        >
          {t("settings.saveNewPassword", "Save New Password")}
        </Button>
      </div>
    </Paper>
  );
}