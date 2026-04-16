import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { th } from "@/lib/i18n";

export default async function QRCodePage() {
  const session = await getSession();
  if (!session) return null;

  const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.userId, session.userId)).limit(1);

  if (!restaurant) {
    return <div className="text-sm text-gray-500">สร้างร้านอาหารของคุณก่อนใน{th.restaurant.title}</div>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const publicUrl = `${baseUrl}/menu/${restaurant.slug}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{th.qrCode.title}</h1>
        <p className="text-gray-500">{th.qrCode.description}</p>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <p className="text-sm text-gray-600 mb-4">{th.qrCode.publicMenuUrl} <a href={publicUrl} target="_blank" className="text-orange-600 underline">{publicUrl}</a></p>
        <QRCodeDisplay url={publicUrl} restaurantName={restaurant.name} />
      </div>
    </div>
  );
}
