"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/ui/header";
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
          // Eliminamos confirmPassword antes de enviar
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos de acceso */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Datos de Acceso</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div />
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Dejar vacío para mantener la actual"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirmar Contraseña
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Datos personales */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Datos Personales</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre *
                  </label>
                  <input
                    name="nombre"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Apellido *
                  </label>
                  <input
                    name="apellido"
                    required
                    value={form.apellido}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tipo de Documento *
                  </label>
                  <select
                    name="tipo_documento"
                    value={form.tipo_documento}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="DNI">DNI</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="Cédula">Cédula</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Número de Documento *
                  </label>
                  <input
                    name="numero_documento"
                    required
                    value={form.numero_documento}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    name="fecha_nacimiento"
                    type="date"
                    required
                    value={form.fecha_nacimiento}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Teléfono *
                  </label>
                  <input
                    name="telefono"
                    type="tel"
                    required
                    value={form.telefono}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Dirección */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Dirección</h3>
              <div className="grid gap-4 md:grid-cols-1">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Calle y Número *
                  </label>
                  <input
                    name="calle_numero"
                    required
                    value={form.calle_numero}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ciudad *
                  </label>
                  <input
                    name="ciudad"
                    required
                    value={form.ciudad}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Provincia *
                  </label>
                  <input
                    name="provincia"
                    required
                    value={form.provincia}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Código Postal *
                  </label>
                  <input
                    name="codigo_postal"
                    required
                    value={form.codigo_postal}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Rol */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Rol del Usuario</h3>
              <select
                name="rol_id"
                value={form.rol_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value={1}>Administrador</option>
                <option value={2}>Cliente</option>
                <option value={3}>Empleado</option>
              </select>
            </section>

            {/* Botones */}
            <div className="flex justify-between gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => router.push("/dashboard/users")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-black text-white hover:bg-gray-800"
              >
                Guardar Cambios
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
