import prisma from "@/utils/db";
import { Material } from "@/type/type";

export async function POST(request: Request) {
  const excelData: Material[] = await request.json();

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
}
