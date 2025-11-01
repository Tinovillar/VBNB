"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Error al iniciar sesión");
        return;
      }

      const data = await res.json();
      router.push(data.redirectTo || "/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        {/* Logo y Título */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield className="h-8 w-8 text-black" />
          <h1 className="text-2xl font-bold">
            <Link href="/">VBNB Seguros</Link>
          </h1>
        </div>

        {/* Tarjeta del formulario */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-1">Iniciar Sesión</h2>
          <p className="text-sm text-gray-600 mb-6">
            Ingresá tu email y contraseña para acceder
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          {/* Enlaces inferiores */}
          <div className="text-center text-sm mt-4">
            ¿No tenés cuenta?{" "}
            <Link
              href="/auth/sign-up"
              className="underline hover:text-blue-600"
            >
              Registrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
