import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import type { User } from '../types/models';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import LogoHeader from '../components/ui/LogoHeader';

interface LoginProps {
    onLoginSuccess: (user: User) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simule un délai
        setTimeout(() => {
            const mockUsers = [
                { email: 'admin@example.com', password: 'admin123', role: 'admin' },
                { email: 'user@example.com', password: 'user123', role: 'user' },
            ];

            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

            const validUsers = [...mockUsers, ...registeredUsers];

            const user = validUsers.find(
                (u: any) => u.email === email && u.password === password
            );

            if (user) {
                showToast('Connexion réussie !', 'success');
                const loggedInUser: User = {
                    id: (user as any).id || (email === 'admin@example.com' ? 1 : 2),
                    name: (user as any).name || (email.startsWith('admin') ? 'Admin User' : 'Regular User'),
                    email,
                    password,
                    role: user.role,
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                onLoginSuccess(loggedInUser);
                localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
                navigate('/dashboard');
            } else {
                showToast('Email ou mot de passe incorrect.', 'error');
            }

            setLoading(false);
        }, 600);
    };



    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <LogoHeader />

                <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">Connexion</h2>

                {/* Form Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm p-8 mb-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <TextField
                            label="Adresse Email"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="vous@example.com"
                            disabled={loading}
                            required={true}
                        />

                        <TextField
                            label="Mot de passe"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            placeholder="••••••••"
                            disabled={loading}
                            showPasswordToggle
                            required={true}
                        />

                        <Button type="submit" loading={loading} disabled={loading} loadingText='Connexion...'>
                            Se Connecter
                        </Button>
                    </form>
                </div>

                {/* Register Link */}
                <div className="text-center">
                    <p className="text-gray-600">
                        Pas encore de compte ?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-blue-600 hover:text-blue-700 font-medium transition"
                        >
                            S'inscrire
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
