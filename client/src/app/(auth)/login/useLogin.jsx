import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { login, deleteErrorState } from "@/redux/Slices/AuthSlice";
import { validateLoginForm } from "@/lib/validation";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useDispatch();
  const router = useRouter();
  const { error, loading, isAuth, checkAuthLoanding } = useSelector(
    (state) => state.auth,
  );

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    const vErrors = validateLoginForm({ email, password });
    if (vErrors) {
      setValidationErrors(vErrors);
      return;
    }
    setValidationErrors({});
    
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) router.push("/home");
  };
  
  const togglePassword = () => setShowPassword(!showPassword);
  const clearError = () => dispatch(deleteErrorState());

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePassword,
    loading,
    error,
    isAuth,
    checkAuthLoanding,
    handleLogin,
    clearError,
    validationErrors,
  };
};
