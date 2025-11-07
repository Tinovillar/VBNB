"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";

export default function ClaimDetailPage({ user }) {
  const { id } = useParams();
  const router = useRouter();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClaim = async () => {
      try {
        const res = await fetch(`/api/claims/${id}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "No se pudo cargar el siniestro");
          router.push("/dashboard/claims");
          return;
        }
        setClaim(data.claim);
      } catch (err) {
        console.error("Error cargando siniestro:", err);
        alert("Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    };

    loadClaim();
  }, [id, router]);

  const handleUpdateClaim = async (claimId, newStatus) => {
    if (!confirm(`¿Deseás cambiar el estado del siniestro a "${newStatus}"?`))
      return;

    try {
      const res = await fetch("/api/claims", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: claimId,
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "No se pudo actualizar el siniestro");
        return;
      }

      alert(data.message || "Siniestro actualizado correctamente");
      window.location.reload();
    } catch (err) {
      console.error("Error al actualizar siniestro:", err);
      alert("Error de conexión con el servidor");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Cargando siniestro...
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        No se encontró el siniestro.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header hasLogin={false} logged={true} />

      <div className="flex items-center justify-center flex-1 p-6 bg-linear-to-b from-white to-gray-100">
        <div className="w-full max-w-3xl bg-white border rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Detalle del Siniestro #{claim.id}
          </h2>

          {/* Datos del siniestro */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Información del siniestro
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Fecha de reporte:</span>{" "}
                {claim.fecha}
              </p>
              <p>
                <span className="font-medium">Estado:</span>{" "}
                <span
                  className={`font-semibold ${
                    claim.status === "en revisión"
                      ? "text-yellow-600"
                      : claim.status === "cerrado"
                        ? "text-green-600"
                        : "text-red-600"
                  }`}
                >
                  {claim.status.toUpperCase()}
                </span>
              </p>
              <p>
                <span className="font-medium">Descripción:</span>{" "}
                {claim.description}
              </p>
            </div>
          </section>

          <hr className="my-6 border-gray-300" />

          {/* Datos de la póliza */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Póliza asociada
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Nombre:</span>{" "}
                {claim.policy_nombre}
              </p>
              <p>
                <span className="font-medium">Categoría:</span>{" "}
                {claim.policy_categoria}
              </p>
              <p>
                <span className="font-medium">Tipo:</span>{" "}
                {claim.policy_type || "—"}
              </p>
              <p>
                <span className="font-medium">Cobertura:</span>{" "}
                {claim.policy_cobertura || "—"}
              </p>
              <p>
                <span className="font-medium">Franquicia:</span>{" "}
                {claim.policy_franquicia ? `$${claim.policy_franquicia}` : "—"}
              </p>
            </div>
          </section>

          <div className="flex justify-around mt-8">
            <Button
              variant="secondary"
              onClick={() => router.push("/dashboard/claims")}
            >
              Volver
            </Button>
            {user.rol_id !== 2 &&
              (claim.status === "reportado" ? (
                <Button
                  variant="secondary"
                  onClick={() => handleUpdateClaim(claim.id, "en revisión")}
                >
                  Mandar a revisión
                </Button>
              ) : claim.status === "cerrado" ? (
                <></>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => handleUpdateClaim(claim.id, "cerrado")}
                >
                  Cerrar Siniestro
                </Button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
