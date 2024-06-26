"use client";
import { AppDispatch } from "@/redux/Store";
import { getAllMaterial } from "@/redux/materialSlice";
import { GetMaterialProps } from "@/type/type";
import React from "react";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import Download from "./icon/Download";

function ExportBtn(props: GetMaterialProps) {
  const dispatch = useDispatch<AppDispatch>();
  const handleExport = async () => {
    try {
      // Fetch query data
      const data = await dispatch(getAllMaterial(props));

      // Format data for Excel
      const ws = XLSX.utils.json_to_sheet(data.payload.materials);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Material");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

      // Save Excel file
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "material.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data: ", error);
    }
  };
  return (
    <div className="btn btn-sm btn-secondary" onClick={handleExport}>
      <Download />
      <p className="hidden sm:block">Export to excel</p>
    </div>
  );
}

export default ExportBtn;
