import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import UsersPageClient from "./usersPageClient";

export default async function UsersPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }
  if (user.rol_id === 2) {
    redirect("/dashboard");
  }

  return <UsersPageClient user={user} />;
}
