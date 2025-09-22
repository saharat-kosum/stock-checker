"use client";
import React, { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/Store";
import {
  getStockCount,
  updateStockCount,
} from "@/redux/stockCountSlice";
import Spin from "@/components/icon/Spin";
import Link from "next/link";

function StockCountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const stockCount = useAppSelector((state) => state.stockCount.currentStockCount);
  const isLoading = useAppSelector((state) => state.stockCount.loading);
  const failed = useAppSelector((state) => state.stockCount.failed);

  const [countedDate, setCountedDate] = useState("");
  const [countedQty, setCountedQty] = useState("");
  const [systemQty, setSystemQty] = useState("");
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countDiff, setCountDiff] = useState("0");

  useEffect(() => {
    if (typeof params.id === "string") {
      void dispatch(getStockCount(Number(params.id)));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (failed) {
      notFound();
    }
  }, [failed]);

  useEffect(() => {
    if (stockCount?.id) {
      const parsedDate = new Date(stockCount.countedDate);
      setCountedDate(
        Number.isNaN(parsedDate.getTime())
          ? ""
          : parsedDate.toISOString().split("T")[0]
      );
      setCountedQty(stockCount.countedQty.toString());
      setSystemQty(stockCount.systemQty.toString());
      setNote(stockCount.note ?? "");
      setCountDiff(stockCount.countDiff.toString());
    }
  }, [stockCount]);

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

  const handleSystemQtyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSystemQty(value);
    recalcDiff(countedQty, value);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stockCount?.id) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await dispatch(
        updateStockCount({
          id: stockCount.id,
          countedDate,
          countedQty: Number(countedQty),
          systemQty: Number(systemQty),
          note: note || null,
        })
      ).unwrap();
      router.push("/admin/stock");
    } catch (error) {
      console.error("Failed to update stock count", error);
      setErrorMessage("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !stockCount?.id) {
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
          <p className="text-sm text-base-content/60">Stock count code</p>
          <h1 className="text-4xl font-bold break-words">
            {stockCount.stockCode}
          </h1>
          <p className="mt-6 text-sm text-base-content/60">Material code</p>
          <h2 className="text-3xl font-semibold break-words">
            {stockCount.material.code}
          </h2>
          <p className="mt-6 text-sm text-base-content/60">Material name</p>
          <h2 className="text-3xl font-semibold break-words">{stockCount.material.name}</h2>
          <p className="mt-6 text-sm text-base-content/60">Sloc</p>
          <h2 className="text-3xl font-semibold break-words">{stockCount.material.sloc}</h2>
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
              onChange={handleSystemQtyChange}
              required
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
            <Link href="/admin/stock" className="btn btn-outline" prefetch={false}>
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

export default StockCountDetailPage;
