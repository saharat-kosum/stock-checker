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
        <p className="py-4">{`${material.name} คงเหลือ ${material.balance}`}</p>
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
