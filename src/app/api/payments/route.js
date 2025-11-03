import { get, run, query } from "@/lib/db";
import { getUser } from "@/lib/session";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    // Si el usuario es cliente, solo ve sus propios pagos
    const isCliente = user.rol_id === 2;

    const sql = `
      SELECT
        payments.id,
        users.nombre AS user_nombre,
        users.apellido AS user_apellido,
        policies.name AS policy_nombre,
        user_policies.payment_frequency AS modalidad,
        payments.method,
        payments.amount,
        payments.payment_date
      FROM payments
      JOIN user_policies ON payments.user_policy_id = user_policies.id
      JOIN users ON user_policies.user_id = users.id
      JOIN policies ON user_policies.policy_id = policies.id
      ${isCliente ? "WHERE users.id = ?" : ""}
      ORDER BY payments.payment_date DESC
    `;

    const params = isCliente ? [user.id] : [];
    const pagos = await query(sql, params);

    return Response.json(pagos);
  } catch (err) {
    console.error("Error al obtener los pagos:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const { up_id, modalidad, metodo_pago } = await request.json();

    if (!up_id || !modalidad || !metodo_pago) {
      return Response.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 },
      );
    }

    // Obtener datos de la póliza contratada
    const policy = await get(
      `SELECT up.id, p.name, p.monthly_price, p.annual_price, u.nombre AS usuario
       FROM user_policies up
       JOIN policies p ON up.policy_id = p.id
       JOIN users u ON up.user_id = u.id
       WHERE up.id = ?`,
      [up_id],
    );

    if (!policy) {
      return Response.json({ error: "Póliza no encontrada" }, { status: 404 });
    }

    // Calcular monto según modalidad
    let monto = 0;
    if (modalidad === "mensual") monto = policy.monthly_price;
    else if (modalidad === "trimestral") monto = policy.monthly_price * 3;
    else if (modalidad === "anual") monto = policy.annual_price;

    // Guardar pago en la base de datos
    const insertResult = await run(
      `INSERT INTO payments (user_policy_id, amount, method, status)
       VALUES (?, ?, ?, 'pagado')`,
      [up_id, monto, metodo_pago],
    );

    const pagoId = insertResult.lastID;

    // Crear PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 500]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();

    page.drawText("ORDEN DE PAGO", {
      x: 200,
      y: height - 50,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });

    const text = [
      `Número de Pago: ${pagoId}`,
      `Cliente: ${policy.usuario}`,
      `Póliza: ${policy.name.toUpperCase()}`,
      `Modalidad: ${modalidad.toUpperCase()}`,
      `Método de Pago: ${metodo_pago.toUpperCase()}`,
      `Monto: $${monto}`,
      `Fecha: ${new Date().toLocaleDateString()}`,
    ];

    text.forEach((line, i) => {
      page.drawText(line, {
        x: 50,
        y: height - 100 - i * 25,
        size: 12,
        font,
      });
    });

    // ✅ Si el método de pago es QR, generar y dibujar el código en el PDF
    if (metodo_pago.toLowerCase() === "qr") {
      // Convertir el contenido a base64 (puede ser datos del método de pago, URL, etc.)
      const qrDataURL = await QRCode.toDataURL(
        `Pago ID: ${pagoId}\nMonto: $${monto}\nUsuario: ${policy.usuario}\nPóliza: ${policy.name}`,
        { margin: 1, width: 200 },
      );

      // Insertar imagen del QR
      const qrImageBytes = Uint8Array.from(atob(qrDataURL.split(",")[1]), (c) =>
        c.charCodeAt(0),
      );
      const qrImage = await pdfDoc.embedPng(qrImageBytes);
      const qrDims = qrImage.scale(0.5);

      page.drawImage(qrImage, {
        x: width - 250,
        y: height - 300,
        width: qrDims.width,
        height: qrDims.height,
      });

      page.drawText("Escaneá este QR para realizar el pago", {
        x: width - 250,
        y: height - 310,
        size: 10,
        font,
      });
    }

    const pdfBytes = await pdfDoc.save();

    // Devolver PDF como archivo descargable
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="orden_pago_${pagoId}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Error generando orden de pago:", err);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
