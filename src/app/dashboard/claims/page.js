"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { PlusCircle, Trash2, Eye } from "lucide-react";

export default function SiniestrosPageClient() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await fetch("/api/claims");
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setClaims(data);
        } else {
          console.error("Error en formato de respuesta", data);
          setClaims([]);
        }
      } catch (error) {
        console.error("Error al obtener los siniestros:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que querés eliminar este siniestro?")) return;

    try {
      const res = await fetch(`/api/claims/${id}`, { method: "DELETE" });
      if (res.ok) {
        setClaims((prev) => prev.filter((s) => s.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar el siniestro");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Cargando siniestros...</p>;
  }

  return (
    <>
      <Header hasLogin={false} logged={true} />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Mis Siniestros</h1>
            <p className="text-gray-600">
              Reportá y gestioná tus siniestros registrados
            </p>
          </div>
          <Button
            className="w-fit"
            variant="default"
            onClick={() => router.push("/dashboard/claims/new")}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Reportar Siniestro
          </Button>
        </div>

        {claims.length === 0 ? (
          <p className="text-gray-600">
            No hay siniestros reportados hasta el momento.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-700">{claim.id}</td>
                    <td className="px-6 py-3 text-gray-600">{claim.fecha}</td>
                    <td className="px-6 py-3 text-gray-600">
                      {claim.policy_nombre}
                    </td>
                    <td className="px-6 py-3 text-gray-600 max-w-xs">
                      {claim.description}
                    </td>
                    <td
                      className={`px-6 py-3 font-medium ${
                        claim.status === "Pendiente"
                          ? "text-yellow-600"
                          : claim.status === "Aprobado"
                            ? "text-green-600"
                            : "text-red-600"
                      }`}
                    >
                      {claim.status}
                    </td>
                    <td className="px-6 py-3 text-right flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        onClick={() =>
                          router.push(`/dashboard/claims/${claim.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(claim.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
