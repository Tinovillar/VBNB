import { get, run } from "@/lib/db";
import { getSession } from "@/lib/session";
// Obtener perfil del usuario autenticado
export async function GET() {
  try {
    const userId = await getSession();
    if (!userId)
      return Response.json({ error: "No hay sesión activa" }, { status: 401 });

    const user = await get("SELECT * FROM users WHERE id = ?", [userId]);
    if (!user)
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 });

    return Response.json({ user });
  } catch (err) {
    console.error("Error al obtener perfil:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// Actualizar perfil del usuario autenticado
export async function PUT(req) {
  try {
    const userId = await getSession();
    if (!userId)
      return Response.json({ error: "No hay sesión activa" }, { status: 401 });

    const body = await req.json();

    const {
      nombre,
      apellido,
      email,
      password,
      tipo_documento,
      numero_documento,
      fecha_nacimiento,
      telefono,
      calle_numero,
      ciudad,
      provincia,
      codigo_postal,
    } = body;

    // Validación de campos obligatorios
    if (
      !nombre ||
      !apellido ||
      !email ||
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
    const existingUser = await get("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    if (!existingUser)
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 });

    // Si no se envía nueva contraseña, se mantiene la actual
    const finalPassword = password || existingUser.password;

    // Actualizar registro
    await run(
      `UPDATE users
         SET nombre = ?, apellido = ?, email = ?, password = ?,
             tipo_documento = ?, numero_documento = ?, fecha_nacimiento = ?,
             telefono = ?, calle_numero = ?, ciudad = ?, provincia = ?, codigo_postal = ?
       WHERE id = ?`,
      [
        nombre,
        apellido,
        email,
        finalPassword,
        tipo_documento,
        numero_documento,
        fecha_nacimiento,
        telefono,
        calle_numero,
        ciudad,
        provincia,
        codigo_postal,
        userId,
      ],
    );

    return Response.json({ message: "Perfil actualizado correctamente" });
  } catch (err) {
    console.error("Error actualizando perfil:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
