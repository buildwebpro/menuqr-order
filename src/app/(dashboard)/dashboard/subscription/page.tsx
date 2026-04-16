import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { userSubscriptions, subscriptionPlans } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { th } from "@/lib/i18n";

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
        <h1 className="text-2xl font-bold text-gray-900">{th.subscription.title}</h1>
        <p className="text-gray-500">ส่วนการชำระเงินถูกเลียนแบบสำหรับ MVP การจำกัดแผนใช้งานอยู่</p>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{th.subscription.currentPlan}</p>
            <h2 className="text-xl font-semibold text-gray-900">{plan?.name ?? th.subscription.free}</h2>
          </div>
          <Badge variant={plan?.id === "pro" ? "success" : "default"}>{plan?.id === "pro" ? th.subscription.pro : th.subscription.free}</Badge>
        </div>

        <ul className="text-sm text-gray-600 space-y-1">
          <li>{th.subscription.menuItems}: {plan?.maxMenuItems == null ? th.general.unlimited : `สูงสุด ${plan.maxMenuItems}`}</li>
          <li>{th.subscription.maxRestaurants}: {plan?.maxRestaurants ?? 1}</li>
          <li>{th.subscription.removeBranding}: {plan?.removeBranding ? "ใช่" : "ไม่"}</li>
          <li>{th.subscription.customTheme}: {plan?.customTheme ? "ใช่" : "ไม่"}</li>
        </ul>

        <div className="pt-2">
          <Button variant="primary">{th.subscription.upgradeMock}</Button>
        </div>
      </div>
    </div>
  );
}
