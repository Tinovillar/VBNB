import { getUser } from "@/lib/session";
import { redirect } from "next/navigation";
import PoliciesPageClient from "./policiesPageClient";

export default async function PoliciesPage() {
  const user = await getUser();
  if (!user) {
    redirect("/auth/login");
  }
  return <PoliciesPageClient user={user} />;
}
