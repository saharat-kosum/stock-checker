import { Material } from "@/type/type";
import Link from "next/link";
import React from "react";

interface BalanceModalProps {
  material: Material;
}

function BalanceModal({ material }: BalanceModalProps) {
  return (
    <dialog id="Balance_Modal" className="modal">
      <div className="modal-box">
        {/* <h3 className="font-bold text-lg">ยอดคงเหลือ</h3> */}
        <h1 className="text-5xl font-bold mt-6 break-words">{`${material.code}`}</h1>
        <br />
        <h2 className="text-3xl font-semibold break-words">{`${material.name}`}</h2>
        <br />
        <p className="text-4xl font-bold break-words">{`คงเหลือ ${material.balance} ${material.unit}`}</p>
        <br />
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <Link href={"/"} className="btn">
              Close
            </Link>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default BalanceModal;
