import { NextRequest, NextResponse } from 'next/server';
import { getUserByPasswordChangeToken, updateUserPassword, clearPasswordChangeToken } from '@/src/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ message: 'Token manquant' }, { status: 400 });
    const user = await getUserByPasswordChangeToken(token);
    if (!user || !user.pendingNewPassword) return NextResponse.json({ message: 'Lien invalide ou expiré' }, { status: 400 });
    await updateUserPassword(user.email, user.pendingNewPassword);
    await clearPasswordChangeToken(user.email);
    return NextResponse.json({ message: 'Mot de passe modifié avec succès' });
  } catch (e) {
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
} 