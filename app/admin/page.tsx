"use client";
import Plus from "@/components/icon/Plus";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppDispatch, useAppSelector } from "@/redux/Store";
import { useDispatch } from "react-redux";
import { deleteMaterial, getAllMaterial } from "@/redux/materialSlice";
import ThreeDots from "@/components/icon/ThreeDots";
import Spinner from "@/components/Spinner";
import { SelectArray, SelectState } from "@/type/type";
import Pagination from "@/components/Pagination";
import QrModal from "@/components/QrModal";
import QrCode from "@/components/icon/QrCode";

const selectArray: SelectArray[] = [
  {
    display: "ลำดับ",
    name: "order",
    optionArray: [
      { display: "A-Z", value: "ASC" },
      { display: "Z-A", value: "DESC" },
    ],
  },
  {
    display: "เรียงตาม",
    name: "sort",
    optionArray: [
      { display: "Sloc", value: "sloc" },
      { display: "Material Code", value: "code" },
      { display: "รายการ", value: "name" },
      { display: "หน่วย", value: "unit" },
      { display: "ยอดยกมา", value: "bringForward" },
      { display: "รับ", value: "stockIn" },
      { display: "จ่าย", value: "stockOut" },
      { display: "คงเหลือ", value: "balance" },
      { display: "ยอดตรวจนับ", value: "stockCount" },
    ],
  },
  {
    display: "จำนวนแถว",
    name: "itemsPerPage",
    optionArray: [
      { display: "20", value: "20" },
      { display: "50", value: "50" },
      { display: "100", value: "100" },
      { display: "500", value: "500" },
      { display: "1000", value: "1000" },
    ],
  },
];

function Admin() {
  const isLoading = useAppSelector((state) => state.material.loading);
  const materialList = useAppSelector((state) => state.material.material);
  const totalPages = useAppSelector((state) => state.material.totalPages);
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [select, setSelect] = useState<SelectState>({
    order: "ASC",
    sort: "name",
    itemsPerPage: "50",
  });

  useEffect(() => {
    searchHandle();
  }, [select, currentPage]);

  const searchHandle = async () => {
    const props = {
      select,
      currentPage,
      search,
    };
    await dispatch(getAllMaterial(props));
  };

  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setSelect((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const deleteHandle = async (id: string) => {
    await dispatch(deleteMaterial(id));
  };

  return (
    <div className="container mx-auto mt-10 p-2">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">List of Material</h1>
        <Link href="/admin/material" className="btn btn-primary btn-sm">
          <Plus />
          <p className="hidden sm:block">Add new material</p>
        </Link>
      </div>
      <div className="flex mt-6 justify-between flex-col gap-4 sm:flex-row sm:items-end">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70 hover:cursor-pointer"
            onClick={() => searchHandle()}
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <div className="flex gap-6 sm:w-80">
          {selectArray.map((selects, index) => (
            <label className="form-control w-full max-w-xs" key={index}>
              <div className="label p-1">
                <span className="label-text-alt">{selects.display}</span>
              </div>
              <select
                className="select select-bordered select-sm w-full max-w-xs"
                onChange={(e) => selectChange(e)}
                value={select[selects.name]}
                name={selects.name}
              >
                {selects.optionArray.map((option, index) => (
                  <option value={option.value} key={index}>
                    {option.display}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="min-w-60 min-h-96 hero-content mx-auto">
          <Spinner size={"lg"} />
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="table table-pin-rows mb-12">
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
                <th>QR Code</th>
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
                    <button
                      className="btn btn-ghost btn-sm btn-circle"
                      onClick={() => {
                        const modal = document.getElementById(
                          "QR_Modal"
                        ) as HTMLDialogElement | null;
                        if (modal) {
                          modal.showModal();
                        }
                      }}
                    >
                      <QrCode />
                    </button>
                    <QrModal material={material} />
                  </td>
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
                          <Link href={`/admin/material/${material.id}`}>
                            Edit
                          </Link>
                        </li>
                        <li>
                          <div onClick={() => deleteHandle(material.id)}>
                            Delete
                          </div>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="text-end mt-1">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default Admin;
