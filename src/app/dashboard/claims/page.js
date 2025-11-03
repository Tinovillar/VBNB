import { getUser } from "@/lib/session";
import SiniestrosPageClient from "./siniestrosPageClient";
import { redirect } from "next/navigation";

export default async function PageSiniestros() {
  const user = await getUser();
  if (!user) {
    redirect("/auth/login");
  }
  return <SiniestrosPageClient user={user} />;
}
