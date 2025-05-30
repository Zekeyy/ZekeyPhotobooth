import React from 'react';

const Landing = ({ onStartClick }) => {
  return (
    <div className="landing-page">
      <h1>Welcome to Zekey's Photo Booth</h1>
      <p>Freeze the Fun. Frame the Memories. Step into the Spotlight with Us!</p>
      <button className="start-button" onClick={onStartClick}>Get Started</button>
    </div>
  );
};

export default Landing;