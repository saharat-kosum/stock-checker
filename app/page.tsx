"use client";

import LeftArrow from "@/components/icon/LeftArrow";
import { useState } from "react";
import QrReader from "react-qr-reader";

export default function Home() {
  const [cameraOpen, setCameraOpen] = useState(false);

  const cameraToggle = () => {
    setCameraOpen(!cameraOpen);
  };

  const handleScan = (data: any) => {
    if (data) {
      console.log(data);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <main className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <label className="swap swap-flip">
            <input type="checkbox" checked={cameraOpen} readOnly />
            <div className="swap-on text-left">
              <button
                className="btn btn-primary mb-6 btn-sm btn-circle"
                onClick={() => cameraToggle()}
              >
                <LeftArrow />
              </button>
              {cameraOpen && (
                <QrReader
                  facingMode="environment"
                  delay={1000}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: "220px" }}
                />
              )}
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
