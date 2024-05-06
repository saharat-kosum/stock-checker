"use client";
import Spinner from "@/components/Spinner";
import { AppDispatch, useAppSelector } from "@/redux/Store";
import {
  createMaterial,
  editMaterial,
  setCurrentMat,
} from "@/redux/materialSlice";
import { EnumMode, InputArray, Material } from "@/type/type";
import React from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const inputArray: InputArray[] = [
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

interface MaterialManageProps {
  mode: EnumMode;
}

function MaterialManage({ mode }: MaterialManageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useAppSelector((state) => state.material.loading);
  const currentMat = useAppSelector((state) => state.material.currentMaterial);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    type: string,
    name: keyof Material
  ) => {
    const value =
      type === "text" ? event.target.value : parseInt(event.target.value);

    dispatch(setCurrentMat({ name, value }));
  };

  const submitHandle = async () => {
    let res;
    if (mode === EnumMode.Create) {
      res = await dispatch(createMaterial(currentMat));
    } else if (mode === EnumMode.Edit) {
      res = await dispatch(editMaterial(currentMat));
    }

    if (res?.payload) {
      Swal.fire({
        title: "Success!",
        text: `${mode} success!`,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Failed!",
        text: `${mode} failed!`,
        icon: "error",
      });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur();
  };

  return (
    <main className="hero mt-8">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold">{mode}</h1>
          {isLoading ? (
            <div className="min-w-60 min-h-96 hero-content">
              <Spinner size="md" />
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4">
              {inputArray.map((input, index) => (
                <label
                  className={`form-control w-full ${input.class}`}
                  key={index}
                >
                  <div className="label">
                    <span className="label-text">{input.display}</span>
                  </div>
                  <input
                    type={input.type}
                    name={input.name}
                    placeholder={input.display}
                    onChange={(e) => handleChange(e, input.type, input.name)}
                    value={currentMat[input.name].toString()}
                    className="input input-bordered w-full"
                    onWheel={(e) => handleWheel(e)}
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
                  onChange={(e) => handleChange(e, "text", "note")}
                  value={currentMat.note}
                ></textarea>
              </label>
            </div>
          )}
          <button
            className={`btn btn-block mt-6 ${
              mode === EnumMode.Create ? "btn-neutral" : "btn-accent"
            }`}
            onClick={() => submitHandle()}
          >
            {mode}
          </button>
        </div>
      </div>
    </main>
  );
}

export default MaterialManage;
