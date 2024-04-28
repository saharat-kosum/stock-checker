import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    return Response.json(await prisma.material.findMany());
  } catch (error) {
    console.error("Get all material error: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const {
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
    } = await request.json();

    const newMaterial = await prisma.material.create({
      data: {
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

    return Response.json(newMaterial, { status: 201 });
  } catch (error) {
    console.error("Create Material error: ", error);
    Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
