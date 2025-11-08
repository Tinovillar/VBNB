"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { FileDown, RefreshCcw } from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/payments");
      const data = await res.json();
      console.log(data);

      if (res.ok && Array.isArray(data)) {
        setPayments(data);
      } else {
        console.error("Error en formato de respuesta:", data);
        setPayments([]);
      }
    } catch (error) {
      console.error("Error al obtener los pagos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDownload = async (id) => {
    try {
      const res = await fetch(`/api/payments/${id}`);
      if (!res.ok) {
        alert("No se pudo descargar el PDF");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orden_pago_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar PDF:", err);
      alert("Error al descargar la orden de pago");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Cargando pagos...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header hasLogin={false} logged={true} />

      <main className="p-6 flex-1 bg-linear-to-b from-white to-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Pagos Realizados</h1>
            <p className="text-gray-600">
              Consultá las órdenes de pago generadas por los usuarios.
            </p>
          </div>
          <Button
            className="flex items-center gap-2"
            variant="outline"
            onClick={fetchPayments}
          >
            <RefreshCcw className="w-4 h-4" />
            Actualizar
          </Button>
        </div>

        {payments.length === 0 ? (
          <p className="text-gray-600">No hay pagos registrados aún.</p>
        ) : (
          <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Póliza
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Modalidad
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Método de Pago
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {payments.map((pago) => (
                  <tr key={pago.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-700">{pago.id}</td>
                    <td className="px-6 py-3 text-gray-700">
                      {pago.nombre} {pago.apellido}
                    </td>
                    <td className="px-6 py-3 text-gray-700">{pago.name}</td>
                    <td className="px-6 py-3 text-gray-700">
                      ${pago.amount || "-"}
                    </td>
                    <td className="px-6 py-3 text-gray-700 capitalize">
                      {pago.payment_frequency}
                    </td>
                    <td className="px-6 py-3 text-gray-700 capitalize">
                      {pago.method}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {pago.payment_date}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {pago.status.toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
