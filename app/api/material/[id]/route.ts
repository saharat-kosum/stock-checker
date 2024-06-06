import prisma from "@/utils/db";

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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const updatedMaterial = await prisma.material.update({
      where: { id: params.id },
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

    if (!updatedMaterial) {
      return Response.json({ error: "Material not found" }, { status: 404 });
    }
    return Response.json(updatedMaterial);
  } catch (error) {
    console.error("Edit Material error: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedMaterial = await prisma.material.delete({
      where: { id: params.id },
    });
    if (!deletedMaterial) {
      return Response.json({ error: "Material not found" }, { status: 404 });
    }
    return Response.json(deletedMaterial);
  } catch (error) {
    console.error("Delete Material error: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
