import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-200 mb-4">404</div>
          <div className="text-6xl mb-4">😵</div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page non trouvée
        </h1>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Aller au tableau de bord
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-500">
          Si vous pensez que c'est une erreur, contactez le support.
        </div>
      </div>
    </div>
  );
}
