import { TextField, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLogin } from "./useLogin";

export const LoginForm = () => {
  const { email, setEmail, password, setPassword, showPassword, togglePassword, loading, handleLogin } = useLogin();

  return (
    <div className="form">
      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
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
              <IconButton onClick={togglePassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <button onClick={handleLogin} type="submit" className="btn" disabled={loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
      </button>
    </div>
  );
};
