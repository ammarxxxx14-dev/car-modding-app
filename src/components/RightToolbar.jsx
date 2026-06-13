import React, { useState } from 'react';

export default function RightToolbar() {
  const [toggles, setToggles] = useState({
    sounds: false,
    autoStance: true,
    fastMode: false
  });

  const toggle = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="right-toolbar ui-panel">
      <button className={`toggle-btn ${toggles.sounds ? 'active' : ''}`} onClick={() => toggle('sounds')}>
        <span>Sounds</span>
        <div className="toggle-indicator"></div>
      </button>
      <button className={`toggle-btn ${toggles.autoStance ? 'active' : ''}`} onClick={() => toggle('autoStance')}>
        <span>Auto Stance</span>
        <div className="toggle-indicator"></div>
      </button>
      <button className={`toggle-btn ${toggles.fastMode ? 'active' : ''}`} onClick={() => toggle('fastMode')}>
        <span>Fast Mode</span>
        <div className="toggle-indicator"></div>
      </button>
    </div>
  );
}
