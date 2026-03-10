"use client";
import "./style.css";
import { TextField, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AvatarUpload from "@/components/avatarUpload";
import { useRegister } from "./useRegister";

export default function RegisterPage() {
  const {
    name, setName, email, setEmail, password, setPassword,
    confirmPassword, setConfirmPassword, showPassword, setShowPassword,
    loading, handleRegister, setAvatar ,registerErrors
  } = useRegister();

  return (
    <main className="container">
      <h1>Create your account</h1>
      <p className="subtitle">Join Tawassol to connect with friends and family.</p>

      <AvatarUpload onImageSelect={(file) => setAvatar(file)} />
        {registerErrors?.errors?.avatar && <p className=" text-red-500" >{registerErrors.errors.avatar[0]}</p>}

      <form className="card" onSubmit={handleRegister}>
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
         {registerErrors?.errors?.name && <p className=" text-red-500" >{registerErrors.errors.name[0]}</p>}

        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {registerErrors?.errors?.email && <p className=" text-red-500 " >{registerErrors.errors.email[0]}</p>}

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
        {registerErrors?.errors?.password && <p className=" text-red-500" >{registerErrors.errors.password[0]}</p>}

        <TextField
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {registerErrors?.errors?.confirm_password && <p className=" text-red-500" >{registerErrors.errors.confirm_password[0]}</p>}

        <small>Must be at least 6 characters long.</small>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : "Create Account →"}
        </button>

        <p className="terms">
          By creating an account, you agree to our <a href="#">Terms</a>.
        </p>
      </form>
    </main>
  );
}
