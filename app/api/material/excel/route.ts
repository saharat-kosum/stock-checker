import { PrismaClient } from "@prisma/client";
import formidable, { Fields, Files } from "formidable";
import * as XLSX from "xlsx";
import { Material } from "@/type/type";

const prisma = new PrismaClient();

export async function POST(request: any) {
  const form = new formidable.IncomingForm();
  form.parse(request, async (err, fields: Fields, files: Files) => {
    if (err) {
      console.error("Formidable error:", err);
      return Response.json(
        { error: "Error parsing form data" },
        { status: 500 }
      );
    }

    const uploadedFile = files.file && files.file[0];

    if (!uploadedFile) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read Excel file
    const workbook = XLSX.read(uploadedFile);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData: Material[] = XLSX.utils.sheet_to_json(sheet);

    // Process Excel data and update database
    try {
      await Promise.all(
        excelData.map(async (row) => {
          const {
            id,
            sloc,
            code,
            name,
            unit,
            bringForward,
            stockIn,
            stockOut,
            balance,
            stockCount,
            note,
          } = row;
          await prisma.material.upsert({
            where: { id },
            update: {
              sloc,
              code,
              name,
              unit,
              bringForward,
              stockIn,
              stockOut,
              balance,
              stockCount,
              note,
            },
            create: {
              sloc,
              code,
              name,
              unit,
              bringForward,
              stockIn,
              stockOut,
              balance,
              stockCount,
              note,
            },
          });
        })
      );

      return Response.json({ message: "Database updated successfully" });
    } catch (error) {
      console.error("Create Material error: ", error);
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  });
}
