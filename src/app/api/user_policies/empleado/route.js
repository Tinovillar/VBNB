import { query, run } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const result = await query(`
      SELECT
        up.id AS up_id,
        u.id AS user_id,
        u.nombre,
        u.apellido,
        u.email,
        u.rol_id,
        p.id AS policy_id,
        p.name AS policy_nombre,
        p.category AS policy_categoria,
        p.type AS policy_type,
        p.coverage AS policy_cobertura,
        p.monthly_price AS policy_precio_mensual,
        status
      FROM user_policies up
      JOIN users u ON up.user_id = u.id
      JOIN policies p ON up.policy_id = p.id
      WHERE u.rol_id = 2
      ORDER BY u.id ASC
    `);

    return Response.json(result);
  } catch (err) {
    console.error("Error al obtener usuarios y pólizas:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
