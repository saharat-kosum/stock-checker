"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { AppDispatch, useAppSelector } from "@/redux/Store";
import { useDispatch } from "react-redux";
import { getMaterial } from "@/redux/materialSlice";
import { notFound } from "next/navigation";
import BalanceModal from "@/components/BalanceModal";
import Spin from "@/components/icon/Spin";

function BalaceCheck() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const material = useAppSelector((state) => state.material.currentMaterial);
  const failed = useAppSelector((state) => state.material.failed);

  useEffect(() => {
    if (typeof params.id === "string") {
      const url = `/api/balance/${params.id}`;
      dispatch(getMaterial(url)).then(() => {
        const modal = document.getElementById(
          "Balance_Modal"
        ) as HTMLDialogElement | null;
        if (modal) {
          modal.showModal();
        }
      });
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (failed) {
      notFound();
    }
  }, [failed]);

  return (
    <main className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <Spin size={"lg"} />
          <BalanceModal material={material} />
        </div>
      </div>
    </main>
  );
}

export default BalaceCheck;
