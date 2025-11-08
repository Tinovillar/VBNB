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
import {
  FileText,
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  Cross,
  CrossIcon,
  Crosshair,
  Croissant,
  X,
  Check,
} from "lucide-react";
import { Header } from "@/components/ui/header";

export default function PoliciesPageClient({ user }) {
  const [data, setData] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [myPolicies, setMyPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserPolicies = async () => {
      try {
        const res = await fetch("/api/user_policies/empleado");
        const result = await res.json();

        if (res.ok && Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Error en formato de respuesta", result);
          setData([]);
        }
      } catch (error) {
        console.error("Error al obtener usuarios y pólizas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPolicies();
  }, []);

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

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        let res, data;

        res = await fetch("/api/user_policies/user");

        data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setMyPolicies(data);
        } else {
          console.error("Error en formato de respuesta", data);
          setMyPolicies([]);
        }
      } catch (error) {
        console.error("Error al obtener pólizas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, [user]);

  const handleUpdatePoliza = async (userPolicyId, status) => {
    if (!confirm("¿Deseás activar esta póliza?")) return;

    try {
      const res = await fetch("/api/user_policies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userPolicyId,
          status: status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "No se pudo actualizar el estado");
        return;
      }

      alert(data.message || "Póliza" + status + "correctamente");
      window.location.reload(); // o router.refresh() si estás usando App Router
    } catch (err) {
      console.error("Error al actualizar la póliza:", err);
      alert("Error de conexión con el servidor");
    }
  };

  const handleContratarPoliza = async (policyId) => {
    if (!confirm("¿Deseás contratar esta póliza?")) return;

    try {
      const res = await fetch("/api/user_policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policy_id: policyId,
          payment_frequency: "mensual", // o podrías pedirlo en un select
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "No se pudo contratar la póliza");
        return;
      }

      window.location.reload();
    } catch (err) {
      console.error("Error al contratar la póliza:", err);
      alert("Error de conexión con el servidor");
    }
  };

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
          {user.rol_id !== 2 && (
            <Button
              className="w-fit"
              variant="default"
              onClick={() => router.push("/dashboard/policies/new")}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Nueva Póliza
            </Button>
          )}
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

                  {user.rol_id !== 2 ? (
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
                  ) : (
                    <div className="flex justify-between items-center mt-4 gap-2">
                      <Button
                        variant=""
                        className="flex-1 hover:bg-green-200 bg-green-300 text-black"
                        onClick={() => handleContratarPoliza(policy.id)}
                        // onClick={() =>
                        //   router.push(
                        //     `/dashboard/policies/${policy.id}/purchase`,
                        //   )
                        // }
                      >
                        Contratar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {user.rol_id === 2 && (
          <>
            <hr className="my-8 border border-gray-300" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-1">
                    Pólizas Contratadas
                  </h1>
                  <p className="text-gray-600">
                    Gestioná tus pólizas disponibles
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        {user.rol_id === 2 &&
          (myPolicies.length === 0 ? (
            <p className="text-gray-600">No hay pólizas registradas.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPolicies.map((policy, i) => (
                <Card key={policy.up_id * policy.id * i}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <CardTitle>{policy.name}</CardTitle>
                        <CardDescription
                          className={`font-bold ${
                            policy.status === "activa"
                              ? "text-green-400"
                              : policy.status === "cancelada"
                                ? "text-red-500"
                                : "text-orange-300"
                          }`}
                        >
                          {policy.status.toUpperCase()}
                        </CardDescription>
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
                        className="flex-1 hover:bg-blue-300 bg-blue-400 text-black"
                        onClick={() =>
                          router.push(`/dashboard/policies/${policy.up_id}`)
                        }
                      >
                        Ver Póliza
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        {user.rol_id !== 2 && (
          <>
            <hr className="my-10 border border-gray-300" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-1">
                    Pólizas de Clientes
                  </h1>
                  <p className="text-gray-600">Gestioná sus pólizas</p>
                </div>
              </div>
            </div>
          </>
        )}
        {user.rol_id !== 2 &&
          (data.length === 0 ? (
            <>
              <p className="text-gray-600">No hay pólizas contratadas.</p>
            </>
          ) : (
            <>
              <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm mb-10">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        Póliza
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        Cobertura
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        Precio Mensual
                      </th>
                      <th className="px-6 py-3 text-right font-semibold text-gray-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {data.map((row) => (
                      <tr key={data.indexOf(row)} className="hover:bg-gray-50">
                        <td
                          className={`px-6 py-3 text-gray-700 font-bold ${
                            row.status === "activa"
                              ? "text-green-400"
                              : row.status === "cancelada"
                                ? "text-red-500"
                                : "text-orange-400"
                          }`}
                        >
                          {row.status.toUpperCase()}
                        </td>
                        <td className="px-6 py-3">
                          {row.nombre} {row.apellido}
                        </td>
                        <td className="px-6 py-3 text-gray-600">{row.email}</td>
                        <td className="px-6 py-3 text-gray-700">
                          {row.policy_nombre}
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          {row.policy_type || "Básica"}
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          {row.policy_cobertura || "—"}
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          ${row.policy_precio_mensual}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            onClick={() =>
                              router.push(`/dashboard/policies/${row.up_id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            onClick={() =>
                              handleUpdatePoliza(row.up_id, "activa")
                            }
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            onClick={() =>
                              handleUpdatePoliza(row.up_id, "cancelada")
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ))}
      </div>
    </>
  );
}
