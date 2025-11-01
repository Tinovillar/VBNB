"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";

export default function NewUserPage() {
  const router = useRouter();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || form.password !== form.confirmPassword) {
      alert("Las contraseñas son obligatorias y deben coincidir");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          confirmPassword: undefined, // no se envía al backend
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al crear usuario");
        return;
      }

      alert("Usuario creado correctamente");
      router.push("/dashboard/users");
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header hasLogin={false} logged={true} />

      <div className="flex items-center justify-center p-4 bg-linear-to-b from-white to-gray-100 flex-1">
        <div className="w-full max-w-3xl bg-white border rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-1">Nuevo Usuario</h2>
          <p className="text-sm text-gray-600 mb-6">
            Completá los datos para registrar un nuevo usuario
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
                    Contraseña *
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Ingresá una contraseña"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirmar Contraseña *
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
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
                Crear Usuario
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
