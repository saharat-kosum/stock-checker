"use client";
import { AppDispatch } from "@/redux/Store";
import { getAllStockCount } from "@/redux/stockCountSlice";
import { GetStockCountProps, StockCountWithMaterial } from "@/type/type";
import React from "react";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import Download from "./icon/Download";

function StockCountExportBtn(props: GetStockCountProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleExport = async () => {
    try {
      const resultAction = await dispatch(getAllStockCount(props));
      const payload = resultAction.payload as
        | { stockCounts: StockCountWithMaterial[] }
        | undefined;

      const stockCounts = payload?.stockCounts ?? [];

      const sheetRows = stockCounts.map((item, index) => ({
        No: index + 1,
        "เลขที่เอกสารเช็คสต๊อก": item.stockCode,
        materialId: item.materialId,
        "Material code": item.material.code,
        "Material name": item.material.name,
        หน่วย: item.material.unit,
        "จำนวนที่นับได้": item.countedQty,
        "จำนวนจากระบบ": item.systemQty,
        "ผลต่าง(ขาด)เกิน": item.countDiff,
        "วันที่ทำการตรวจนับ": item.countedDate,
        "หมายเหตุ": item.note ?? "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(sheetRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "StockCount");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "buffer",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "stock-count.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting stock count:", error);
    }
  };

  return (
    <button className="btn btn-sm btn-secondary" onClick={handleExport}>
      <Download />
      <p className="hidden sm:block">Export to excel</p>
    </button>
  );
}

export default StockCountExportBtn;
