import prisma from "@/utils/db";

const getMonthRange = (reference: Date) => {
  const start = new Date(reference.getFullYear(), reference.getMonth(), 1);
  const end = new Date(reference.getFullYear(), reference.getMonth() + 1, 1);
  return { start, end };
};

export async function GET() {
  try {
    const now = new Date();
    const { start, end } = getMonthRange(now);

    const materials = await prisma.material.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        stockCounts: {
          where: {
            countedDate: {
              gte: start,
              lt: end,
            },
          },
          select: { id: true },
          take: 1,
        },
      },
      orderBy: { code: "asc" },
    });

    const payload = materials.map(({ stockCounts, ...material }) => ({
      ...material,
      isCurrentMonth: stockCounts.length > 0 ? 1 : 0,
    }));

    return Response.json({ materials: payload });
  } catch (error) {
    console.error("Get stock list error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
