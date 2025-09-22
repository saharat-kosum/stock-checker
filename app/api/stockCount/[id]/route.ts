import prisma from "@/utils/db";
import { Prisma } from "@prisma/client";

const parseId = (id: string) => {
  const numericId = Number.parseInt(id, 10);
  return Number.isNaN(numericId) ? null : numericId;
};

const resolveMaterialId = async (
  materialIdentifier: string
): Promise<string | null> => {
  const materialConditions: Prisma.MaterialWhereInput[] = [
    { id: materialIdentifier },
  ];
  const numericMaterialIdentifier = Number(materialIdentifier);
  if (!Number.isNaN(numericMaterialIdentifier)) {
    materialConditions.push({ code: numericMaterialIdentifier });
  }

  const material = await prisma.material.findFirst({
    where: { OR: materialConditions },
  });

  return material?.id ?? null;
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseId(params.id);
    if (id === null) {
      return Response.json({ error: "Invalid stock count id" }, { status: 400 });
    }

    const stockCount = await prisma.stockCount.findUnique({
      where: { id },
      include: { material: true },
    });

    if (!stockCount) {
      return Response.json({ error: "Stock count not found" }, { status: 404 });
    }

    return Response.json(stockCount);
  } catch (error) {
    console.error("Get stock count by id error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseId(params.id);
    if (id === null) {
      return Response.json({ error: "Invalid stock count id" }, { status: 400 });
    }

    const {
      stockCode,
      materialId,
      countedQty,
      systemQty,
      countedDate,
      note,
    } = await request.json();

    const existingStockCount = await prisma.stockCount.findUnique({
      where: { id },
      select: { countedQty: true, systemQty: true },
    });

    if (!existingStockCount) {
      return Response.json({ error: "Stock count not found" }, { status: 404 });
    }

    const updateData: Prisma.StockCountUpdateInput = {};

    if (stockCode !== undefined) {
      updateData.stockCode = stockCode;
    }
    if (typeof countedQty === "number") {
      updateData.countedQty = countedQty;
    }
    if (typeof systemQty === "number") {
      updateData.systemQty = systemQty;
    }
    if (countedDate !== undefined) {
      updateData.countedDate = new Date(countedDate);
    }
    if (note !== undefined) {
      updateData.note = note;
    }

    if (materialId !== undefined) {
      const resolvedMaterialId = await resolveMaterialId(materialId);
      if (!resolvedMaterialId) {
        return Response.json(
          { error: "Material not found" },
          { status: 404 }
        );
      }
      updateData.material = {
        connect: { id: resolvedMaterialId },
      };
    }

    const nextCountedQty =
      typeof countedQty === "number"
        ? countedQty
        : existingStockCount.countedQty;
    const nextSystemQty =
      typeof systemQty === "number"
        ? systemQty
        : existingStockCount.systemQty;
    updateData.countDiff = nextCountedQty - nextSystemQty;

    const updatedStockCount = await prisma.stockCount.update({
      where: { id },
      data: updateData,
      include: { material: true },
    });

    return Response.json(updatedStockCount);
  } catch (error) {
    console.error("Update stock count error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseId(params.id);
    if (id === null) {
      return Response.json({ error: "Invalid stock count id" }, { status: 400 });
    }

    const deletedStockCount = await prisma.stockCount.delete({
      where: { id },
      include: { material: true },
    });

    return Response.json(deletedStockCount);
  } catch (error) {
    console.error("Delete stock count error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
