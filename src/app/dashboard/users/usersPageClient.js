"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { PlusCircle, Trash2, Edit2 } from "lucide-react";
import { getUser } from "@/lib/session";

export default function UsersPageClient() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        console.log(data);

        if (res.ok && Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Error en formato de respuesta", data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que querés eliminar este usuario?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar el usuario");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Cargando usuarios...</p>;
  }

  return (
    <>
      <Header hasLogin={false} logged={true} />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Administrar Usuarios</h1>
            <p className="text-gray-600">Gestioná los usuarios registrados</p>
          </div>
          <Button
            className="w-fit"
            variant="default"
            onClick={() => router.push("/dashboard/users/new")}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        {users.length === 0 ? (
          <p className="text-gray-600">No hay usuarios registrados.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-700">{user.id}</td>
                    <td className="px-6 py-3">
                      {user.nombre} {user.apellido}
                    </td>
                    <td className="px-6 py-3 text-gray-600">{user.email}</td>
                    <td className="px-6 py-3 text-gray-600">
                      {user.rol_nombre || "Cliente"}
                    </td>
                    <td className="px-6 py-3 text-right flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        onClick={() =>
                          router.push(`/dashboard/users/${user.id}/edit`)
                        }
                      >
                        <Edit2 className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(user.id)}
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
