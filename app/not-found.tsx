import React from "react";
import Link from "next/link";

function NotFound() {
  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Oops!</h1>
            <p className="py-6">Page not found</p>
            <Link href="/" className="btn btn-primary">
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
