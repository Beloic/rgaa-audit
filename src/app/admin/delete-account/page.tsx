'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function DeleteAccountPage() {
  const { deleteUserByEmail } = useAuth();
  const [message, setMessage] = useState('');
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    // Exécuter automatiquement la suppression au chargement de la page
    const targetEmail = 'be.loic23@gmail.com';
    
    try {
      const result = deleteUserByEmail(targetEmail);
      if (result) {
        setMessage(`✅ Compte supprimé avec succès: ${targetEmail}`);
        setDeleted(true);
      } else {
        setMessage(`❌ Compte non trouvé: ${targetEmail}`);
      }
    } catch (error) {
      setMessage(`❌ Erreur lors de la suppression: ${error}`);
    }
  }, [deleteUserByEmail]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Suppression de compte
        </h1>
        
        <div className={`p-4 rounded-lg ${deleted ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-sm ${deleted ? 'text-green-800' : 'text-red-800'}`}>
            {message}
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
} 