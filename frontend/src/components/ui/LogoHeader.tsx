import React from 'react';
import { Car } from 'lucide-react';

interface LogoHeaderProps {
    subtitle?: string;
}

const LogoHeader: React.FC<LogoHeaderProps> = ({ subtitle = "Système de Réservations de Voitures" }) => {
    return (
        <div className="text-center mb-8">
            <div className='flex items-center justify-center gap-2.5'>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                    <Car className='h-8 w-8 text-white'/>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">SRV</h1>
                </div>
            </div>
            {subtitle && <p className="text-gray-500">{subtitle}</p>}
        </div>
    );
};

export default LogoHeader;
