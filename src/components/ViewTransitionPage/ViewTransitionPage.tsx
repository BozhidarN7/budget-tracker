import { PropsWithChildren, ViewTransition } from 'react';

export default function ViewTransitionPage({ children }: PropsWithChildren) {
  return <ViewTransition>{children}</ViewTransition>;
}
