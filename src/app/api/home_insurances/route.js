import { run, get } from "@/lib/db";
import { getUser } from "@/lib/session";

export async function POST(request) {
  try {
    const user = await getUser();
    if (!user)
      return Response.json({ error: "No autorizado" }, { status: 401 });

    const {
      user_policy_id,
      direccion_vivienda,
      tipo_vivienda,
      superficie_m2,
      anio_construccion,
      valor_estimado,
      posee_alarma,
    } = await request.json();

    if (!user_policy_id || !direccion_vivienda || !tipo_vivienda)
      return Response.json(
        { error: "Datos obligatorios faltantes" },
        { status: 400 },
      );

    // Verificar que la user_policy exista
    const userPolicy = await get("SELECT * FROM user_policies WHERE id = ?", [
      user_policy_id,
    ]);
    if (!userPolicy)
      return Response.json(
        { error: "user_policy no encontrada" },
        { status: 404 },
      );

    // Insertar seguro de hogar
    await run(
      `INSERT INTO home_insurances
        (user_policy_id, direccion_vivienda, tipo_vivienda, superficie_m2, anio_construccion, valor_estimado, posee_alarma)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user_policy_id,
        direccion_vivienda,
        tipo_vivienda,
        superficie_m2,
        anio_construccion,
        valor_estimado,
        posee_alarma ? 1 : 0,
      ],
    );

    return Response.json(
      { message: "Seguro de hogar registrado correctamente" },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error registrando seguro de hogar:", err);
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
        "SELECT * FROM home_insurances WHERE user_policy_id = ?",
        [userPolicyId],
      );
      if (!record)
        return Response.json({ exists: false, home_insurance: null });
      return Response.json({ exists: true, home_insurance: record });
    }

    // Si no se pasa user_policy_id → devolver todos
    const all = await query("SELECT * FROM home_insurances");
    return Response.json(all);
  } catch (err) {
    console.error("Error obteniendo home_insurances:", err);
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
      direccion_vivienda,
      tipo_vivienda,
      superficie_m2,
      anio_construccion,
      valor_estimado,
      posee_alarma,
    } = body;

    if (!user_policy_id) {
      return Response.json(
        { error: "Falta el campo user_policy_id" },
        { status: 400 },
      );
    }

    const existing = await get(
      "SELECT * FROM home_insurances WHERE user_policy_id = ?",
      [user_policy_id],
    );
    if (!existing) {
      return Response.json(
        { error: "Registro no encontrado" },
        { status: 404 },
      );
    }

    await run(
      `UPDATE home_insurances
       SET direccion_vivienda = ?, tipo_vivienda = ?, superficie_m2 = ?,
           anio_construccion = ?, valor_estimado = ?, posee_alarma = ?
       WHERE user_policy_id = ?`,
      [
        direccion_vivienda,
        tipo_vivienda,
        superficie_m2,
        anio_construccion,
        valor_estimado,
        posee_alarma ? 1 : 0,
        user_policy_id,
      ],
    );

    return Response.json({
      message: "Datos del seguro de hogar actualizados correctamente.",
    });
  } catch (err) {
    console.error("Error actualizando home_insurance:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
