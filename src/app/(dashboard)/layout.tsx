import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/signin");

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar
        userName={session.name}
        userEmail={session.email}
      />
      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
