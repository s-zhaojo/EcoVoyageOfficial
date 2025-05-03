import React, { useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import './styles.css';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const containerStyle = {
  width: '100%',
  height: '60vh',
};

const carbonEmissions = {
  car: 0.411,
  truck: 1.3,
  bus: 0.089,
  motorcycle: 0.16,
  airplane: 0.255,
};

const transportationCosts = {
  car: 0.13,
  truck: 0.25,
  bus: 0.05,
  motorcycle: 0.08,
  airplane: 0.15,
};

const speeds = {
  car: 60,
  truck: 50,
  bus: 30,
  motorcycle: 70,
  airplane: 500,
};

function MapComponent() {
  const [directions, setDirections] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [isRequestingDirections, setIsRequestingDirections] = useState(false);
  const [distance, setDistance] = useState(null);
  const [emissions, setEmissions] = useState({});
  const [costs, setCosts] = useState({});
  const [durationsByMode, setDurationsByMode] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => setLoggedIn(!isLoggedIn);

  const handleDirectionsResponse = (result, status) => {
    if (status === 'OK') {
      setDirections(result);
      const route = result.routes[0];
      const distInMeters = route.legs[0].distance.value;
      const distInKm = distInMeters / 1000;
      const distInMiles = distInKm * 0.621371;

      setDistance(distInMeters);

      const modeEmissions = {};
      const modeCosts = {};
      const modeDurations = {};

      Object.keys(carbonEmissions).forEach((mode) => {
        modeEmissions[mode] = distInMiles * carbonEmissions[mode];
        modeCosts[mode] = distInMiles * transportationCosts[mode];
        modeDurations[mode] = `${(distInMiles / speeds[mode]).toFixed(2)} hours`;
      });

      setEmissions(modeEmissions);
      setCosts(modeCosts);
      setDurationsByMode(modeDurations);
    } else {
      console.error('Directions error:', status);
      alert('Failed to fetch directions.');
    }
    setIsRequestingDirections(false);
  };

  const requestDirections = () => {
    if (!start || !end) return alert('Please enter both start and end locations.');
    setIsRequestingDirections(true);
    setDirections(null);
    setDistance(null);
    setEmissions({});
    setCosts({});
    setDurationsByMode({});
  };

  const handleModeSelect = () => {
    if (emissions[selectedVehicle] && costs[selectedVehicle]) {
      setTotalDistance(prev => prev + distance / 1000);
      setTotalCost(prev => prev + costs[selectedVehicle]);
      setTotalEmissions(prev => prev + emissions[selectedVehicle]);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>{isLoggedIn ? 'Log Out' : 'Log In'}</button>
      <div className="container">
        <div className="sidebar">
          <div className="card">
            <h3>Total Distance</h3>
            <p>{distance ? `${(distance / 1000).toFixed(2)} km / ${(distance * 0.000621371).toFixed(2)} miles` : 'N/A'}</p>
          </div>
          <div className="card">
            <h3>Total Cost</h3>
            <p>{costs[selectedVehicle] ? `$${costs[selectedVehicle].toFixed(2)}` : '$0'}</p>
          </div>
          <div className="card">
            <h3>Total CO2 Emissions</h3>
            <p>{emissions[selectedVehicle] ? `${emissions[selectedVehicle].toFixed(2)} kg CO2` : '0 kg CO2'}</p>
          </div>
        </div>
        <div className="main-content">
          <div className="header">
            <h1>EcoVoyage</h1>
            <div className="input-container">
              <input className="search-bar" type="text" placeholder="Start Location" value={start} onChange={(e) => setStart(e.target.value)} />
              <input className="search-bar" type="text" placeholder="End Location" value={end} onChange={(e) => setEnd(e.target.value)} />
              <label htmlFor="vehicle">Vehicle:</label>
              <select id="vehicle" value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}>
                <option value="car">Car</option>
                <option value="truck">Truck</option>
                <option value="bus">Bus</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="airplane">Airplane</option>
              </select>
              <button onClick={() => { requestDirections(); handleModeSelect(); }}>Get Directions</button>
            </div>
          </div>
          <div className="map-container">
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap mapContainerStyle={containerStyle} center={{ lat: 37.7749, lng: -122.4194 }} zoom={10}>
                {isRequestingDirections && start && end && (
                  <DirectionsService
                    options={{ destination: end, origin: start, travelMode: 'DRIVING' }}
                    callback={handleDirectionsResponse}
                  />
                )}
                {directions && (
                  <DirectionsRenderer
                    directions={directions}
                    options={{ polylineOptions: { strokeColor: '#4CAF50', strokeWeight: 5 } }}
                  />
                )}
              </GoogleMap>
            </LoadScript>
          </div>
          <div className="trip-details">
            {directions && (
              <>
                <div className="card"><h3>Distance</h3><p>{(distance / 1000).toFixed(2)} km / {(distance * 0.000621371).toFixed(2)} miles</p></div>
                <div className="card"><h3>CO2 Emissions</h3><ul>{Object.keys(emissions).map(mode => (
                  <li key={mode}><strong>{mode}:</strong> {emissions[mode].toFixed(2)} kg CO2</li>))}</ul></div>
                <div className="card"><h3>Costs</h3><ul>{Object.keys(costs).map(mode => (
                  <li key={mode}><strong>{mode}:</strong> ${costs[mode].toFixed(2)}</li>))}</ul></div>
                <div className="card"><h3>Durations</h3><ul>{Object.keys(durationsByMode).map(mode => (
                  <li key={mode}><strong>{mode}:</strong> {durationsByMode[mode]}</li>))}</ul></div>
              </>
            )}
            <div className="profile-card">
              <img src="https://static.wikia.nocookie.net/smashremixipedia/images/6/60/Link_SSBR.png" alt="Link" style={{ width: '100%', borderRadius: '10px' }} />
              <h1>Link</h1>
              <p className="title">Hero of Hyrule</p>
              <p>Nintendo Universe</p>
              <div className="social-icons">
                <a href="#"><i className="fa fa-dribbble"></i></a>
                <a href="#"><i className="fa fa-twitter"></i></a>
                <a href="#"><i className="fa fa-linkedin"></i></a>
                <a href="#"><i className="fa fa-facebook"></i></a>
              </div>
              <p><button>Contact</button></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapComponent;
