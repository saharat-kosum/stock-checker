import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    return Response.json(
      await prisma.material.findUnique({
        where: { id: params.id },
      })
    );
  } catch (error) {
    console.error("Get material by id error: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
