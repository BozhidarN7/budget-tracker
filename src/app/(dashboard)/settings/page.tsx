import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/auth';
import SettingsForm from '@/components/Settings/SettingsForm';

export default async function SettingsPage() {
  const result = await getCurrentUser();

  if (!result) {
    redirect('/login');
  }

  // const { user, tokens } = result;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <SettingsForm />
    </div>
  );
}
