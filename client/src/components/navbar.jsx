"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { checkAuth } from "@/redux/Slices/AuthSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch, router]);
  if (isAuth) {
    router.replace("/home");
  }
  return (
    <header className={"topbar"}>
      <div className={"brand"}>
        <div className={"logo"}>
          <Image width={40} height={40} src={"/logo.jpeg"} alt="Logo" />
        </div>

        <div className={"brand-name"}>Tawassol</div>
      </div>

      <div className={"top-links"}>
        <span>New to Tawassol?</span>
        <Link href="/register">Create an account</Link>
      </div>
    </header>
  );
}
