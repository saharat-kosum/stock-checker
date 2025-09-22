"use client";
import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/Store";
import { logout } from "@/redux/authSlice";
import { usePathname, useRouter } from "next/navigation";
import Spin from "./icon/Spin";

function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const isLoading = useAppSelector((state) => state.auth.loading);

  const navItems = [
    { href: "/admin", label: "Material" },
    { href: "/admin/stock", label: "Stock count" },
  ];

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
      <div className="flex-none flex items-center gap-2">
        <div className="join hidden sm:inline-flex">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`join-item btn btn-sm ${
                  isActive ? "btn-neutral" : "btn-ghost"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="dropdown dropdown-end sm:hidden">
          <div tabIndex={0} role="button" className="btn btn-sm btn-ghost">
            Menu
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44"
          >
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={isActive ? "active" : ""}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
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
