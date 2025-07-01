'use client';
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ConfirmPasswordChangePage() {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Lien de confirmation invalide.');
      return;
    }
    fetch('/api/auth/confirm-password-change', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage('Votre mot de passe a bien été modifié. Vous pouvez maintenant vous reconnecter.');
          setTimeout(() => router.push('/'), 4000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Erreur lors de la confirmation.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Erreur de connexion au serveur.');
      });
  }, [token, router]);

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-lg border text-center">
      <h1 className="text-2xl font-bold mb-6">Confirmation du changement de mot de passe</h1>
      {status === 'pending' && <div>Validation en cours...</div>}
      {status === 'success' && <div className="text-green-600 font-semibold">{message}</div>}
      {status === 'error' && <div className="text-red-600 font-semibold">{message}</div>}
    </div>
  );
} 