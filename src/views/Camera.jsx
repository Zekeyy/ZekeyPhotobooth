import React, { useState } from 'react';

const Camera = ({
  videoRef,
  cameraError,
  capturedImages,
  currentImageIndex,
  startCamera,
  capturePhoto
}) => {
  const [countdown, setCountdown] = useState(0);
  const totalShots = 8; // Fixed at 8 shots regardless of layout

  const startCountdown = () => {
    setCountdown(1);
    const interval = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(interval);
          // When countdown reaches 0, capture the photo
          capturePhoto();
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  return (
    <div className="camera-container">
      {cameraError ? (
        <div className="camera-error">
          <h3>Camera Error</h3>
          <p>{cameraError}</p>
          <button className="retry-button" onClick={startCamera}>Try Again</button>
        </div>
      ) : (
        <>
          <div className="capture-progress">
            <h3>Capturing image {currentImageIndex + 1} of {totalShots}</h3>
            <div className="progress-indicators">
              {Array(totalShots).fill().map((_, idx) => (
                <div 
                  key={idx} 
                  className={`indicator ${idx < currentImageIndex ? 'captured' : idx === currentImageIndex ? 'current' : ''}`}
                />
              ))}
            </div>
          </div>
          
          {/* Side by side layout with camera on left and previews on right */}
          <div className="camera-view-container">
            <div className="camera-side">
              <video 
                ref={videoRef} 
                className="camera-preview" 
                autoPlay 
                playsInline
              />
              
              {countdown > 0 && (
                <div className="countdown-overlay">
                  <span className="countdown-number">{countdown}</span>
                </div>
              )}
              
              <button 
                className="capture-button"
                onClick={startCountdown}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Capturing in ${countdown}...` : 'Capture Photo'}
              </button>
            </div>

            <div className="preview-side">
              <h3>Preview</h3>
              <div className="captured-previews">
                {Array(totalShots).fill().map((_, idx) => (
                  <div 
                    key={idx}
                    className="captured-preview-item"
                  >
                    {capturedImages[idx] ? (
                      <img 
                        src={capturedImages[idx]} 
                        alt={`Preview ${idx + 1}`} 
                        className={`captured-thumbnail ${idx === currentImageIndex ? 'current' : ''}`}
                      />
                    ) : (
                      <div className={`empty-thumbnail ${idx === currentImageIndex ? 'current' : ''}`}>
                        <span>{idx === currentImageIndex ? 'Current' : `Image ${idx + 1}`}</span>
                      </div>
                    )}
                    <div className="image-label">
                      Image {idx + 1} {idx === currentImageIndex ? '(Current)' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Camera;