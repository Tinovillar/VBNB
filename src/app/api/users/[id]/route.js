import { get, run } from "@/lib/db";

// Obtener un usuario por ID
export async function GET(_request, { params }) {
  try {
    const { id } = await params; // En Next.js 14/15, params puede ser una Promise
    const user = await get(
      `SELECT
        users.id,
        users.nombre,
        users.apellido,
        users.email,
        users.rol_id,
        users.fecha_registro,
        roles.nombre AS rol_nombre
      FROM users
      LEFT JOIN roles ON users.rol_id = roles.id
      WHERE users.id = ?`,
      [id],
    );

    if (!user) {
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return Response.json({ user });
  } catch (err) {
    console.error("Error obteniendo usuario:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// Actualizar un usuario
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { nombre, apellido, email, password, rol_id } = body;

    if (!nombre || !apellido || !email || !rol_id) {
      return Response.json(
        { error: "Nombre, apellido, email y rol son obligatorios" },
        { status: 400 },
      );
    }

    // Verificar que el usuario exista
    const exists = await get("SELECT id FROM users WHERE id = ?", [id]);
    if (!exists)
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 });

    await run(
      `UPDATE users
       SET nombre = ?, apellido = ?, email = ?, password = ?, rol_id = ?
       WHERE id = ?`,
      [nombre, apellido, email, password || exists.password, rol_id, id],
    );

    return Response.json({ message: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error("Error actualizando usuario:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// Eliminar un usuario
export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;

    const exists = await get("SELECT id FROM users WHERE id = ?", [id]);
    if (!exists) {
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    await run("DELETE FROM users WHERE id = ?", [id]);

    return Response.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("Error eliminando usuario:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
