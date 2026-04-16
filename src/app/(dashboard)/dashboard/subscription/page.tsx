import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { userSubscriptions, subscriptionPlans } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function SubscriptionPage() {
  const session = await getSession();
  if (!session) return null;

  const [sub] = await db
    .select({ plan: subscriptionPlans })
    .from(userSubscriptions)
    .innerJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
    .where(and(eq(userSubscriptions.userId, session.userId), eq(userSubscriptions.status, "active")))
    .limit(1);

  const plan = sub?.plan;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
        <p className="text-gray-500">Billing integration is mocked for MVP. Plan gating is active.</p>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current plan</p>
            <h2 className="text-xl font-semibold text-gray-900">{plan?.name ?? "Free"}</h2>
          </div>
          <Badge variant={plan?.id === "pro" ? "success" : "default"}>{plan?.id === "pro" ? "Pro" : "Free"}</Badge>
        </div>

        <ul className="text-sm text-gray-600 space-y-1">
          <li>Menu items: {plan?.maxMenuItems == null ? "Unlimited" : `Up to ${plan.maxMenuItems}`}</li>
          <li>Restaurants: {plan?.maxRestaurants ?? 1}</li>
          <li>Remove branding: {plan?.removeBranding ? "Yes" : "No"}</li>
          <li>Custom theme color: {plan?.customTheme ? "Yes" : "No"}</li>
        </ul>

        <div className="pt-2">
          <Button variant="primary">Upgrade (Mock)</Button>
        </div>
      </div>
    </div>
  );
}
