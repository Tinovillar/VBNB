import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import ClaimDetailPage from "./claimDetailPage";

export default async function ClaimDetailPageWrapper() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  return <ClaimDetailPage user={user} />;
}
