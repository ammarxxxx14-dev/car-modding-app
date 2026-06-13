import React from 'react';

export default function LandingPage({ onSelectCar }) {
  const cars = [
    {
      id: 'bmw',
      name: 'BMW M3 Sedan 2013',
      modelPath: '/models/bmw_m3_sedan_2013.glb',
      scale: 0.05,
      position: [4.0, -3.7, -1.8],
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      specs: 'V8 · 414 HP · 7-Speed M-DCT'
    },
    {
      id: 'vw',
      name: 'Volkswagen Golf GTI 8',
      modelPath: '/models/volkswagen_golf_gti_8.glb',
      scale: 1.4,
      position: [0, -0.2, 0],
      image: 'https://images.unsplash.com/photo-1605556209446-5db2e65c9284?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      specs: '2.0 TSI · 245 HP · 7-Speed DSG'
    }
  ];

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">SELECT YOUR VEHICLE</h1>
        <p className="landing-subtitle">Choose a model to enter the 3D Configurator</p>

        <div className="car-selection-grid">
          {cars.map(car => (
            <div 
              key={car.id} 
              className="car-card"
              onClick={() => onSelectCar(car)}
            >
              <div
                className="car-card-image"
                style={{ backgroundImage: `url(${car.image})` }}
              ></div>
              <div className="car-card-overlay">
                <h2>{car.name}</h2>
                <p className="car-specs">{car.specs}</p>
                <button className="btn btn-blue">Configure →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
