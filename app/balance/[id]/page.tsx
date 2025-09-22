"use client";
import React, { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { AppDispatch, useAppSelector } from "@/redux/Store";
import { useDispatch } from "react-redux";
import { getMaterial } from "@/redux/materialSlice";
import Spin from "@/components/icon/Spin";
import Link from "next/link";
import axios from "@/config/axios";

function BalanceCheck() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const material = useAppSelector((state) => state.material.currentMaterial);
  const isLoading = useAppSelector((state) => state.material.loading);
  const failed = useAppSelector((state) => state.material.failed);

  const [countedDate, setCountedDate] = useState("");
  const [countedQty, setCountedQty] = useState("");
  const [systemQty, setSystemQty] = useState("0");
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [countDiff, setCountDiff] = useState("0");

  const hasMaterial = material.id !== "";

  useEffect(() => {
    if (typeof params.id === "string") {
      const url = `/api/balance/${params.id}`;
      void dispatch(getMaterial(url));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (failed) {
      notFound();
    }
  }, [failed]);

  useEffect(() => {
    if (hasMaterial) {
      const defaultDate = new Date().toISOString().split("T")[0];
      const nextSystem = material.balance.toString();

      setCountedDate((prev) => prev || defaultDate);
      setSystemQty(nextSystem);
      setCountedQty((prev) => {
        const nextCounted = prev || nextSystem;
        setCountDiff((Number(nextCounted || 0) - Number(nextSystem || 0)).toString());
        return nextCounted;
      });
    }
  }, [hasMaterial, material.balance]);

  const recalcDiff = (nextCounted: string, nextSystem: string) => {
    const countedNumber = Number(nextCounted || 0);
    const systemNumber = Number(nextSystem || 0);
    setCountDiff((countedNumber - systemNumber).toString());
  };

  const handleCountedQtyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCountedQty(value);
    recalcDiff(value, systemQty);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!material?.id) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await axios.post("/api/stockCount", {
        materialId: material.id,
        countedQty: Number(countedQty),
        systemQty: Number(systemQty),
        countedDate,
        note: note || null,
      });
      router.push("/");
    } catch (error) {
      console.error("Failed to save stock count", error);
      setErrorMessage("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !hasMaterial) {
    return (
      <main className="hero min-h-screen">
        <div className="hero-content text-center">
          <Spin size="lg" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200">
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <header className="mb-8 text-center">
          <p className="text-sm text-base-content/60">Material code</p>
          <h1 className="text-4xl font-bold break-words">{material.code}</h1>
          <p className="mt-4 text-sm text-base-content/60">Material name</p>
          <h2 className="text-2xl font-semibold break-words">{material.name}</h2>
          <p className="mt-4 text-sm text-base-content/60">Sloc</p>
          <h2 className="text-2xl font-semibold break-words">{material.sloc}</h2>
        </header>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">วันที่ทำการตรวจนับ</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              value={countedDate}
              onChange={(event) => setCountedDate(event.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">จำนวนที่นับได้</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              value={countedQty}
              min="0"
              step="1"
              onChange={handleCountedQtyChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">จำนวนจากระบบ</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              value={systemQty}
              disabled
              readOnly
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">ผลต่าง(ขาด)เกิน</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              value={countDiff}
              disabled
              readOnly
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">หมายเหตุ</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>

          {errorMessage && (
            <div className="alert alert-error">
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Link href="/" className="btn btn-outline" prefetch={false}>
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default BalanceCheck;
