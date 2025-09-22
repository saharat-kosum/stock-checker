"use client";
import StockCountExportBtn from "@/components/StockCountExportBtn";
import Pagination from "@/components/Pagination";
import Spin from "@/components/icon/Spin";
import ThreeDots from "@/components/icon/ThreeDots";
import { AppDispatch, useAppSelector } from "@/redux/Store";
import {
  deleteStockCount,
  getAllStockCount,
} from "@/redux/stockCountSlice";
import { SelectArray, SelectState } from "@/type/type";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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
      { display: "เลขที่เอกสารเช็คสต๊อก", value: "stockCode" },
      { display: "Material name", value: "material.name" },
      { display: "จำนวนที่นับได้", value: "countedQty" },
      { display: "จำนวนจากระบบ", value: "systemQty" },
      { display: "วันที่ทำการตรวจนับ", value: "countedDate" },
      { display: "Created date", value: "createdDate" },
      { display: "Last updated", value: "lastUpdated" },
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

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleDateString();
};

function StockCountPage() {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useAppSelector((state) => state.stockCount.loading);
  const stockCounts = useAppSelector((state) => state.stockCount.stockCounts);
  const totalPages = useAppSelector((state) => state.stockCount.totalPages);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [select, setSelect] = useState<SelectState>({
    order: "ASC",
    sort: "stockCode",
    itemsPerPage: "50",
  });

  useEffect(() => {
    const paginatedProps = {
      select,
      currentPage,
      search: appliedSearch,
      all: false,
    };

    void dispatch(getAllStockCount(paginatedProps));
  }, [dispatch, select, currentPage, appliedSearch]);

  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    const { name, value } = event.target;
    setSelect((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const searchLogic = () => {
    setAppliedSearch(search);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteStockCount(id)).unwrap();
      const paginatedProps = {
        select,
        currentPage,
        search: appliedSearch,
        all: false,
      };

      await dispatch(getAllStockCount(paginatedProps));
    } catch (error) {
      console.error("Failed to delete stock count", error);
    }
  };

  return (
    <div className="container mx-auto my-10 p-2">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stock count</h1>
        <div className="flex gap-4 items-center">
          <StockCountExportBtn
            select={select}
            currentPage={currentPage}
            search={appliedSearch}
            all={true}
          />
        </div>
      </div>

      <div className="flex mt-6 justify-between flex-col gap-4 sm:flex-row sm:items-end">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchLogic();
          }}
        >
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
              onClick={() => {
                searchLogic();
              }}
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </form>
        <div className="flex gap-6 sm:w-80">
          {selectArray.map((selects, index) => (
            <label className="form-control w-full max-w-xs" key={index}>
              <div className="label p-1">
                <span className="label-text-alt">{selects.display}</span>
              </div>
              <select
                className="select select-bordered select-sm w-full max-w-xs"
                onChange={selectChange}
                value={select[selects.name]}
                name={selects.name}
              >
                {selects.optionArray.map((option, optionIndex) => (
                  <option value={option.value} key={optionIndex}>
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
          <Spin size="lg" />
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="table table-pin-rows mb-12">
            <thead>
              <tr className="text-center">
                <th>No</th>
                <th>เลขที่เอกสารเช็คสต๊อก</th>
                <th>Material name</th>
                <th>จำนวนที่นับได้</th>
                <th>จำนวนจากระบบ</th>
                <th>วันที่ทำการตรวจนับ</th>
                <th>หมายเหตุ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {stockCounts.map((item, index) => (
                <tr className="text-center" key={`${item.id}-${index}`}>
                  <td>
                    {parseInt(select.itemsPerPage, 10) * (currentPage - 1) +
                      (index + 1)}
                  </td>
                  <td>{item.stockCode}</td>
                  <td>{item.material.name}</td>
                  <td>{item.countedQty}</td>
                  <td>{item.systemQty}</td>
                  <td>{formatDate(item.countedDate)}</td>
                  <td>{item.note ?? "-"}</td>
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
                          <Link href={`/admin/stock/${item.id}`}>Edit</Link>
                        </li>
                        <li>
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => handleDelete(item.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                void handleDelete(item.id);
                              }
                            }}
                          >
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

export default StockCountPage;
