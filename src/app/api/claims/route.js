import { query, run, get } from "@/lib/db";
import { getSession, getUser } from "@/lib/session";

// Obtener todos los siniestros del usuario autenticado
export async function GET() {
  try {
    const userId = await getSession();
    if (!userId) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    // Trae los siniestros asociados a pólizas del usuario
    const claims = await query(
      `SELECT c.id, c.description, c.status, c.fecha,
              up.policy_id, p.name AS policy_nombre
       FROM claims c
       JOIN user_policies up ON c.user_policy_id = up.id
       JOIN policies p ON up.policy_id = p.id
       WHERE up.user_id = ?
       ORDER BY c.fecha DESC`,
      [userId],
    );

    return Response.json(claims);
  } catch (err) {
    console.error("Error al obtener siniestros:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// Reportar un nuevo siniestro
export async function POST(request) {
  try {
    const userId = await getSession();
    if (!userId) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    const { user_policy_id, description } = data;

    // Validaciones básicas
    if (!user_policy_id || !description) {
      return Response.json(
        { error: "Debe indicar la póliza y la descripción del siniestro" },
        { status: 400 },
      );
    }

    // Verificar que la póliza pertenezca al usuario
    const [userPolicy] = await query(
      `SELECT * FROM user_policies WHERE id = ? AND user_id = ?`,
      [user_policy_id, userId],
    );

    // Insertar nuevo siniestro
    await run(
      `INSERT INTO claims (user_policy_id, description, status)
       VALUES (?, ?, 'reportado')`,
      [user_policy_id, description],
    );

    return Response.json(
      { message: "Siniestro reportado correctamente" },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error al reportar siniestro:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const user = await getUser();

    // 1. Validar sesión
    if (!user) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    // 3. Obtener datos del body
    const { id, status } = await request.json();

    if (!id || !status) {
      return Response.json(
        { error: "ID y estado son obligatorios" },
        { status: 400 },
      );
    }

    // 4. Validar que el nuevo estado sea válido
    const estadosValidos = ["reportado", "en revisión", "cerrado"];
    if (!estadosValidos.includes(status)) {
      return Response.json({ error: "Estado inválido" }, { status: 400 });
    }

    // 5. Verificar que el siniestro exista
    const existing = await get("SELECT * FROM claims WHERE id = ?", [id]);
    if (!existing) {
      return Response.json(
        { error: "Siniestro no encontrado" },
        { status: 404 },
      );
    }

    // 6. Actualizar estado
    await run("UPDATE claims SET status = ? WHERE id = ?", [status, id]);

    return Response.json({
      message: `Estado del siniestro actualizado a '${status}' correctamente`,
    });
  } catch (err) {
    console.error("Error al actualizar estado del siniestro:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
