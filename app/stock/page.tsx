"use client";

import axios from "@/config/axios";
import Spin from "@/components/icon/Spin";
import Link from "next/link";
import { useEffect, useState } from "react";

interface MaterialStockStatus {
  id: string;
  code: number;
  name: string;
  isCurrentMonth: number;
}

export default function StockListPage() {
  const [materials, setMaterials] = useState<MaterialStockStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMaterials = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get<{ materials?: MaterialStockStatus[] }>(
          "/api/stock"
        );
        if (!isMounted) {
          return;
        }
        setMaterials(data.materials ?? []);
      } catch (fetchError) {
        console.error("Failed to load stock list", fetchError);
        if (isMounted) {
          setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadMaterials();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">สถานะการตรวจนับวัสดุ</h1>
          <p className="text-sm text-gray-600">
            ตรวจสอบรายการวัสดุที่มีการตรวจนับในเดือนปัจจุบัน
          </p>
        </div>
        <Link href="/" prefetch={false} className="btn btn-outline w-full sm:w-auto">
          กลับหน้าหลัก
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Spin size="lg" />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Material Code
                </th>
                {/* <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Material Name
                </th> */}
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  สถานะการตรวจนับ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {materials.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">
                    ไม่พบรายการวัสดุ
                  </td>
                </tr>
              ) : (
                materials.map((material) => {
                  const isCurrent = material.isCurrentMonth === 1;
                  return (
                    <tr key={material.id}>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                        {material.code}
                      </td>
                      {/* <td className="px-4 py-3 text-sm text-gray-900">{material.name}</td> */}
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={
                            isCurrent ? "font-medium text-green-600" : "font-medium text-red-600"
                          }
                        >
                          {isCurrent ? "ทำการตรวจนับแล้ว" : "ยังไม่ได้ทำการตรวจนับ"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
