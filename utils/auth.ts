import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { JWTExpired } from "jose/errors";
import { cookies } from "next/headers";

export function getAccessKey() {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret || secret.length === 0) {
    throw new Error("JWT Secret key is not set");
  }

  const enc: Uint8Array = new TextEncoder().encode(secret);
  return enc;
}

export function getRefreshKey() {
  const secret = process.env.REFRESH_TOKEN_SECRET;

  if (!secret || secret.length === 0) {
    throw new Error("JWT Secret key is not set");
  }

  const enc: Uint8Array = new TextEncoder().encode(secret);
  return enc;
}

export async function verifyToken(): Promise<JWTPayload | null> {
  const token = cookies().get("accessToken");
  if (!token || !token.value) {
    console.log("No access token found");
    return null;
  }

  try {
    const secretKey = getAccessKey();
    const { payload } = await jwtVerify(token.value, secretKey);
    return payload;
  } catch (error) {
    if (error instanceof JWTExpired) {
      return await refreshTokenAndVerify(token.value);
    } else {
      return null;
    }
  }
}

async function refreshTokenAndVerify(
  token: string
): Promise<JWTPayload | null> {
  try {
    const refreshToken = cookies().get("refreshToken");
    if (!refreshToken || !refreshToken.value) {
      console.log("No refresh token found");
      return null;
    }

    const prefixUrl = process.env.PREFIX_URL;
    const response = await fetch(`${prefixUrl}/api/token/refresh`, {
      method: "POST",
      headers: {
        Cookie: `accessToken=${token}; refreshToken=${refreshToken.value}`,
      },
    });

    if (response.ok) {
      return await verifyToken();
    } else {
      const result = await response.json();
      console.error("Refresh Token failed:", result);
      return null;
    }
  } catch (error) {
    console.error("Refresh Token failed:", error);
    return null;
  }
}

export async function createAccessToken(userId: string) {
  const key = getAccessKey();
  const token = await new SignJWT({
    id: userId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("3h")
    .sign(key);

  return token;
}

export async function createRefreshToken(userId: string) {
  const key = getRefreshKey();
  const token = await new SignJWT({
    id: userId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  return token;
}
