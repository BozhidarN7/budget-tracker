import type React from 'react';

interface ProtectedAppLayoutProps {
  children: React.ReactNode;
}

/**
 * ProtectedAppLayout
 *
 * Client-side shell used by protected pages:
 * - Accepts user from server (null if tokens expired)
 * - AuthProvider will handle token refresh if needed
 * - Renders the main app chrome (sidebar, header, layout)
 */
export default function ProtectedAppLayout({
  children,
}: ProtectedAppLayoutProps) {
  return <main className="container mx-auto p-4 md:p-6">{children}</main>;
}
