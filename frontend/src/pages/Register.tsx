import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import LogoHeader from '../components/ui/LogoHeader';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { showToast } = useToast();
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!name.trim()) {
            showToast('Le nom est requis.', 'error');
            return;
        }
        if (!email.trim()) {
            showToast('L\'email est requis.', 'error');
            return;
        }
        if (password.length < 6) {
            showToast('Le mot de passe doit contenir au moins 6 caractères.', 'error');
            return;
        }
        if (password !== confirmPassword) {
            showToast('Les mots de passe ne correspondent pas.', 'error');
            return;
        }

        // Afficher la boîte de dialogue de confirmation
        setShowConfirmDialog(true);
    };

    const confirmRegistration = async () => {
        setShowConfirmDialog(false);
        setLoading(true);

        try {
            await register(name.trim(), email.trim(), password, 'user');
            showToast('Inscription réussie ! Vous pouvez maintenant vous connecter.', 'success');
            navigate('/login');
        } catch (error: any) {
            showToast(error.message || 'Erreur lors de l\'inscription.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <LogoHeader />

                <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">Inscription</h2>
                
                {/* Form Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm p-8 mb-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <TextField
                            label="Nom complet"
                            type="text"
                            value={name}
                            onChange={setName}
                            placeholder="Votre nom"
                            disabled={loading}
                        />

                        <TextField
                            label="Adresse Email"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="vous@example.com"
                            disabled={loading}
                        />

                        <TextField
                            label="Mot de passe"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            placeholder="••••••••"
                            disabled={loading}
                            showPasswordToggle
                        />

                        <TextField
                            label="Confirmer le mot de passe"
                            type="password"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            placeholder="••••••••"
                            disabled={loading}
                            showPasswordToggle
                        />



                        <Button type="submit" loading={loading} disabled={loading} loadingText='Inscription...'>
                            S'inscrire
                        </Button>
                    </form>
                </div>

                {/* Login Link */}
                <div className="text-center">
                    <p className="text-gray-600">
                        Déjà un compte ?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-600 hover:text-blue-700 font-medium transition"
                        >
                            Se connecter
                        </button>
                    </p>
                </div>

                {/* Confirmation Dialog */}
                <ConfirmationDialog
                    isOpen={showConfirmDialog}
                    title="Confirmer l'inscription"
                    message={`Êtes-vous sûr de vouloir créer un compte avec l'adresse email ${email} ?`}
                    confirmText="S'inscrire"
                    onConfirm={confirmRegistration}
                    onCancel={() => setShowConfirmDialog(false)}
                    variant="primary"
                />
            </div>
        </div>
    );
}
