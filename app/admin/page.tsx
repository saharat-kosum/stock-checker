"use client";
import Plus from "@/components/icon/Plus";
import React, { useEffect } from "react";
import Link from "next/link";
import { AppDispatch, useAppSelector } from "@/redux/Store";
import { useDispatch } from "react-redux";
import { getAllMaterial } from "@/redux/materialSlice";
import ThreeDots from "@/components/icon/ThreeDots";
import Spinner from "@/components/Spinner";

function Admin() {
  const isLoading = useAppSelector((state) => state.material.loading);
  const materialList = useAppSelector((state) => state.material.material);
  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   dispatch(getAllMaterial());
  // }, []);

  return (
    <div className="container mx-auto mt-10 p-2">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">List of Material</h1>
        <Link href="/admin/material" className="btn btn-primary btn-sm">
          <Plus />
          <p className="hidden sm:block">Add new material</p>
        </Link>
      </div>
      <div className="flex mt-6 justify-between flex-col gap-4 sm:flex-row sm:items-center">
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="Search" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70 hover:cursor-pointer"
            onClick={() => console.log("test")}
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <div className="flex gap-6 sm:w-60">
          <select className="select select-bordered select-sm w-full max-w-xs">
            <option value={0} defaultValue={0}>
              sort by
            </option>
            <option>20</option>
            <option>50</option>
            <option>100</option>
            <option>500</option>
            <option>1000</option>
          </select>
          <select className="select select-bordered select-sm w-full max-w-xs">
            <option value={0} defaultValue={0}>
              count
            </option>
            <option>20</option>
            <option>50</option>
            <option>100</option>
            <option>500</option>
            <option>1000</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className="min-w-60 min-h-96 hero-content mx-auto">
          <Spinner size={"lg"} />
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="table">
            {/* head */}
            <thead>
              <tr className="text-center">
                <th></th>
                <th>Sloc</th>
                <th>Material Code</th>
                <th>รายการ</th>
                <th>หน่วย</th>
                <th>ยอดยกมา</th>
                <th>รับ</th>
                <th>จ่าย</th>
                <th>คงเหลือ</th>
                <th>ยอดตรวจนับ</th>
                <th>หมายเหตุ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {materialList.map((material, index) => (
                <tr className="text-center" key={index}>
                  <th>{index + 1}</th>
                  <td>{material.sloc}</td>
                  <td>{material.code}</td>
                  <td>{material.name}</td>
                  <td>{material.unit}</td>
                  <td>{material.bringForward}</td>
                  <td>{material.stockIn}</td>
                  <td>{material.stockOut}</td>
                  <td>{material.balance}</td>
                  <td>{material.stockCount}</td>
                  <td>{material.note}</td>
                  <td>
                    <div className="dropdown dropdown-left">
                      <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-sm btn-circle"
                      >
                        <ThreeDots />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36"
                      >
                        <li>
                          <a>Item 1</a>
                        </li>
                        <li>
                          <a>Item 2</a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="join">
            <button className="join-item btn btn-md">1</button>
            <button className="join-item btn btn-md btn-active">2</button>
            <button className="join-item btn btn-disabled">...</button>
            <button className="join-item btn btn-md">3</button>
            <button className="join-item btn btn-md">4</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
