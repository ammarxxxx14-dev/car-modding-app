import React, { useState } from 'react';

const mockCategories = [
  { id: 'fb', title: 'Front Bumper', icon: '🚙' },
  { id: 'rb', title: 'Rear Bumper', icon: '🚗' },
  { id: 'ss', title: 'Side Skirts', icon: '📏' },
  { id: 'w', title: 'Wheels', icon: '🛞' },
  { id: 'suspension', title: 'Suspension', icon: '⛓️' }
];

const mockParts = {
  fb: [
    { id: '1', brand: 'Factory', name: 'Stock Bumper', price: '$0' },
    { id: '2', brand: 'Vorsteiner', name: 'Carbon Aero', price: '$1200' }
  ]
};

const swatches = [
  { id: 'white', color: '#ffffff', name: 'Pearl White' },
  { id: 'black', color: '#111111', name: 'Matte Black' },
  { id: 'red', color: '#ff0000', name: 'Candy Red' },
  { id: 'green', color: '#39ff14', name: 'Neon Green' },
  { id: 'blue', color: '#0055ff', name: 'M-Sport Blue' },
  { id: 'yellow', color: '#ffcc00', name: 'Speed Yellow' },
  { id: 'navy', color: '#000080', name: 'Navy Blue' },
  { id: 'burgundy', color: '#800020', name: 'Burgundy' },
  { id: 'purple', color: '#7B2D8E', name: 'Purple' },
  { id: 'babyblue', color: '#89CFF0', name: 'Baby Blue' },
  { id: 'butteryellow', color: '#FFFACD', name: 'Butter Yellow' },
  { id: 'brown', color: '#5C4033', name: 'Brown' },
  { id: 'pink', color: '#FF69B4', name: 'Pink' },
];

function SwatchRow({ swatches, activeColor, onSelect }) {
  return (
    <div className="swatch-row">
      {swatches.map(swatch => (
        <div
          key={swatch.id}
          className={`color-swatch ${activeColor === swatch.color ? 'active' : ''}`}
          style={{ backgroundColor: swatch.color }}
          onClick={() => onSelect(swatch.color)}
          title={swatch.name}
        ></div>
      ))}
    </div>
  );
}

const finishes = [
  { id: 'glossy', label: 'Glossy' },
  { id: 'pearlescent', label: 'Pearlescent' },
  { id: 'metallic', label: 'Metallic' },
  { id: 'semi-glossy', label: 'Semi-Glossy' },
  { id: 'matte', label: 'Matte' },
  { id: 'chrome', label: 'Chrome' },
  { id: 'iridescent', label: 'Iridescent' },
];

export default function BottomRibbon({ isOpen, activeMode, carColor, setCarColor, carColor2, setCarColor2, splitPaint, setSplitPaint, paintFinish, setPaintFinish, paintFinish2, setPaintFinish2, suspension, setSuspension }) {
  const [activeCategory, setActiveCategory] = useState(null);

  if (!isOpen) {
    return <div className="bottom-ribbon"></div>;
  }

  // --- COLORS MODE ---
  if (activeMode === 'colors') {
    return (
      <div className={`bottom-ribbon ui-panel open`} style={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button
            className={`split-paint-btn ${splitPaint ? 'active' : ''}`}
            onClick={() => setSplitPaint(!splitPaint)}
          >
            {splitPaint ? '✂️ Unified Paint' : '✂️ Split Paint'}
          </button>
          
          {!splitPaint && (
            <div className="finish-selector" style={{ display: 'flex', gap: '8px' }}>
              {finishes.map(f => (
                <button
                  key={f.id}
                  className={`finish-btn ${paintFinish === f.id ? 'active' : ''}`}
                  onClick={() => setPaintFinish(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {!splitPaint ? (
          /* Single color mode */
          <SwatchRow swatches={swatches} activeColor={carColor} onSelect={setCarColor} />
        ) : (
          /* Split color mode */
          <div className="split-paint-container">
            <div className="split-paint-half">
              <span className="split-label">LEFT</span>
              <SwatchRow swatches={swatches} activeColor={carColor} onSelect={setCarColor} />
              <div className="finish-selector" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {finishes.map(f => (
                  <button key={f.id} className={`finish-btn ${paintFinish === f.id ? 'active' : ''}`} onClick={() => setPaintFinish(f.id)}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="split-paint-divider"></div>
            <div className="split-paint-half">
              <span className="split-label">RIGHT</span>
              <SwatchRow swatches={swatches} activeColor={carColor2} onSelect={setCarColor2} />
              <div className="finish-selector" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {finishes.map(f => (
                  <button key={f.id} className={`finish-btn ${paintFinish2 === f.id ? 'active' : ''}`} onClick={() => setPaintFinish2(f.id)}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- PARTS MODE ---
  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
  };

  const handleBack = () => {
    setActiveCategory(null);
  };

  const renderCategories = () => (
    <>
      {mockCategories.map(cat => (
        <div 
          key={cat.id} 
          className={`category-card ${activeCategory === cat.id ? 'active' : ''}`}
          onClick={() => handleCategoryClick(cat.id)}
        >
          <div className="category-icon">{cat.icon}</div>
          <div className="category-title">{cat.title}</div>
        </div>
      ))}
    </>
  );

  const renderParts = () => {
    // Custom Suspension Slider UI
    if (activeCategory === 'suspension') {
      return (
        <>
          <div className="back-btn" onClick={handleBack}>←</div>
          <div className="slider-container" style={{ marginLeft: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>Stock Height</span>
              <span>Slammed</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={suspension} 
              onChange={(e) => setSuspension(parseFloat(e.target.value))} 
            />
          </div>
        </>
      );
    }

    const parts = mockParts[activeCategory] || [];
    return (
      <>
        <div className="back-btn" onClick={handleBack}>←</div>
        {parts.map(part => (
          <div key={part.id} className="part-card">
            <div className="part-brand">{part.brand}</div>
            <div className="part-name">{part.name}</div>
            <div className="part-price">{part.price}</div>
          </div>
        ))}
        {parts.length === 0 && (
          <div style={{color: 'white', padding: '0 20px'}}>No parts available for this category yet.</div>
        )}
      </>
    );
  };

  return (
    <div className={`bottom-ribbon ui-panel open`}>
      {!activeCategory ? renderCategories() : renderParts()}
    </div>
  );
}
