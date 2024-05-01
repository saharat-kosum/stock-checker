"use client";
import Spinner from "@/components/Spinner";
import { AppDispatch, useAppSelector } from "@/redux/Store";
import { login } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function AdminLogin() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const logInHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity()) {
      try {
        await dispatch(login(user));
        router.push("/admin");
      } catch (error) {
        console.error("Login failed:", error);
      }
    } else {
      form.classList.add("was-validated");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <main className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={(e) => logInHandle(e)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  className="input input-bordered"
                  name="email"
                  autoComplete="off"
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered"
                  name="password"
                  autoComplete="current-password"
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              <div className="mt-2">
                <p className="text-red-600">{error}</p>
                <div className="form-control mt-2">
                  <button className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? <Spinner size="md" /> : "Login"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;
