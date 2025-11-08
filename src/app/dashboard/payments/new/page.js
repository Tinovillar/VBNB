"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewPaymentPage() {
  const [userPolicies, setUserPolicies] = useState([]);
  const [form, setForm] = useState({
    up_id: "",
    modalidad: "mensual",
    metodo_pago: "tarjeta",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const presetPolicyId = searchParams.get("up_id");
  console.log(presetPolicyId);

  // Traer pólizas contratadas del usuario
  useEffect(() => {
    const fetchUserPolicies = async () => {
      try {
        const res = await fetch(`/api/user_policies/${presetPolicyId}`);
        const data = await res.json();
        if (res.ok) {
          setUserPolicies(data);
          // Si viene preseleccionada, setear el formulario
          // if (presetPolicyId) {
          //   const match = data.find((p) => p.id === Number(presetPolicyId));
          //   if (match)
          //     setForm((prev) => ({
          //       ...prev,
          //       up_id: presetPolicyId,
          //     }));
          // }
          setForm((prev) => ({
            ...prev,
            up_id: presetPolicyId,
          }));
        }
      } catch (err) {
        console.error("Error al obtener pólizas:", err);
      }
    };
    fetchUserPolicies();
  }, [presetPolicyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeneratePayment = async (e) => {
    e.preventDefault();

    console.log(form);

    if (!form.up_id) {
      alert("Debe seleccionar una póliza");
      return;
    }

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "No se pudo generar el pago");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "orden_pago.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      alert("Orden de pago generada correctamente");
      router.push("/dashboard/payments");
    } catch (err) {
      console.error("Error generando el pago:", err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header hasLogin={false} logged={true} />

      <main className="flex-1 p-6 bg-linear-to-b from-white to-gray-100">
        <div className="max-w-3xl mx-auto bg-white border rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold mb-4">Generar Pago</h1>
          <p className="text-gray-600 mb-6">
            Seleccioná una póliza contratada y configurá tu método de pago.
          </p>

          <form onSubmit={handleGeneratePayment} className="space-y-6">
            {/* Póliza */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Póliza Contratada
              </label>
              <input
                type="text"
                readOnly
                value={
                  userPolicies.length > 0
                    ? `${userPolicies[0].name} — ${userPolicies[0].payment_frequency.toUpperCase()} ($${userPolicies[0].monthly_price})`
                    : "Cargando..."
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Modalidad */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Modalidad de pago *
              </label>
              <select
                name="modalidad"
                value={form.payment_frequency}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="mensual">Mensual</option>
                <option value="trimestral">Trimestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>

            {/* Método */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Método de pago *
              </label>
              <select
                name="metodo_pago"
                value={form.metodo_pago}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="tarjeta">Tarjeta</option>
                <option value="QR">QR</option>
                <option value="efectivo">Efectivo</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-800 px-6 py-2"
              >
                Generar Orden de Pago
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
