"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createSession } from "@/lib/session";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    tipoDocumento: "DNI",
    numeroDocumento: "",
    fechaNacimiento: "",
    telefono: "",
    calle: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al registrarse");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header hasLogin={false} logged={false} />
      <div className="flex items-center justify-center p-4 bg-linear-to-b from-white to-gray-100">
        <div className="w-full max-w-3xl bg-white border rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-1">Crear Cuenta</h2>
          <p className="text-sm text-gray-600 mb-6">
            Completá tus datos para registrarte en la plataforma
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos de acceso */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Datos de Acceso</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="email"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div />
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="password"
                  >
                    Contraseña *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="confirmPassword"
                  >
                    Confirmar Contraseña *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
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
                    value={formData.nombre}
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
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tipo de Documento *
                  </label>
                  <select
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
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
                    name="numeroDocumento"
                    required
                    value={formData.numeroDocumento}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    name="fechaNacimiento"
                    type="date"
                    required
                    value={formData.fechaNacimiento}
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
                    placeholder="+54 9 11 1234-5678"
                    required
                    value={formData.telefono}
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
                    name="calle"
                    placeholder="Av. Corrientes 1234"
                    required
                    value={formData.calle}
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
                    value={formData.ciudad}
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
                    value={formData.provincia}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Código Postal *
                  </label>
                  <input
                    name="codigoPostal"
                    required
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Botón */}
            <Button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition"
            >
              Crear Cuenta
            </Button>

            <div className="text-center text-sm">
              ¿Ya tenés cuenta?{" "}
              <Link
                href="/auth/login"
                className="underline hover:text-blue-600"
              >
                Iniciar Sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
