"use server";

import { cookies } from "next/headers";
import { get } from "./db";

const COOKIE_NAME = "vbnb_session";

// Crear sesión (guardar cookie)
export async function createSession(userId) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId.toString(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 día
  });
}

// Obtener ID del usuario actual
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session ? session.value : null;
}

// Cerrar sesión
export async function destroySession() {
  cookies().delete("vbnb_session");
}

export async function getUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("vbnb_session");

  if (!session) return null;

  const user = await get(
    "SELECT id, nombre, email, rol_id FROM users WHERE id = ?",
    [session.value],
  );

  return user || null;
}
