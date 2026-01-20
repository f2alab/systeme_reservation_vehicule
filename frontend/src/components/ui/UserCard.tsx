import React, { useState } from 'react';
import type { User } from '../../types/models';
import { User as UserIcon } from 'lucide-react';
import ConfirmationDialog from './ConfirmationDialog';

interface UserCardProps {
    user: User;
    onStatusChange: (userId: string, newStatus: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onStatusChange }) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingAction, setPendingAction] = useState<{ type: 'activate' | 'deactivate'; userId: string } | null>(null);

    const handleStatusToggle = () => {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        setPendingAction({
            type: newStatus === 'active' ? 'activate' : 'deactivate',
            userId: user.id.toString()
        });
        setShowConfirmDialog(true);
    };

    const confirmStatusChange = () => {
        if (pendingAction) {
            const newStatus = pendingAction.type === 'activate' ? 'active' : 'inactive';
            onStatusChange(pendingAction.userId, newStatus);
        }
        setShowConfirmDialog(false);
        setPendingAction(null);
    };

    const cancelStatusChange = () => {
        setShowConfirmDialog(false);
        setPendingAction(null);
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-red-100 text-red-800';
        }
    };

    return (
        <>
            <div className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                            <UserIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-gray-600">{user.email}</p>
                            <div className="flex items-center gap-4 mt-1">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleStatusToggle}
                            className={`px-4 py-2 font-medium rounded-lg transition ${
                                user.status === 'active'
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                        >
                            {user.status === 'active' ? 'Désactiver' : 'Activer'}
                        </button>
                    </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                    <p>Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
            </div>

            <ConfirmationDialog
                isOpen={showConfirmDialog}
                title={pendingAction?.type === 'activate' ? 'Activer l\'utilisateur' : 'Désactiver l\'utilisateur'}
                message={
                    pendingAction?.type === 'activate'
                        ? `Êtes-vous sûr de vouloir activer le compte de ${user.name} ? L'utilisateur pourra se connecter et utiliser le système.`
                        : `Êtes-vous sûr de vouloir désactiver le compte de ${user.name} ? L'utilisateur ne pourra plus se connecter au système.`
                }
                confirmText={pendingAction?.type === 'activate' ? 'Activer' : 'Désactiver'}
                cancelText="Annuler"
                onConfirm={confirmStatusChange}
                onCancel={cancelStatusChange}
                variant={pendingAction?.type === 'activate' ? 'primary' : 'destructive'}
            />
        </>
    );
};

export default UserCard;
