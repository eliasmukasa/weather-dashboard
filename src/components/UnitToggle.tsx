// src/components/UnitToggle.tsx

import React from 'react';

interface UnitToggleProps {
  units: 'metric' | 'imperial';
  onToggle: (newUnits: 'metric' | 'imperial') => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ units, onToggle }) => {
  return (
    <div className="unit-toggle">
      <button 
        className={units === 'metric' ? 'active' : ''}
        onClick={() => onToggle('metric')}
      >
        °C
      </button>
      <button 
        className={units === 'imperial' ? 'active' : ''}
        onClick={() => onToggle('imperial')}
      >
        °F
      </button>
    </div>
  );
};

export default UnitToggle;