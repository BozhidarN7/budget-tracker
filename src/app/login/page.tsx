import { redirect } from 'next/navigation';
import { AuthProvider } from '@/contexts';
import { getCurrentUser } from '@/server/auth';
import LoginPageShell from '@/components/Auth/LoginPageShell';

export default async function LoginPage() {
  const result = await getCurrentUser();

  // If the user already has a valid session (cookies), redirect from the server
  if (result?.user) {
    redirect('/dashboard');
  }

  // No valid session: render the client-side login experience
  return (
    <AuthProvider initialUser={null}>
      <LoginPageShell />
    </AuthProvider>
  );
}
