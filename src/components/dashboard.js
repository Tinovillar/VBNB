"use client";

import { Button } from "@/components/ui/button";
import { User, FileText, CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function AdminDashboard({ user }) {
  const router = useRouter();
  return (
    <>
      <h1 className="text-3xl font-bold mb-1">
        Bienvenido al Panel Administrativo
      </h1>
      <p className="text-gray-600 mb-8">Gestiona todo lo que quieras</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Perfil */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Mi Perfil</CardTitle>
            </div>
            <CardDescription>Administrá tus datos personales</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="w-full"
              onClick={() => router.push(`/dashboard/profile`)}
            >
              Ver Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Pólizas */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Pólizas</CardTitle>
            </div>
            <CardDescription>Administra todas las polizas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="w-full bg-transparent"
              variant="outline"
              onClick={() => router.push(`/dashboard/policies`)}
            >
              Ver Pólizas
            </Button>
          </CardContent>
        </Card>

        {/* Pagos */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Pagos</CardTitle>
            </div>
            <CardDescription>Adminstrar Pagos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              disabled
              className="w-full bg-transparent"
              variant="outline"
            >
              Ver Pagos
            </Button>
          </CardContent>
        </Card>

        {/* Siniestros */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <CardTitle>Siniestros</CardTitle>
            </div>
            <CardDescription>Administra Sinisetros</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/claims">Ver Siniestros</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Usuarios */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Usuarios</CardTitle>
            </div>
            <CardDescription>Administrá Usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/dashboard/users">Ver Usuarios</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function ClientDashboard({ user }) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-1">
        Bienvenido al Panel de Cliente
      </h1>
      <p className="text-gray-600 mb-8">Gestiona todo lo que quieras</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Perfil */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Mi Perfil</CardTitle>
            </div>
            <CardDescription>Administrá tus datos personales</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/profile">Ver Perfil</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pólizas */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Pólizas</CardTitle>
            </div>
            <CardDescription>Administra todas las polizas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-transparent" variant="outline">
              <Link href="/dashboard/policies">Ver Pólizas</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pagos */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Pagos</CardTitle>
            </div>
            <CardDescription>Adminstrar Pagos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              disabled
              className="w-full bg-transparent"
              variant="outline"
            >
              Ver Pagos
            </Button>
          </CardContent>
        </Card>

        {/* Siniestros */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <CardTitle>Siniestros</CardTitle>
            </div>
            <CardDescription>Administra Sinisetros</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/claims">Ver Siniestros</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Usuarios */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Usuarios</CardTitle>
            </div>
            <CardDescription>Administrá Usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/dashboard/profile">Ver Usuarios</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
export function EmployeeDashboard({ user }) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-1">
        Bienvenido al Panel de Empleado
      </h1>
      <p className="text-gray-600 mb-8">Gestiona todo lo que quieras</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Perfil */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Mi Perfil</CardTitle>
            </div>
            <CardDescription>Administrá tus datos personales</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/profile">Ver Perfil</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pólizas */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Pólizas</CardTitle>
            </div>
            <CardDescription>Administra todas las polizas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-transparent" variant="outline">
              <Link href="/dashboard/policies">Ver Pólizas</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pagos */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Pagos</CardTitle>
            </div>
            <CardDescription>Adminstrar Pagos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              disabled
              className="w-full bg-transparent"
              variant="outline"
            >
              Ver Pagos
            </Button>
          </CardContent>
        </Card>

        {/* Siniestros */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <CardTitle>Siniestros</CardTitle>
            </div>
            <CardDescription>Administra Sinisetros</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/claims">Ver Siniestros</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Usuarios */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Usuarios</CardTitle>
            </div>
            <CardDescription>Administrá Usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/dashboard/profile">Ver Usuarios</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
