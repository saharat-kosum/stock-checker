"use client";
import { EnumMode } from "@/type/type";
import React, { useState } from "react";

const inputArray = [
  { name: "sloc", class: "max-w-xs", type: "number", display: "Sloc" },
  { name: "code", class: "max-w-xs", type: "number", display: "Material Code" },
  { name: "name", class: "col-span-2", type: "text", display: "รายการ" },
  { name: "unit", class: "max-w-xs", type: "text", display: "หน่วย" },
  {
    name: "bringForward",
    class: "max-w-xs",
    type: "number",
    display: "ยอดยกมา",
  },
  { name: "stockIn", class: "max-w-xs", type: "number", display: "รับ" },
  { name: "stockOut", class: "max-w-xs", type: "number", display: "จ่าย" },
  { name: "balance", class: "max-w-xs", type: "number", display: "คงเหลือ" },
  {
    name: "stockCount",
    class: "max-w-xs",
    type: "number",
    display: "ยอดตรวจนับ",
  },
];

function MaterialManage() {
  const [mode, setMode] = useState<EnumMode>(EnumMode.Create);
  return (
    <div className="container mx-auto mt-10 p-2">
      <h1 className="text-3xl font-bold">{mode}</h1>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {inputArray.map((input, index) => (
          <label className={`form-control w-full ${input.class}`} key={index}>
            <div className="label">
              <span className="label-text">{input.display}</span>
            </div>
            <input
              type={input.type}
              name={input.name}
              placeholder={input.display}
              className="input input-bordered w-full"
            />
          </label>
        ))}
        <label className="form-control col-span-2">
          <div className="label">
            <span className="label-text">หมายเหตุ</span>
          </div>
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="หมายเหตุ"
            name="note"
          ></textarea>
        </label>
      </div>
    </div>
  );
}

export default MaterialManage;
