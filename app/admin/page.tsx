"use client";
import Plus from "@/components/icon/Plus";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppDispatch, useAppSelector } from "@/redux/Store";
import { useDispatch } from "react-redux";
import { deleteMaterial, getAllMaterial } from "@/redux/materialSlice";
import ThreeDots from "@/components/icon/ThreeDots";
import { SelectArray, SelectState } from "@/type/type";
import Pagination from "@/components/Pagination";
import QrModal from "@/components/QrModal";
import QrCode from "@/components/icon/QrCode";
import ExportBtn from "@/components/ExportBtn";
import Spin from "@/components/icon/Spin";

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
  const allMaterials = useAppSelector((state) => state.material.allMaterials);
  const defaultMaterial = useAppSelector(
    (state) => state.material.defaultMaterial
  );
  const [selectedMaterial, setSelectedMaterial] = useState({
    ...defaultMaterial,
  });
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [select, setSelect] = useState<SelectState>({
    order: "ASC",
    sort: "name",
    itemsPerPage: "50",
  });
  const [isGeneratingQrPdf, setIsGeneratingQrPdf] = useState(false);

  useEffect(() => {
    searchHandle();
  }, [select, currentPage]);

  const searchHandle = async () => {
    const paginatedProps = {
      select,
      currentPage,
      search,
      all: false,
    };

    const allProps = {
      ...paginatedProps,
      currentPage: 1,
      all: true,
    };
    await Promise.all([
      dispatch(getAllMaterial(paginatedProps)),
      dispatch(getAllMaterial(allProps)),
    ]);
  };

  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    const { name, value } = event.target;
    setSelect((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const deleteHandle = async (id: string) => {
    await dispatch(deleteMaterial(id));
  };

  const searchLogic = () => {
    if (currentPage === 1) {
      searchHandle();
    } else {
      setCurrentPage(1);
    }
  };

  const downloadQrPdf = async () => {
    if (!allMaterials.length || isGeneratingQrPdf) {
      return;
    }

    setIsGeneratingQrPdf(true);

    try {
      const [{ jsPDF }, QRCode, { sarabunBase64 }] = await Promise.all([
        import("jspdf"),
        import("qrcode"),
        import("@/utils/fonts/sarabun"),
      ]);

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      doc.addFileToVFS("Sarabun-Regular.ttf", sarabunBase64);
      doc.addFont("Sarabun-Regular.ttf", "Sarabun", "normal");
      doc.setFont("Sarabun", "normal");

      const prefix =
        process.env.NEXT_PUBLIC_PREFIX_URL ||
        (typeof window !== "undefined" ? window.location.origin : "");

      const qrPerPage = 18;
      const marginX = 10;
      const marginY = 10;
      const columnGap = 8;
      const pxToMm = (px: number) => (px * 25.4) / 96;
      const qrSize = pxToMm(100);
      const gapBelowQr = pxToMm(18);
      const gapBetweenCodeAndName = pxToMm(12);
      const cellHeight = 44;
      const pageWidth = doc.internal.pageSize.getWidth();
      const usableWidth = pageWidth - marginX * 2 - columnGap * 2;
      const columnWidth = usableWidth / 3;

      for (let index = 0; index < allMaterials.length; index++) {
        if (index > 0 && index % qrPerPage === 0) {
          doc.addPage();
        }

        const material = allMaterials[index];
        const pageIndex = index % qrPerPage;
        const column = pageIndex % 3;
        const row = Math.floor(pageIndex / 3);

        const canvasData = await QRCode.toDataURL(
          `${prefix}/balance/${material.id}`,
          {
            width: 256,
            margin: 1,
          }
        );

        const columnStart = marginX + column * (columnWidth + columnGap);
        const centerX = columnStart + columnWidth / 2;
        const topY = marginY + row * cellHeight;
        const qrX = centerX - qrSize / 2;

        doc.addImage(canvasData, "PNG", qrX, topY, qrSize, qrSize);
        doc.setFontSize(10);
        const codeY = topY + qrSize + gapBelowQr;
        doc.text(material.code.toString(), centerX, codeY, {
          align: "center",
        });
        doc.setFontSize(8);
        const nameLines = doc.splitTextToSize(
          material.name || "",
          columnWidth - 6
        );
        const nameY = codeY + gapBetweenCodeAndName;
        doc.text(nameLines, centerX, nameY, {
          align: "center",
        });
      }

      doc.save("material-qr-codes.pdf");
    } catch (error) {
      console.error("Failed to generate QR PDF", error);
    } finally {
      setIsGeneratingQrPdf(false);
    }
  };

  return (
    <div className="container mx-auto my-10 p-2">
      <div className="flex justify-between items-center">
        <QrModal material={selectedMaterial} />
        <h1 className="text-3xl font-bold">List of Material</h1>
        <div className="flex gap-4 items-center">
          <ExportBtn
            select={select}
            currentPage={currentPage}
            search={search}
            all={true}
          />
          <button
            className="btn btn-accent btn-sm"
            onClick={downloadQrPdf}
            disabled={isGeneratingQrPdf || !allMaterials.length}
          >
            {isGeneratingQrPdf ? "Generating..." : "Download all QR"}
          </button>
          <Link href="/admin/material" className="btn btn-primary btn-sm">
            <Plus />
            <p className="hidden sm:block">Add new material</p>
          </Link>
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
          <Spin size={"lg"} />
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
                  <th>
                    {parseInt(select.itemsPerPage) * (currentPage - 1) +
                      (index + 1)}
                  </th>
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
                        setSelectedMaterial(material);
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
