import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import {
  createAccessToken,
  createRefreshToken,
  getRefreshKey,
} from "@/utils/auth";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const refreshToken = cookies().get("refreshToken");
    if (!refreshToken) {
      return Response.json({ error: "No refresh token" }, { status: 500 });
    }

    const secretKey = getRefreshKey();
    const { payload } = await jwtVerify(refreshToken.value, secretKey);

    const user = await prisma.users.findFirst({
      where: { id: payload.id as string },
    });

    if (!user) {
      return Response.json({ error: "User doesn't exist" }, { status: 404 });
    }

    if (user.refreshToken !== refreshToken.value) {
      return Response.json({ error: "Invalid refresh token" }, { status: 500 });
    }

    const accessToken = await createAccessToken(user.id);
    const newRefreshToken = await createRefreshToken(user.id);

    user.refreshToken = newRefreshToken;
    await prisma.users.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    cookies().set("accessToken", accessToken);
    cookies().set("refreshToken", newRefreshToken, {
      httpOnly: true,
    });
    return Response.json({
      message: "Refresh Token success",
      accessToken: accessToken,
    });
  } catch (error) {
    console.error("Refresh token failed: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
