"use client";

import {
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AvatarUpload from "@/components/AvatarUpload";
import { useRegister } from "./useRegister";

export default function RegisterPage() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    loading,
    handleRegister,
    setAvatar,
    registerErrors,
    validationErrors,
  } = useRegister();

  return (
    <main className="wrap">
      <section className="card w-full max-w-[420px] p-8 mt-5 mb-10 flex flex-col items-center">
        <h1>Create your account</h1>
      <p className="subtitle">
        Join Tawassol to connect with friends and family.
      </p>

      <AvatarUpload onImageSelect={(file) => setAvatar(file)} />
      {registerErrors?.errors?.avatar && (
        <p className=" text-[var(--danger)]">{registerErrors.errors.avatar[0]}</p>
      )}

      <form className="form w-full mt-4" onSubmit={handleRegister}>
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!(validationErrors?.name || registerErrors?.errors?.name)}
          helperText={validationErrors?.name || registerErrors?.errors?.name?.[0]}
        />

        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!(validationErrors?.email || registerErrors?.errors?.email)}
          helperText={validationErrors?.email || registerErrors?.errors?.email?.[0]}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!(validationErrors?.password || registerErrors?.errors?.password)}
          helperText={validationErrors?.password || registerErrors?.errors?.password?.[0]}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!(validationErrors?.confirm_password || registerErrors?.errors?.confirm_password)}
          helperText={validationErrors?.confirm_password || registerErrors?.errors?.confirm_password?.[0]}
        />

        <small>Must be at least 6 characters long.</small>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Create Account →"
          )}
        </button>

        <p className="terms text-center mt-4 text-[var(--text-muted)] text-[12px]">
          By creating an account, you agree to our <a href="#" className="text-[var(--color-primary)]">Terms</a>.
        </p>
      </form>
      </section>
    </main>
  );
}
