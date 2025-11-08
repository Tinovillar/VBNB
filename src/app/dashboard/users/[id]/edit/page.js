"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/ui/header";
import { UserForm } from "@/components/userForm";
import { Button } from "@/components/ui/button";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    tipo_documento: "DNI",
    numero_documento: "",
    fecha_nacimiento: "",
    telefono: "",
    calle_numero: "",
    ciudad: "",
    provincia: "",
    codigo_postal: "",
    rol_id: 2,
  });

  // Cargar datos del usuario existente
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "No se pudo cargar el usuario");
          router.push("/dashboard/users");
          return;
        }

        const user = data.user;
        setForm({
          email: user.email || "",
          password: "",
          confirmPassword: "",
          nombre: user.nombre || "",
          apellido: user.apellido || "",
          tipo_documento: user.tipo_documento || "DNI",
          numero_documento: user.numero_documento || "",
          fecha_nacimiento: user.fecha_nacimiento || "",
          telefono: user.telefono || "",
          calle_numero: user.calle_numero || "",
          ciudad: user.ciudad || "",
          provincia: user.provincia || "",
          codigo_postal: user.codigo_postal || "",
          rol_id: user.rol_id || 2,
        });
      } catch (err) {
        console.error(err);
        alert("Error de conexión con el servidor");
        router.push("/dashboard/users");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          confirmPassword: undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al actualizar usuario");
        return;
      }

      alert("Usuario actualizado correctamente");
      router.push("/dashboard/users");
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Cargando usuario...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header hasLogin={false} logged={true} />

      <div className="flex items-center justify-center p-4 bg-linear-to-b from-white to-gray-100 flex-1">
        <div className="w-full max-w-3xl bg-white border rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-1">Editar Usuario</h2>
          <p className="text-sm text-gray-600 mb-6">
            Modificá los datos del usuario
          </p>

          <UserForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isEdit={true}
            showRole={false}
          />

          {/* Botones de navegación adicionales */}
          <div className="flex justify-between gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => router.push("/dashboard/users")}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
