import React from 'react';
import LogoHeader from '../components/ui/LogoHeader';

const Splash: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LogoHeader subtitle="Système de Réservation de Véhicules" />
    </div>
  );
};

export default Splash;
