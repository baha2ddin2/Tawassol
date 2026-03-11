import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/redux/Slices/AuthSlice";
import { useRouter } from "next/navigation";

export const useRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, registerErrors } = useSelector((state) => state.auth);

  const handleRegister = async (e) => {
    e.preventDefault();

    // if (password !== confirmPassword) {
    //   alert("Passwords do not match!");
    //   return;
    // }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);
    if (avatar) formData.append("avatar", avatar);

    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      router.push("/home");
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    avatar,
    setAvatar,
    showPassword,
    setShowPassword,
    loading,
    error,
    handleRegister,
    registerErrors,
  };
};
