import React from "react";
import QRCode from "qrcode.react";
import { Material } from "@/type/type";

interface QrProps {
  material: Material;
}

function QrModal({ material }: QrProps) {
  const prefix = process.env.NEXT_PUBLIC_PREFIX_URL;
  return (
    <dialog id="QR_Modal" className="modal text-center">
      <div className="modal-box">
        <h3 className="font-bold text-lg">QR Code</h3>
        <div className="flex justify-center pt-6">
          <QRCode value={`${prefix}/balance/${material.id}`} />
        </div>
        <p className="py-4">{material.name}</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default QrModal;
