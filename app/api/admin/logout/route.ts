import { cookies } from "next/headers";

export async function POST() {
  try {
    cookies().delete("accessToken");
    cookies().delete("refreshToken");
    return Response.json({ message: "Log out success" });
  } catch (error) {
    console.error("Log out failed: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
