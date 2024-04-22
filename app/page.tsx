"use client";
import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      Hello world สวัสดี
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn"
        onClick={() => {
          if (document) {
            (
              document.getElementById("my_modal_1") as HTMLFormElement
            ).showModal();
          }
        }}
      >
        open modal
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </main>
  );
}
