import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.users.findFirst({
      where: { email },
    });
    if (user) {
      return Response.json({ error: "E-mail was used" }, { status: 409 });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const registerUser = await prisma.users.create({
      data: {
        email,
        password: hashPassword,
      },
    });
    return Response.json(registerUser, { status: 201 });
  } catch (error) {
    console.error("Create user error: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
