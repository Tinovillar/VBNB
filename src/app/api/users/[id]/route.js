import { get, run } from "@/lib/db";

// Obtener un usuario por ID
export async function GET(_request, { params }) {
  try {
    const { id } = await params; // En Next.js 14/15, params puede ser una Promise
    const user = await get(
      `SELECT
        users.*,
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

    const {
      nombre,
      apellido,
      email,
      password,
      rol_id,
      tipo_documento,
      numero_documento,
      fecha_nacimiento,
      telefono,
      calle_numero,
      ciudad,
      provincia,
      codigo_postal,
    } = body;

    // Validación básica
    if (
      !nombre ||
      !apellido ||
      !email ||
      !rol_id ||
      !tipo_documento ||
      !numero_documento ||
      !fecha_nacimiento ||
      !telefono ||
      !calle_numero ||
      !ciudad ||
      !provincia ||
      !codigo_postal
    ) {
      return Response.json(
        { error: "Todos los campos obligatorios deben completarse" },
        { status: 400 },
      );
    }

    // Verificar existencia del usuario
    const existingUser = await get("SELECT * FROM users WHERE id = ?", [id]);
    if (!existingUser)
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 });

    // Si no se envía nueva contraseña, se mantiene la actual
    const finalPassword = password || existingUser.password;

    // Actualizar usuario
    await run(
      `UPDATE users
       SET nombre = ?, apellido = ?, email = ?, password = ?, rol_id = ?,
           tipo_documento = ?, numero_documento = ?, fecha_nacimiento = ?,
           telefono = ?, calle_numero = ?, ciudad = ?, provincia = ?, codigo_postal = ?
       WHERE id = ?`,
      [
        nombre,
        apellido,
        email,
        finalPassword,
        rol_id,
        tipo_documento,
        numero_documento,
        fecha_nacimiento,
        telefono,
        calle_numero,
        ciudad,
        provincia,
        codigo_postal,
        id,
      ],
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
