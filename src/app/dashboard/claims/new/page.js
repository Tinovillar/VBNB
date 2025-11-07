"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";

export default function NewClaimPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({
    user_policy_id: "",
    description: "",
  });

  useEffect(() => {
    const loadUserPolicies = async () => {
      try {
        const res = await fetch("/api/user_policies");
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setPolicies(data);
        } else {
          console.error("Error al obtener pólizas:", data);
        }
      } catch (err) {
        console.error("Error de conexión:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserPolicies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.user_policy_id || !form.description.trim()) {
      alert("Debe seleccionar una póliza y describir el siniestro.");
      return;
    }

    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al reportar el siniestro");
        return;
      }

      alert("Siniestro reportado correctamente");
      router.push("/dashboard/claims");
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Cargando pólizas...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header hasLogin={false} logged={true} />

      <div className="flex items-center justify-center p-6 bg-linear-to-b from-white to-gray-100 flex-1">
        <div className="w-full max-w-2xl bg-white border rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-2">Reportar Siniestro</h2>
          <p className="text-sm text-gray-600 mb-6">
            Ingresá los datos del siniestro para registrar el reclamo.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Póliza asociada */}
            <section>
              <label className="block text-sm font-medium mb-2">
                Seleccioná una póliza *
              </label>
              <select
                name="user_policy_id"
                value={form.user_policy_id}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- Seleccioná tu póliza --</option>
                {policies.map((p) => (
                  <option key={policies.indexOf(p)} value={p.up_id}>
                    {p.name || p.nombre} — {p.policy_type || p.type}
                  </option>
                ))}
              </select>
            </section>

            {/* Descripción del siniestro */}
            <section>
              <label className="block text-sm font-medium mb-2">
                Descripción del siniestro *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Ejemplo: Choque en la parte trasera del vehículo, leve daño en el paragolpes..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </section>

            {/* Botones */}
            <div className="flex justify-between gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => router.push("/dashboard/claims")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-black text-white hover:bg-gray-800"
              >
                Reportar Siniestro
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
