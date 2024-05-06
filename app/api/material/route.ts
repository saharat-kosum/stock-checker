import { PrismaClient } from "@prisma/client";
import { type NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const currentpage = parseInt(searchParams.get("currentpage") || "0");
    const search = searchParams.get("search") || undefined;
    const orderby = searchParams.get("orderby");
    const sort = searchParams.get("sort");
    const itemperpage = parseInt(searchParams.get("itemperpage") || "10");

    const skip = (currentpage - 1) * itemperpage;
    const order = orderby === "ASC" ? "asc" : "desc";
    const orderBy = sort ? { [sort]: order } : undefined;

    const materials = await prisma.material.findMany({
      skip,
      take: itemperpage,
      where: {
        name: { contains: search },
      },
      orderBy,
    });
    const totalMaterialsCount = await prisma.material.count();
    const totalPages = Math.ceil(totalMaterialsCount / itemperpage);
    return Response.json({ materials, totalPages });
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
