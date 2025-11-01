import { get } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST(request) {
  try {
    const data = await request.json();
    const { email, password } = data;

    const user = await get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (user.password !== password) {
      return Response.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    // Guardar cookie de sesión
    await createSession(user.id);

    return Response.json({
      message: "Login exitoso",
      user: { id: user.id, nombre: user.nombre, rol_id: user.rol_id },
    });
  } catch (err) {
    console.error("Error en login:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
