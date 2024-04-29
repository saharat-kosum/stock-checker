import Plus from "@/components/icon/Plus";
import React from "react";

function Admin() {
  return (
    <div className="container mx-auto mt-10 p-2">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">List of Material</h1>
        <button className="btn btn-primary btn-sm">
          <Plus />
          <p className="hidden sm:block">Add new material</p>
        </button>
      </div>
      <div className="overflow-x-auto mt-6">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>
            {/* row 2 */}
            <tr>
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
            </tr>
            {/* row 3 */}
            <tr>
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
