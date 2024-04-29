"use client";

import { useState } from "react";

export default function Home() {
  const [cameraOpen, setCameraOpen] = useState(false);

  const cameraToggle = () => {
    setCameraOpen(!cameraOpen);
  };

  return (
    <main className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <label className="swap swap-flip">
            <input type="checkbox" checked={cameraOpen} readOnly />
            <div className="swap-on">
              <button
                className="btn btn-primary"
                onClick={() => cameraToggle()}
              >
                Back
              </button>
            </div>
            <div className="swap-off">
              <button
                className="btn btn-primary"
                onClick={() => cameraToggle()}
              >
                Camera
              </button>
            </div>
          </label>
        </div>
      </div>
    </main>
  );
}
