"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";

export default function PolicyDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        const res = await fetch(`/api/user_policies/${id}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "No se pudo cargar la póliza");
          router.push("/dashboard/policies");
          return;
        }
        setPolicy(data[0]);
      } catch (err) {
        console.error("Error cargando póliza:", err);
        alert("Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    };

    loadPolicy();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Cargando póliza...
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        No se encontró la póliza.
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header hasLogin={false} logged={true} />
      <div className="flex justify-center p-6 bg-linear-to-b from-white to-gray-100 flex-1">
        <div className="w-full m-auto max-w-2xl bg-white border rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-2">{policy.name}</h2>
          <p className="text-gray-600">{policy.description}</p>
          <h3
            className={
              policy.status === "activa"
                ? "text-green-400 font-bold"
                : policy.status === "cancelada"
                  ? "text-red-400 font-bold"
                  : "text-orange-400 font-bold"
            }
          >
            {policy.status.toUpperCase()}
          </h3>

          <div className="space-y-3 text-gray-700 mt-6">
            <p>
              <span className="font-medium">Categoría:</span> {policy.category}
            </p>
            <p>
              <span className="font-medium">Tipo:</span> {policy.type}
            </p>
            <p>
              <span className="font-medium">Cobertura:</span>{" "}
              {policy.coverage || "—"}
            </p>
            <p>
              <span className="font-medium">Franquicia:</span>{" "}
              {policy.franchise ? `$${policy.franchise}` : "—"}
            </p>
            <p>
              <span className="font-medium">Precio mensual:</span>{" "}
              <span className="text-green-600 font-semibold">
                ${policy.monthly_price}
              </span>
            </p>
            <p>
              <span className="font-medium">Precio anual:</span> $
              {policy.annual_price}
            </p>
          </div>

          <div className="flex justify-end mt-8 gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/policies")}
            >
              Volver
            </Button>
            {policy.status === "activa" && (
              <Button
                onClick={() =>
                  router.push("/dashboard/payments/new?up_id=" + policy.up_id)
                }
                className="bg-black text-white hover:bg-gray-100"
              >
                Generar pago
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
