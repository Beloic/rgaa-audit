'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors du changement de mot de passe');
      setSuccess('Un email de confirmation a été envoyé. Veuillez cliquer sur le lien pour valider le changement.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg border">
      <h1 className="text-2xl font-bold mb-6">Changer mon mot de passe</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Ancien mot de passe</label>
          <input type="password" className="w-full border rounded-lg px-4 py-2" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Nouveau mot de passe</label>
          <input type="password" className="w-full border rounded-lg px-4 py-2" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Confirmer le nouveau mot de passe</label>
          <input type="password" className="w-full border rounded-lg px-4 py-2" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition" disabled={loading}>
          {loading ? 'Envoi...' : 'Changer mon mot de passe'}
        </button>
      </form>
    </div>
  );
} 