"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EditPolicyPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
    cobertura: "",
    type: "Básica",
    franquicia: "",
    precio_mensual: "",
    precio_anual: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/policies/${id}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "No se pudo cargar la póliza");
          router.push("/dashboard/policies");
          return;
        }
        setForm({
          nombre: data.policy.name ?? "",
          categoria: data.policy.category ?? "",
          descripcion: data.policy.description ?? "",
          cobertura: data.policy.coverage ?? "",
          type: data.policy.type ?? "Básica",
          franquicia: data.policy.franchise ?? "",
          precio_mensual: data.policy.monthly_price ?? "",
          precio_anual: data.policy.annual_price ?? "",
        });
      } catch (e) {
        console.error(e);
        alert("Error de conexión con el servidor");
        router.push("/dashboard/policies");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      franquicia: form.franquicia === "" ? null : Number(form.franquicia),
      precio_mensual:
        form.precio_mensual === "" ? null : Number(form.precio_mensual),
      precio_anual: form.precio_anual === "" ? null : Number(form.precio_anual),
    };

    try {
      const res = await fetch(`/api/policies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al actualizar la póliza");
        return;
      }

      router.push("/dashboard/policies");
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Cargando póliza...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editar Póliza</CardTitle>
          <CardDescription>
            Modificá los datos y guardá los cambios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Categoría
              </label>
              <input
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Básica">Básica</option>
                <option value="Premium">Premium</option>
                <option value="Elite">Elite</option>
              </select>
            </div>

            {/* Franquicia */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Franquicia
              </label>
              <input
                type="number"
                step="0.01"
                name="franquicia"
                value={form.franquicia}
                onChange={handleChange}
                placeholder="0 si no aplica"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Cobertura */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Cobertura
              </label>
              <textarea
                name="cobertura"
                value={form.cobertura}
                onChange={handleChange}
                placeholder="Detalles de la cobertura"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Precios */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Precio mensual
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="precio_mensual"
                  value={form.precio_mensual}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Precio anual
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="precio_anual"
                  value={form.precio_anual}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
