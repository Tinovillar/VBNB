import { get, run, query } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(req, { params }) {
  try {
    const userId = await getSession();
    if (!userId) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Traer el siniestro con su póliza asociada
    const [claim] = await query(
      `SELECT c.id, c.description, c.status, c.fecha,
              p.id AS policy_id, p.name AS policy_nombre,
              p.category AS policy_categoria, p.type AS policy_type,
              p.coverage AS policy_cobertura, p.franchise AS policy_franquicia
       FROM claims c
       JOIN user_policies up ON c.user_policy_id = up.id
       JOIN policies p ON up.policy_id = p.id
       WHERE c.id = ? AND up.user_id = ?`,
      [id, userId],
    );

    if (!claim)
      return Response.json(
        { error: "Siniestro no encontrado" },
        { status: 404 },
      );

    return Response.json({ claim });
  } catch (err) {
    console.error("Error al obtener siniestro:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const userId = await getSession();
    if (!userId) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    console.log(id, userId);

    // Verificar que el siniestro pertenezca al usuario
    const [claim] = await query(
      `SELECT c.id
       FROM claims c
       JOIN user_policies up ON c.user_policy_id = up.id
       WHERE c.id = ? AND up.user_id = ?`,
      [id, userId],
    );

    if (!claim) {
      return Response.json(
        { error: "No tenés permiso para eliminar este siniestro" },
        { status: 403 },
      );
    }

    await run(`DELETE FROM claims WHERE id = ?`, [id]);

    return Response.json({ message: "Siniestro eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar siniestro:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
