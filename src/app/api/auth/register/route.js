import { run, get } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST(request) {
  try {
    const data = await request.json();
    const { nombre, apellido, email, password } = data;

    // Verificar si el usuario ya existe
    let existing = await get("SELECT * FROM users WHERE email = ?", [email]);
    if (existing) {
      return Response.json({ error: "El usuario ya existe" }, { status: 400 });
    }

    // Insertar nuevo usuario con rol "Cliente" (rol_id = 2)
    const result = await run(
      `INSERT INTO users (nombre, apellido, email, password, rol_id)
       VALUES (?, ?, ?, ?, 2)`,
      [nombre, apellido, email, password],
    );

    let user = await get("SELECT * FROM users WHERE email = ?", [email]);

    await createSession(user.id);

    return Response.json({
      message: "Usuario creado correctamente",
      user: { id: user.id, nombre: user.nombre, rol_id: user.rol_id },
    });
  } catch (err) {
    console.error("Error en registro:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
