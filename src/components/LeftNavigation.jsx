import React from 'react';

export default function LeftNavigation({ activeMode, setActiveMode }) {
  const modes = [
    { id: 'settings', icon: '⚙️' },
    { id: 'colors', icon: '🎨' },
    { id: 'parts', icon: '🔧' }
  ];

  return (
    <div className="left-nav ui-panel">
      {modes.map((mode) => (
        <div 
          key={mode.id}
          className={`nav-item ${activeMode === mode.id ? 'active' : ''}`}
          onClick={() => setActiveMode(mode.id)}
          title={mode.id}
        >
          {mode.icon}
        </div>
      ))}
    </div>
  );
}
