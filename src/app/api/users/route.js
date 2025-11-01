import { query, run, get } from "@/lib/db";
import { getSession } from "@/lib/session";

// Obtener todos los usuarios
export async function GET() {
  try {
    const userId = await getSession();

    if (!userId) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener usuario actual para saber su rol
    const currentUser = await get("SELECT rol_id FROM users WHERE id = ?", [
      userId,
    ]);
    if (!currentUser) {
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    let users = [];

    // ADMIN → ve todos los usuarios menos a sí mismo
    if (currentUser.rol_id === 1) {
      users = await query(
        `
        SELECT
          users.id,
          users.nombre,
          users.apellido,
          users.email,
          users.rol_id,
          roles.nombre AS rol_nombre,
          users.fecha_registro
        FROM users
        LEFT JOIN roles ON users.rol_id = roles.id
        WHERE users.id != ?
        ORDER BY users.id ASC
      `,
        [userId],
      );
    }

    // CLIENTE → sólo se ve a sí mismo
    else if (currentUser.rol_id === 2) {
      users = await query(
        `
        SELECT
          users.id,
          users.nombre,
          users.apellido,
          users.email,
          users.rol_id,
          roles.nombre AS rol_nombre,
          users.fecha_registro
        FROM users
        LEFT JOIN roles ON users.rol_id = roles.id
        WHERE users.id = ?
      `,
        [userId],
      );
    }

    // EMPLEADO → sólo ve otros empleados
    else if (currentUser.rol_id === 3) {
      users = await query(
        `
        SELECT
          users.id,
          users.nombre,
          users.apellido,
          users.email,
          users.rol_id,
          roles.nombre AS rol_nombre,
          users.fecha_registro
        FROM users
        LEFT JOIN roles ON users.rol_id = roles.id
        WHERE users.rol_id = 3 AND users.id != ?
      `,
        [userId],
      );
    }

    return Response.json(users);
  } catch (err) {
    console.error("Error obteniendo usuarios:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// Crear un nuevo usuario
export async function POST(request) {
  try {
    const data = await request.json();
    const {
      nombre,
      apellido,
      email,
      password,
      rol_id = 2, // Por defecto, cliente
    } = data;

    if (!nombre || !apellido || !email || !password) {
      return Response.json(
        { error: "Nombre, apellido, email y contraseña son obligatorios" },
        { status: 400 },
      );
    }

    // Verificar si ya existe el email
    const existing = await get("SELECT id FROM users WHERE email = ?", [email]);
    if (existing) {
      return Response.json(
        { error: "El usuario ya existe con ese email" },
        { status: 400 },
      );
    }

    await run(
      `INSERT INTO users (nombre, apellido, email, password, rol_id)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellido, email, password, rol_id],
    );

    return Response.json(
      { message: "Usuario creado correctamente" },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error creando usuario:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
