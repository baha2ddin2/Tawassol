import { TextField, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLogin } from "./useLogin";

export const LoginForm = () => {
  const { 
    email, setEmail, password, setPassword, 
    showPassword, togglePassword, loading, handleLogin, validationErrors 
  } = useLogin();

  return (
    <form className="form" onSubmit={handleLogin}>
      <div>
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!validationErrors?.email}
          helperText={validationErrors?.email}
        />
      </div>
      <div>
        <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!validationErrors?.password}
        helperText={validationErrors?.password}
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
      </div>
      <button type="submit" className="btn" disabled={loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
      </button>
    </form>
  );
};
