"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/ui/header";
import { UserForm } from "@/components/userForm";

export default function ProfilePage() {
  const router = useRouter();
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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/users/me"); // nuevo endpoint
        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Error cargando perfil");
          router.push("/auth/login");
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
        alert("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

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
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          confirmPassword: undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error al actualizar perfil");
        return;
      }

      alert("Perfil actualizado correctamente");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header hasLogin={false} logged={true} />

      <div className="flex items-center justify-center p-4 bg-linear-to-b from-white to-gray-100 flex-1">
        <div className="w-full max-w-3xl bg-white border rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-1">Mi Perfil</h2>
          <p className="text-sm text-gray-600 mb-6">
            Actualizá tus datos personales
          </p>

          <UserForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isEdit={true}
            showRole={false}
          />
        </div>
      </div>
    </div>
  );
}
