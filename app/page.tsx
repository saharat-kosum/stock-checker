"use client";

import LeftArrow from "@/components/icon/LeftArrow";
import { AppDispatch } from "@/redux/Store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QrReader from "react-qr-reader";
import { useDispatch } from "react-redux";
import { setFailed } from "@/redux/materialSlice";

export default function Home() {
  const [cameraOpen, setCameraOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setFailed());
  }, [dispatch]);

  const cameraToggle = () => {
    setCameraOpen(!cameraOpen);
  };

  const handleScan = (data: any) => {
    if (data) {
      router.push(data);
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
                  className="w-56 sm:w-96"
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
