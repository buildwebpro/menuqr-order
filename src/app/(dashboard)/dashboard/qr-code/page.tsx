import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";

export default async function QRCodePage() {
  const session = await getSession();
  if (!session) return null;

  const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.userId, session.userId)).limit(1);

  if (!restaurant) {
    return <div className="text-sm text-gray-500">Create your restaurant first in Restaurant Settings.</div>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const publicUrl = `${baseUrl}/menu/${restaurant.slug}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">QR Code</h1>
        <p className="text-gray-500">Share this QR code with your customers.</p>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <p className="text-sm text-gray-600 mb-4">Public menu URL: <a href={publicUrl} target="_blank" className="text-orange-600 underline">{publicUrl}</a></p>
        <QRCodeDisplay url={publicUrl} restaurantName={restaurant.name} />
      </div>
    </div>
  );
}
