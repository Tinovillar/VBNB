import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, FileText, Users, CheckCircle } from "lucide-react";

export function Header({
  id,
  hasLogin = true,
  logged = false,
  goBack = false,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-black" />
          <h1 className="text-2xl font-bold">
            <Link href="/">VBNB Seguros</Link>
          </h1>
        </div>
        <div className="flex w-1/2 justify-end space-x-5">
          {hasLogin && (
            <nav className="flex gap-4">
              <Button href="/auth/login" variant="ghost">
                Iniciar Sesión
              </Button>
              <Button href="/auth/sign-up">Registrarse</Button>
            </nav>
          )}
          {logged && (
            <nav className="flex gap-4">
              <Button href="/auth/logout" variant="ghost">
                Cerrar Sesión
              </Button>
            </nav>
          )}
          {goBack && (
            <nav className="flex gap-4">
              <Button href="/dashboard">Dashboard</Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
