import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Sesión cerrada" });
  response.cookies.delete("vbnb_session"); // 👈 elimina y agrega el Set-Cookie correcto
  return response;
}
