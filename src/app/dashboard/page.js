import { Header } from "@/components/ui/header";
import { getUser } from "@/lib/session";
import { redirect } from "next/navigation";
import {
  AdminDashboard,
  EmployeeDashboard,
  ClientDashboard,
} from "@/components/dashboard";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const isAdmin = user.rol_id === 1;
  const isEmployee = user.rol_id === 3;

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-white to-gray-100">
      <Header hasLogin={false} logged={true} user={user} />

      <main className="flex-1 container mx-auto px-6 py-8">
        <section className="mt-8">
          {isAdmin ? (
            <AdminDashboard user={user} />
          ) : isEmployee ? (
            <EmployeeDashboard user={user} />
          ) : (
            <ClientDashboard user={user} />
          )}
        </section>
      </main>
    </div>
  );
}
