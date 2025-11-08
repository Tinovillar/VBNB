import { query } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const userId = await getSession();
  // const { up_id } = getParams();
  if (!userId) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  let policies = await query(
    "select up.id AS up_id, * from user_policies AS up LEFT JOIN policies WHERE up.user_id=? AND up.policy_id=policies.id",
    [userId],
  );
  return Response.json(policies);
}
