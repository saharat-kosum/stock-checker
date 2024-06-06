import prisma from "@/utils/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: params.id },
    });
    if (!material) {
      return Response.json({ error: "Material not found" }, { status: 404 });
    }
    return Response.json(material);
  } catch (error) {
    console.error("Get material by id error: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
