// app/admin/profile/page.tsx
import { Card } from "antd";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "./ProfileForm";
import { redirect } from "next/navigation";

export default async function AdminProfilePage() {
  // Get signed-in admin
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/admin/login');
  }

  const email = session.user.email;

  // Look up the admin row to load current name
  const admin = await prisma.adminUser.findUnique({
    where: { email },
    select: { id: true, name: true, email: true },
  });

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="max-w-2xl">
      <Card title="Admin Profile" bordered>
        <div className="mb-4 text-sm text-gray-500">
          Signed in as: <span className="font-medium">{admin.email}</span>
        </div>
        {/* Form to update name / password */}
        <ProfileForm adminId={admin.id} defaultName={admin.name ?? ""} />
      </Card>
    </div>
  );
}
