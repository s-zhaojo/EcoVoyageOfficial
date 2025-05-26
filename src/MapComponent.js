import React, { useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api';
import './styles.css'; // Make sure your modal styles are in this file

const GOOGLE_MAPS_API_KEY = 'AIzaSyCG4hWf-Cck1E4rNWBtW2tddCqcmfX261A';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const MapComponent = () => {
  const [directions, setDirections] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleDirectionsResponse = (result, status) => {
    if (status === 'OK') {
      setDirections(result);
    } else {
      console.error('Error fetching directions:', status);
      alert('Failed to fetch directions. Please check your locations.');
    }
  };

  const requestDirections = () => {
    if (!start || !end) {
      alert('Please enter both start and end locations.');
      return;
    }
    setDirections(null); // Clear previous directions
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <div style={{ padding: '20px' }}>
        <h2>Choose Locations</h2>
        <input
          type="text"
          placeholder="Start Location"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="text"
          placeholder="End Location"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <button onClick={requestDirections}>Get Directions</button>

        <button
          onClick={() => {
            isLoggedIn ? handleLogout() : setIsModalOpen(true);
          }}
          style={{ marginLeft: '10px' }}
        >
          {isLoggedIn ? 'Log Out' : 'Log In'}
        </button>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: 37.7749, lng: -122.4194 }}
          zoom={10}
        >
          {start && end && (
            <DirectionsService
              options={{
                destination: end,
                origin: start,
                travelMode: 'DRIVING',
              }}
              callback={handleDirectionsResponse}
            />
          )}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      {/* Login Modal */}
      {isModalOpen && (
        <div
          className="modal"
          onClick={(e) => {
            if (e.target.className === 'modal') setIsModalOpen(false);
          }}
        >
          <form
            className="modal-content animate"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="imgcontainer">
              <span
                onClick={() => setIsModalOpen(false)}
                className="close"
                title="Close Modal"
              >
                &times;
              </span>
              <img
                src="https://i.pravatar.cc/150?img=3"
                alt="Avatar"
                className="avatar"
              />
            </div>

            <div className="login-container">
              <label htmlFor="uname">
                <b>Username</b>
              </label>
              <input
                type="text"
                placeholder="Enter Username"
                name="uname"
                required
              />

              <label htmlFor="psw">
                <b>Password</b>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                name="psw"
                required
              />

              <button type="submit">Login</button>
              <label>
                <input type="checkbox" defaultChecked name="remember" /> Remember
                me
              </label>
            </div>

            <div
              className="login-container"
              style={{ backgroundColor: '#f1f1f1' }}
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cancelbtn"
              >
                Cancel
              </button>
              <span className="psw">
                Forgot <a href="#">password?</a>
              </span>
            </div>
          </form>
        </div>
      )}
    </LoadScript>
  );
};

export default MapComponent;
