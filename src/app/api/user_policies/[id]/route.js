import { query } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(_request, { params }) {
  const userId = await getSession();
  const { id } = await params;
  if (!userId) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  let policies = await query(
    "select user_policies.id AS up_id, * from user_policies LEFT JOIN policies WHERE user_policies.id=? AND user_policies.policy_id=policies.id",
    [id],
  );
  return Response.json(policies);
}
