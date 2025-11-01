import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FileText, CheckCircle, Users } from "lucide-react";
import { Header } from "@/components/ui/header";
import { getUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 text-balance">
          Protegé lo que más importa
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Seguros personalizados para vehículos, inmuebles y personas. Gestión
          simple, rápida y segura.
        </p>
        <div className="flex gap-4 justify-center">
          <Button href="/auth/sign-up" size="lg">
            Comenzar Ahora
          </Button>
          <Button href="#features" asChild variant="ghost" size="lg">
            Conocer Más
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">
          ¿Por qué elegir VBNB?
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <Card className="p-6 border rounded-lg bg-white">
            <CardHeader>
              <FileText className="h-12 w-12 mb-4" />
              <CardTitle className="text-xl font-semibold mb-2">
                Gestión Simple
              </CardTitle>
              <CardDescription>
                Administrá tus pólizas, pagos y siniestros desde un solo lugar.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Card 2 */}
          <Card className="p-6 border rounded-lg bg-white">
            <CardHeader>
              <CheckCircle className="h-12 w-12 mb-4" />
              <CardTitle className="text-xl font-semibold mb-2">
                Proceso Rápido
              </CardTitle>
              <CardDescription>
                Registrate en minutos y accedé a tu cuenta inmediatamente.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Card 3 */}
          <Card className="p-6 border rounded-lg bg-white">
            <CardHeader>
              <Users className="h-12 w-12 mb-4" />
              <CardTitle className="text-xl font-semibold mb-2">
                Atención Personalizada
              </CardTitle>
              <CardDescription>
                Nuestro equipo está disponible para ayudarte cuando lo
                necesites.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 VBNB Seguros. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
