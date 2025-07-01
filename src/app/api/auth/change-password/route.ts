import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, updateUserPassword, setPasswordChangeToken } from '@/src/lib/auth';
import { sendPasswordChangeEmail } from '@/src/lib/email';
import { getSessionUser } from '@/src/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { oldPassword, newPassword } = await req.json();
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    const dbUser = await getUserByEmail(user.email);
    if (!dbUser) return NextResponse.json({ message: 'Utilisateur introuvable' }, { status: 404 });
    // Vérifier l'ancien mot de passe
    const isValid = await dbUser.verifyPassword(oldPassword);
    if (!isValid) return NextResponse.json({ message: 'Ancien mot de passe incorrect' }, { status: 400 });
    // Générer un token de confirmation
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    await setPasswordChangeToken(dbUser.email, token, newPassword);
    await sendPasswordChangeEmail(dbUser.email, token);
    return NextResponse.json({ message: 'Email de confirmation envoyé' });
  } catch (e) {
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
} 