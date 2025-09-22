import prisma from "@/utils/db";
import { Prisma } from "@prisma/client";
import { type NextRequest } from "next/server";

const STOCK_COUNT_SORT_FIELDS = new Set([
  "stockCode",
  "materialId",
  "countedQty",
  "systemQty",
  "countedDate",
  "createdDate",
  "lastUpdated",
]);

const MATERIAL_SORT_FIELDS = new Set(["name", "code"]);

const buildOrderBy = (
  sort: string | null,
  order: "asc" | "desc"
): Prisma.StockCountOrderByWithRelationInput | undefined => {
  if (!sort) {
    return undefined;
  }

  if (STOCK_COUNT_SORT_FIELDS.has(sort)) {
    return { [sort]: order } as Prisma.StockCountOrderByWithRelationInput;
  }

  if (sort.includes(".")) {
    const [relation, field] = sort.split(".");
    if (relation === "material" && field && MATERIAL_SORT_FIELDS.has(field)) {
      return {
        material: { [field]: order },
      } as Prisma.StockCountOrderByWithRelationInput;
    }
  }

  return undefined;
};

const buildSearchWhere = (
  search: string | null
): Prisma.StockCountWhereInput | undefined => {
  if (!search) {
    return undefined;
  }

  const numericSearch = Number(search);
  const isNumeric = !Number.isNaN(numericSearch);

  const orConditions: Prisma.StockCountWhereInput[] = [
    { stockCode: { contains: search, mode: "insensitive" } },
    { materialId: { contains: search, mode: "insensitive" } },
    { note: { contains: search, mode: "insensitive" } },
    { material: { name: { contains: search, mode: "insensitive" } } },
  ];

  if (isNumeric) {
    orConditions.push({ countedQty: numericSearch });
    orConditions.push({ systemQty: numericSearch });
    orConditions.push({ material: { code: numericSearch } });
  }

  return { OR: orConditions };
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parsedPage = Number.parseInt(
      searchParams.get("currentpage") ?? "1",
      10
    );
    const currentPage = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
    const search = searchParams.get("search");
    const orderby = searchParams.get("orderby");
    const sort = searchParams.get("sort");
    const parsedItemsPerPage = Number.parseInt(
      searchParams.get("itemperpage") ?? "10",
      10
    );
    const itemPerPage =
      Number.isNaN(parsedItemsPerPage) || parsedItemsPerPage < 1
        ? 10
        : parsedItemsPerPage;
    const getAll = searchParams.get("all") === "true";

    const skip = (currentPage - 1) * itemPerPage;
    const order: "asc" | "desc" = orderby === "ASC" ? "asc" : "desc";
    const orderBy = buildOrderBy(sort, order);
    const where = buildSearchWhere(search);

    const stockCounts = await prisma.stockCount.findMany({
      skip: getAll ? undefined : skip,
      take: getAll ? undefined : itemPerPage,
      where,
      orderBy,
      include: { material: true },
    });

    const totalStockCounts = await prisma.stockCount.count({ where });
    const totalPages = Math.ceil(totalStockCounts / itemPerPage);

    return Response.json({ stockCounts, totalPages });
  } catch (error) {
    console.error("Get all stock count error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { materialId, countedQty, systemQty, countedDate, note } =
      await request.json();

    if (
      !materialId ||
      typeof countedQty !== "number" ||
      typeof systemQty !== "number" ||
      !countedDate
    ) {
      return Response.json({ error: "Invalid payload" }, { status: 400 });
    }

    const materialConditions: Prisma.MaterialWhereInput[] = [
      { id: materialId },
    ];
    const numericMaterialIdentifier = Number(materialId);
    if (!Number.isNaN(numericMaterialIdentifier)) {
      materialConditions.push({ code: numericMaterialIdentifier });
    }

    const material = await prisma.material.findFirst({
      where: { OR: materialConditions },
    });

    if (!material) {
      return Response.json({ error: "Material not found" }, { status: 404 });
    }

    const latestRecord = await prisma.stockCount.findFirst({
      orderBy: { id: "desc" },
      select: { id: true },
    });

    const nextId = (latestRecord?.id ?? 0) + 1;
    const stockCode = `CK${nextId.toString().padStart(6, "0")}`;

    const createdStockCount = await prisma.stockCount.create({
      data: {
        stockCode,
        countedQty,
        systemQty,
        countedDate: new Date(countedDate),
        note: note ?? null,
        material: {
          connect: { id: material.id },
        },
      },
      include: { material: true },
    });

    return Response.json(createdStockCount, { status: 201 });
  } catch (error) {
    console.error("Create stock count error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
