import React from "react";
import Link from "next/link";

function Navbar() {
  return (
    <div className="navbar bg-base-100 drop-shadow-lg">
      <div className="flex-1">
        <Link href="/admin" className="btn btn-ghost text-xl">
          Home
        </Link>
      </div>
      <div className="flex-none">
        <button className="btn btn-outline">Log out</button>
      </div>
    </div>
  );
}

export default Navbar;
