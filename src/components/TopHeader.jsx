import React from 'react';

export default function TopHeader({ onHome, carName }) {
  return (
    <div className="top-header ui-panel">
      <div className="header-left">
        <button className="home-btn" onClick={onHome}>
          <span>⌂</span> 3D TUNING
        </button>
        {carName && <span className="header-car-name">{carName}</span>}
      </div>
      <div className="header-right">
        <button className="btn btn-blue">Parts Used</button>
        <button className="btn btn-orange">Top Ranked</button>
      </div>
    </div>
  );
}
