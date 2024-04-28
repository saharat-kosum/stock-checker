import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = await prisma.users.findFirst({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return Response.json(
        { error: "Invalid email or password." },
        { status: 400 }
      );
    }

    if (user.role !== "admin") {
      return Response.json({ error: "You are not admin" }, { status: 401 });
    }

    const accessToken = await createAccessToken(user.id);
    const refreshToken = await createRefreshToken(user.id);

    user.refreshToken = refreshToken;
    await prisma.users.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    cookies().set("accessToken", accessToken);
    cookies().set("refreshToken", refreshToken, {
      httpOnly: true,
    });
    return Response.json({ message: "Login success" });
  } catch (error) {
    console.error("Log in failed: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
