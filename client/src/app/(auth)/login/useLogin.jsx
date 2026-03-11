import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { login, deleteErrorState } from "@/redux/Slices/AuthSlice";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { error, loading, isAuth, checkAuthLoanding } = useSelector(
    (state) => state.auth,
  );

  const handleLogin = async () => {
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
  };
};
