import { getUser } from "@/lib/session";
import SiniestrosPageClient from "./siniestrosPageClient";

export default function PageSiniestros() {
  const user = getUser();
  if (!user) {
    redirect("/auth/login");
  }
  return <SiniestrosPageClient user={user} />;
}
