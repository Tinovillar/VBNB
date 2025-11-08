import { query, run, get } from "@/lib/db";
import { getSession, getUser } from "@/lib/session";

export async function GET() {
  const userId = await getSession();
  if (!userId) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  let policies = await query(
    "select up.id AS up_id, * from user_policies up LEFT JOIN policies WHERE up.user_id=? AND up.policy_id=policies.id",
    [userId],
  );
  return Response.json(policies);
}

export async function POST(request) {
  try {
    const userId = await getSession();
    if (!userId) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    const {
      policy_id,
      payment_frequency = "mensual", // por defecto mensual
    } = data;

    if (!policy_id) {
      return Response.json(
        { error: "El ID de la póliza es obligatorio" },
        { status: 400 },
      );
    }

    // Insertar el vínculo entre el usuario y la póliza
    const runReturn = await run(
      `INSERT INTO user_policies (user_id, policy_id, payment_frequency)
       VALUES (?, ?, ?)`,
      [userId, policy_id, payment_frequency],
    );

    return Response.json(
      { id: runReturn.lastID, message: "Póliza contratada correctamente" },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error al contratar póliza:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getUser();
    const { status, id } = await request.json();

    if (!user) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    // Solo empleados o administradores pueden actualizar estados
    if (![1, 3].includes(user.rol_id)) {
      return Response.json(
        { error: "Permisos insuficientes" },
        { status: 403 },
      );
    }

    // Validar que el nuevo estado sea válido
    const estadosValidos = ["pendiente", "activa", "vencida", "cancelada"];
    if (!estadosValidos.includes(status)) {
      return Response.json({ error: "Estado inválido" }, { status: 400 });
    }

    // Verificar que la relación exista
    const existing = await get("SELECT * FROM user_policies WHERE id = ?", [
      id,
    ]);
    if (!existing) {
      return Response.json(
        { error: "Registro no encontrado" },
        { status: 404 },
      );
    }

    const currentStatus = await get(
      "select status from user_policies WHERE id=?",
      id,
    );
    console.log(currentStatus);

    if (currentStatus.status === "pendiente") {
      let hasVehicle = await get(
        "select * from user_policies up JOIN vehicle_insurances v ON v.user_policy_id=up.id WHERE up.id=?",
        id,
      );
      let hasPerson = await get(
        "select * from user_policies up JOIN life_insurances v ON v.user_policy_id=up.id WHERE up.id=?",
        id,
      );
      let hasHome = await get(
        "select * from user_policies up JOIN home_insurances v ON v.user_policy_id=up.id WHERE up.id=?",
        id,
      );
      if (!hasHome && !hasPerson && !hasVehicle)
        return Response.json(
          { error: "No tiene ninguna entidad asegurada, no se puede activar" },
          { status: 404 },
        );
    }
    // Actualizar estado
    await run("UPDATE user_policies SET status = ? WHERE id = ?", [status, id]);

    return Response.json({
      message: `Estado de la póliza actualizado a '${status}' correctamente`,
    });
  } catch (err) {
    console.error("Error al actualizar estado de user_policy:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
