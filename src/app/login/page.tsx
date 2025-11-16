import { redirect } from 'next/navigation';
import { AuthProvider } from '@/contexts';
import { getCurrentUser } from '@/utils/server-auth';
import LoginPageShell from '@/components/Auth/LoginPageShell';

export default async function LoginPage() {
  const result = await getCurrentUser();

  // If the user already has a valid session (cookies), redirect from the server
  if (result?.user && result.tokens) {
    redirect('/');
  }

  // No valid session: render the client-side login experience
  return (
    <AuthProvider initialUser={null} initialTokens={null}>
      <LoginPageShell />
    </AuthProvider>
  );
}
