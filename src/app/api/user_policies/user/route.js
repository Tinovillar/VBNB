export async function GET() {
  const userId = await getSession();
  if (!userId) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  let policies = await query(
    "select * from user_policies LEFT JOIN policies WHERE user_policies.user_id=? AND user_policies.policy_id=policies.id",
    [userId],
  );
  return Response.json(policies);
}
