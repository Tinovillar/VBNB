import { get, query } from "@/lib/db";
import { getSession } from "@/lib/session";

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
       JOIN user_policies up ON c.user_policy_id = up.policy_id
       JOIN policies p ON up.policy_id = p.id
       ORDER BY c.fecha DESC`,
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
