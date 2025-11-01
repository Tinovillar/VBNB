"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Trash2, Pencil } from "lucide-react";
import { Header } from "@/components/ui/header";

export default function PoliciesPageClient() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch("/api/policies");
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setPolicies(data);
        } else {
          console.error("Error en formato de respuesta", data);
          setPolicies([]);
        }
      } catch (error) {
        console.error("Error al obtener pólizas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que querés eliminar esta póliza?")) return;

    try {
      const res = await fetch(`/api/policies/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPolicies((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar la póliza");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Cargando pólizas...</p>;
  }

  return (
    <>
      <Header hasLogin={false} logged={true} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Administrar Pólizas</h1>
            <p className="text-gray-600">Gestioná las pólizas disponibles</p>
          </div>
          <Button
            className="w-fit"
            variant="default"
            onClick={() => router.push("/dashboard/policies/new")}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Nueva Póliza
          </Button>
        </div>

        {policies.length === 0 ? (
          <p className="text-gray-600">No hay pólizas registradas.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle>{policy.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{policy.category}</CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">
                    {policy.description || "Sin descripción."}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Mensual:</span> $
                    {policy.monthly_price}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Anual:</span> $
                    {policy.annual_price}
                  </p>

                  <div className="flex justify-between items-center mt-4 gap-2">
                    <Button
                      variant=""
                      className="flex-1 hover:bg-green-200 bg-green-300 text-black"
                      onClick={() =>
                        router.push(`/dashboard/policies/${policy.id}/edit`)
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      variant=""
                      className="flex-1 hover:bg-red-200 bg-red-300 text-black"
                      onClick={() => handleDelete(policy.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
