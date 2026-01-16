// src/components/CookieBanner.js
import React, { useState, useEffect } from 'react';
import './CookieBanner.css'; // Optional styling

function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user already made choice
    const cookieChoice = localStorage.getItem('tulludimtu-cookie-choice');
    if (!cookieChoice) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('tulludimtu-cookie-choice', 'accepted');
    setShowBanner(false);
    // Add your analytics scripts here
  };

  const declineCookies = () => {
    localStorage.setItem('tulludimtu-cookie-choice', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-banner" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#2C3E50',
      color: 'white',
      padding: '15px',
      textAlign: 'center',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <p style={{ margin: '0 10px' }}>
        We use cookies to improve your experience. 
        <a href="/privacy" style={{ color: '#3498db', marginLeft: '5px' }}>
          Learn more
        </a>
      </p>
      <div>
        <button 
          onClick={acceptCookies}
          style={{
            background: '#27AE60',
            color: 'white',
            border: 'none',
            padding: '8px 20px',
            margin: '0 5px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Accept
        </button>
        <button 
          onClick={declineCookies}
          style={{
            background: '#E74C3C',
            color: 'white',
            border: 'none',
            padding: '8px 20px',
            margin: '0 5px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

export default CookieBanner;