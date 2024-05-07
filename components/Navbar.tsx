"use client";
import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/Store";
import { logout } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import Spin from "./icon/Spin";

function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isLoading = useAppSelector((state) => state.auth.loading);

  const logoutHandle = async () => {
    try {
      await dispatch(logout());
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <main className="navbar bg-base-100 drop-shadow-lg">
      <div className="flex-1">
        <Link href="/admin" className="btn btn-ghost text-xl">
          Home
        </Link>
      </div>
      <div className="flex-none">
        <button
          className="btn btn-outline"
          disabled={isLoading}
          onClick={() => logoutHandle()}
        >
          {isLoading ? <Spin size="md" /> : "Log out"}
        </button>
      </div>
    </main>
  );
}

export default Navbar;
