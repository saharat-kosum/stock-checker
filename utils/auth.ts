import { JWTPayload, jwtVerify, SignJWT } from "jose";
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

export function hasAccessToken() {
  const token = cookies().get("accessToken");
  if (token && token.value && token.value.length > 0) {
    return true;
  } else {
    return false;
  }
}
