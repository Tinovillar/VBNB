import { query, run } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const userId = await getSession();

  if (!userId) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  let policies;
  if (userId === 2) {
    policies = await query("SELECT * FROM policies WHERE id=?", [userId]);
  } else {
    policies = await query("SELECT * FROM policies");
  }
  return Response.json(policies);
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      nombre,
      categoria,
      descripcion = null,
      cobertura = null,
      type = null, // 'Básica' | 'Premium' | 'Elite' (o lo que definas)
      franquicia = null, // número (puede ser null)
      precio_mensual = null,
      precio_anual = null,
    } = data;

    if (!nombre || !categoria) {
      return Response.json(
        { error: "Nombre y categoría son obligatorios" },
        { status: 400 },
      );
    }

    await run(
      `INSERT INTO policies
        (name, category, description, coverage, type, franchise, monthly_price, annual_price)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        categoria,
        descripcion,
        cobertura,
        type,
        franquicia,
        precio_mensual,
        precio_anual,
      ],
    );

    return Response.json(
      { message: "Póliza creada correctamente" },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error al crear póliza:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
