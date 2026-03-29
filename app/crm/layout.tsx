import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import Sidebar from '@/components/crm/Sidebar';
import Header from '@/components/crm/Header';

export const metadata = {
  title: 'CRM | Dr. Abayevich Dental Clinic',
};

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
