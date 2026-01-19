import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { X } from "lucide-react";
import TextField from "./TextField";

interface PasswordModalProps {
  onClose: () => void;
  onSubmit: (newPassword: string) => void;
}

export default function PasswordModal({ onClose, onSubmit }: PasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!currentPassword.trim()) {
      showToast('Veuillez saisir votre mot de passe actuel.', 'error');
      return;
    }

    if (!newPassword.trim()) {
      showToast('Veuillez saisir un nouveau mot de passe.', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Le nouveau mot de passe doit contenir au moins 6 caractères.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Les nouveaux mots de passe ne correspondent pas.', 'error');
      return;
    }

    if (currentPassword === newPassword) {
      showToast('Le nouveau mot de passe doit être différent de l\'actuel.', 'error');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(newPassword);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-300 rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Modifier le mot de passe
            </h2>
            <p className="text-gray-600 text-sm">
              Saisissez votre mot de passe actuel et choisissez-en un nouveau
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Mot de passe actuel"
            type="password"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Votre mot de passe actuel"
            disabled={loading}
            required={true}
            showPasswordToggle={true}
          />

          <TextField
            label="Nouveau mot de passe"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Au moins 6 caractères"
            disabled={loading}
            required={true}
            showPasswordToggle={true}
          />

          <TextField
            label="Confirmer le nouveau mot de passe"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Répétez le nouveau mot de passe"
            disabled={loading}
            required={true}
            showPasswordToggle={true}
          />

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-200 text-gray-900 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-lg transition"
            >
              {loading ? "Modification..." : "Modifier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
