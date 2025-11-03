import { get, run } from "@/lib/db";

export async function GET(_request, { params }) {
  try {
    const { id } = await params; // en Next 14/15 params puede ser Promise
    //const policy = await get("SELECT * FROM policies WHERE id = ?", [id]);
    const policy = await get(
      "select * from user_policies LEFT JOIN policies WHERE user_policies.policy_id=?",
      [id],
    );

    if (!policy) {
      return Response.json({ error: "Póliza no encontrada" }, { status: 404 });
    }

    return Response.json({ policy });
  } catch (err) {
    console.error("Error obteniendo póliza:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      nombre,
      categoria,
      descripcion = null,
      cobertura = null,
      type = null,
      franquicia = null,
      precio_mensual = null,
      precio_anual = null,
    } = body;

    if (!nombre || !categoria) {
      return Response.json(
        { error: "Nombre y categoría son obligatorios" },
        { status: 400 },
      );
    }

    const exists = await get("SELECT id FROM policies WHERE id = ?", [id]);
    if (!exists)
      return Response.json({ error: "Póliza no encontrada" }, { status: 404 });

    await run(
      `UPDATE policies
       SET name = ?, category = ?, description = ?, coverage = ?, type = ?, franchise = ?, monthly_price = ?, annual_price = ?
       WHERE id = ?`,
      [
        nombre,
        categoria,
        descripcion,
        cobertura,
        type,
        franquicia,
        precio_mensual,
        precio_anual,
        id,
      ],
    );

    return Response.json({ message: "Póliza actualizada correctamente" });
  } catch (err) {
    console.error("Error actualizando póliza:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    await run("DELETE FROM policies WHERE id = ?", [id]);
    return Response.json({ message: "Póliza eliminada correctamente" });
  } catch (err) {
    console.error("Error eliminando póliza:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
