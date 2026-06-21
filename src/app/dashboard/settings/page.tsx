import SettingsForm from '@/components/Settings/SettingsForm';
import ViewTransitionPage from '@/components/ViewTransitionPage';

export default async function SettingsPage() {
  return (
    <ViewTransitionPage>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <SettingsForm />
      </div>
    </ViewTransitionPage>
  );
}
