'use client';

import BetaProtection from '@/components/BetaProtection';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <BetaProtection>
      {children}
    </BetaProtection>
  );
} 