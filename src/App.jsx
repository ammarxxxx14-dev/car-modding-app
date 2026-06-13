import React, { useState } from 'react';
import { useProgress } from '@react-three/drei';
import CanvasArea from './components/CanvasArea';
import TopHeader from './components/TopHeader';
import LeftNavigation from './components/LeftNavigation';
import RightToolbar from './components/RightToolbar';
import BottomRibbon from './components/BottomRibbon';
import LandingPage from './components/LandingPage';

// Reads real Three.js loading progress — must be inside the React tree
function LoadingOverlay({ carName }) {
  const { progress, active } = useProgress();

  if (!active && progress === 100) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading {carName}</p>
      <div className="progress-bar-wrapper">
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.round(progress)}%` }}
        ></div>
      </div>
      <p className="loading-sub">{Math.round(progress)}% — Large 3D model, please wait…</p>
    </div>
  );
}

export default function App() {
  const [currentCar, setCurrentCar] = useState(null); // Object: { id, name, modelPath, scale, position }
  const [carColor, setCarColor] = useState('#ffffff');
  const [carColor2, setCarColor2] = useState('#ff0000');
  const [splitPaint, setSplitPaint] = useState(false);
  const [paintFinish, setPaintFinish] = useState('glossy');
  const [paintFinish2, setPaintFinish2] = useState('glossy');
  const [suspension, setSuspension] = useState(0.5);
  const [activeMode, setActiveMode] = useState(null);

  const handleSelectCar = (carConfig) => {
    setCurrentCar(carConfig);
    setCarColor('#ffffff');
    setCarColor2('#ff0000');
    setSplitPaint(false);
    setPaintFinish('glossy');
    setPaintFinish2('glossy');
    setSuspension(0.5);
    setActiveMode(null);
  };

  const handleHome = () => {
    setCurrentCar(null);
  };

  if (!currentCar) {
    return (
      <div className="app-container">
        <LandingPage onSelectCar={handleSelectCar} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* 3D Background */}
      <CanvasArea 
        currentModel={currentCar.modelPath} 
        carColor={carColor} 
        carColor2={carColor2}
        splitPaint={splitPaint}
        paintFinish={paintFinish}
        paintFinish2={paintFinish2}
        suspension={suspension} 
        carScale={currentCar.scale || 1}
        carPosition={currentCar.position || [0, 0, 0]}
      />

      {/* UI Overlay */}
      <div className="ui-layer">
        <LoadingOverlay carName={currentCar.name} />
        
        <TopHeader carName={currentCar.name} onHome={handleHome} />
        <LeftNavigation activeMode={activeMode} setActiveMode={setActiveMode} />
        <RightToolbar />
        <BottomRibbon
          isOpen={!!activeMode}
          activeMode={activeMode}
          carColor={carColor}
          setCarColor={setCarColor}
          carColor2={carColor2}
          setCarColor2={setCarColor2}
          splitPaint={splitPaint}
          setSplitPaint={setSplitPaint}
          paintFinish={paintFinish}
          setPaintFinish={setPaintFinish}
          paintFinish2={paintFinish2}
          setPaintFinish2={setPaintFinish2}
          suspension={suspension}
          setSuspension={setSuspension}
        />
      </div>
    </div>
  );
}
