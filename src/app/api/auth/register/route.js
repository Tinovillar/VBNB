import { run, get } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      nombre,
      apellido,
      email,
      password,
      rol_id = 2, // por defecto, cliente
      tipo_documento,
      numero_documento,
      fecha_nacimiento,
      telefono,
      calle_numero,
      ciudad,
      provincia,
      codigo_postal,
    } = data;

    // Validar campos obligatorios
    if (
      !nombre ||
      !apellido ||
      !email ||
      !password ||
      !tipo_documento ||
      !numero_documento ||
      !fecha_nacimiento ||
      !telefono ||
      !calle_numero ||
      !ciudad ||
      !provincia ||
      !codigo_postal
    ) {
      return Response.json(
        { error: "Todos los campos obligatorios deben completarse" },
        { status: 400 },
      );
    }

    // Verificar si ya existe un usuario con ese email
    const existing = await get("SELECT id FROM users WHERE email = ?", [email]);
    if (existing) {
      return Response.json(
        { error: "Ya existe un usuario con ese email" },
        { status: 400 },
      );
    }

    // Insertar usuario nuevo
    await run(
      `INSERT INTO users (
         nombre, apellido, email, password, rol_id,
         tipo_documento, numero_documento, fecha_nacimiento,
         telefono, calle_numero, ciudad, provincia, codigo_postal
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        apellido,
        email,
        password,
        rol_id,
        tipo_documento,
        numero_documento,
        fecha_nacimiento,
        telefono,
        calle_numero,
        ciudad,
        provincia,
        codigo_postal,
      ],
    );

    let user = await get("SELECT * FROM users WHERE email = ?", [email]);

    await createSession(user.id);

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
