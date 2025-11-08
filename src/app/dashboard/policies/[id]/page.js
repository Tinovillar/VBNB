import { getUser } from "@/lib/session";
import PolicyDetailPage from "./policyDetailPage";

export default async function Page() {
  const user = await getUser();
  return <PolicyDetailPage user={user} />;
}
