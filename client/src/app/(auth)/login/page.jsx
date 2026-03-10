"use client";
import Link from "next/link";
import ErrorSnackbar from "@/components/errorSnackbar";
import { LoginForm } from "./LoginForm";
import { useLogin } from "./useLogin";

export default function Page() {
  const { error, clearError, isAuth ,checkAuthLoanding } = useLogin();
  
  return (
    <>
      {checkAuthLoanding ? null : (
        <main className="wrap">
          <section className="card">
            <h1>Welcome back</h1>
            <p className="subtitle">Please enter your details to sign in.</p>
            {/* <div className="divider"></div> */}
            <LoginForm />
            <div className="row">
              <Link className="forgot" href="/forgot-password">
                Forgot password?
              </Link>
            </div>
            {error && (
              <ErrorSnackbar
                style={{ marginTop: 10 }}
                fun={clearError}
                error={error.error || "Login Failed"}
              />
            )}
          </section>
        </main>
      )}
    </>
  );
}
