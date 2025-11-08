import { run, get } from "@/lib/db";
import { getUser } from "@/lib/session";

export async function POST(request) {
  try {
    const user = await getUser();
    if (!user)
      return Response.json({ error: "No autorizado" }, { status: 401 });

    const {
      user_policy_id,
      marca,
      modelo,
      anio,
      patente,
      numero_chasis,
      numero_motor,
      uso,
    } = await request.json();

    if (!user_policy_id || !marca || !modelo || !anio || !patente)
      return Response.json(
        { error: "Datos obligatorios faltantes" },
        { status: 400 },
      );

    const userPolicy = await get("SELECT * FROM user_policies WHERE id = ?", [
      user_policy_id,
    ]);
    if (!userPolicy)
      return Response.json(
        { error: "user_policy no encontrada" },
        { status: 404 },
      );

    await run(
      `INSERT INTO vehicle_insurances
        (user_policy_id, marca, modelo, anio, patente, numero_chasis, numero_motor, uso)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_policy_id,
        marca,
        modelo,
        anio,
        patente,
        numero_chasis,
        numero_motor,
        uso,
      ],
    );

    return Response.json(
      { message: "Seguro de vehículo registrado correctamente" },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error registrando seguro de vehículo:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userPolicyId = searchParams.get("user_policy_id");

    if (userPolicyId) {
      const record = await get(
        "SELECT * FROM vehicle_insurances WHERE user_policy_id = ?",
        [userPolicyId],
      );
      if (!record)
        return Response.json({ exists: false, vehicle_insurance: null });
      return Response.json({ exists: true, vehicle_insurance: record });
    }

    const all = await query("SELECT * FROM vehicle_insurances");
    return Response.json(all);
  } catch (err) {
    console.error("Error obteniendo vehicle_insurances:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      user_policy_id,
      marca,
      modelo,
      anio,
      patente,
      numero_chasis,
      numero_motor,
      uso,
    } = body;

    if (!user_policy_id) {
      return Response.json(
        { error: "Falta el campo user_policy_id" },
        { status: 400 },
      );
    }

    const existing = await get(
      "SELECT * FROM vehicle_insurances WHERE user_policy_id = ?",
      [user_policy_id],
    );
    if (!existing) {
      return Response.json(
        { error: "Registro no encontrado" },
        { status: 404 },
      );
    }

    await run(
      `UPDATE vehicle_insurances
       SET marca = ?, modelo = ?, anio = ?, patente = ?,
           numero_chasis = ?, numero_motor = ?, uso = ?
       WHERE user_policy_id = ?`,
      [
        marca,
        modelo,
        anio,
        patente,
        numero_chasis,
        numero_motor,
        uso,
        user_policy_id,
      ],
    );

    return Response.json({
      message: "Datos del seguro vehicular actualizados correctamente.",
    });
  } catch (err) {
    console.error("Error actualizando vehicle_insurance:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
