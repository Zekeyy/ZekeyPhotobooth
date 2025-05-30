import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import layouts from './layouts/layoutOptions';

// Import view components
import Landing from './views/Landing.jsx';
import LayoutSelection from './views/LayoutSelection.jsx';
import Camera from './views/Camera.jsx';
import Editing from './views/Editing.jsx';

// Import utility functions
import { applyFilter, renderFinalImage } from './utils/imageProcessing';

function App() {
  // State for tracking flow steps as per the flowchart
  const [currentStep, setCurrentStep] = useState('landing'); // landing -> layout -> camera -> editing
  const [cameraError, setCameraError] = useState(null);
  
  // Image and layout states
  const [capturedImages, setCapturedImages] = useState([]); // Store multiple images
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track which image slot we're capturing
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [finalImageUrl, setFinalImageUrl] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Filter options
  const filters = [
    { name: 'None', value: 'none', style: {} },
    { name: 'Grayscale', value: 'grayscale', style: { filter: 'grayscale(100%)' } },
    { name: 'Sepia', value: 'sepia', style: { filter: 'sepia(100%)' } },
    { name: 'Vintage', value: 'vintage', style: { filter: 'sepia(50%) contrast(85%) brightness(90%)' } },
    { name: 'Cool', value: 'cool', style: { filter: 'hue-rotate(180deg)' } },
  ];

  // Border color options
  const borderColors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#ff00ff', '#00ffff'
  ];

  
 
useEffect(() => {
  if (currentStep === 'editing') {
    renderImageAndUpdateUrl();
  }
}, [selectedFilter, borderColor, selectedFrame]); // Add selectedFrame as a dependency

  // Camera initialization effect
  useEffect(() => {
    // Only start camera when we're in the camera step
    if (currentStep === 'camera' && !streamRef.current) {
      startCamera();
    }
    
    // Clean up camera when component unmounts
    return () => {
      stopCamera();
    };
  }, [currentStep]);

  // Reset captured images when layout changes
 // Reset captured images when layout changes
useEffect(() => {
  if (selectedLayout) {
    // Initialize empty array with 8 slots for all photos
    setCapturedImages(new Array(8).fill(null));
    setCurrentImageIndex(0);
  }
}, [selectedLayout]);

  // Listen for filter and border changes to update the final image
  useEffect(() => {
    if (currentStep === 'editing') {
      renderImageAndUpdateUrl();
    }
  }, [selectedFilter, borderColor]);
 

  const startCamera = async () => {
    try {
      stopCamera(); // Stop any existing stream first
      
      console.log("Requesting camera access...");
      setCameraError(null);
      
      const constraints = { 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log("Camera access granted!");
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => {
            console.error("Error playing video:", e);
            setCameraError("Error playing video stream: " + e.message);
          });
        };
      } else {
        console.error("Video reference not available");
        setCameraError("Video element not initialized");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Error accessing camera: " + err.message + 
        ". Please make sure you've granted camera permission.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      console.log("Stopping camera stream");
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleStartClick = () => {
    console.log("Starting app - moving to layout selection");
    setCurrentStep('layout');
  };

  const handleLayoutSelect = (layoutId) => {
    setSelectedLayout(layoutId);
    console.log(`Selected layout: ${layoutId}`);
  };

  const proceedToCamera = () => {
    if (!selectedLayout) {
      alert("Please select a layout first");
      return;
    }
    console.log("Moving to camera view");
    setCurrentStep('camera');
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      console.error("Video or canvas reference not available");
      return;
    }
    
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Capture the current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get the image data
    const dataUrl = canvas.toDataURL('image/jpeg');
    
    // Update the capturedImages array with this new image
    const updatedImages = [...capturedImages];
    updatedImages[currentImageIndex] = dataUrl;
    setCapturedImages(updatedImages);
    
    // Check if we've captured the required number of images
    const selectedLayoutObj = layouts.find(l => l.id === selectedLayout);
    const imagesNeeded = selectedLayoutObj ? selectedLayoutObj.imageCount : 8;
    
    if (currentImageIndex < 7) {
      // Move to next image position
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      // Make sure the last image is stored before moving on
      setCapturedImages(updatedImages);
      
      // We're done capturing, move to editing
      setTimeout(() => {
        setCurrentStep('editing');
        stopCamera(); // Stop the camera since we're done capturing
      }, 500); // Small delay to ensure state update completes
    }
  };

  // In App.js, modify the downloadPhoto function:
const downloadPhoto = () => {
  if (finalImageUrl) {
    // Make sure to re-render the image with current settings before download
    renderImageAndUpdateUrl().then(url => {
      const link = document.createElement('a');
      link.href = finalImageUrl;
      link.download = `photobooth_${new Date().getTime()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
};
  const renderImageAndUpdateUrl = async () => {
    if (!canvasRef.current) return;
    
    // Set loading state to true
    setFinalImageUrl(null);
    
    try {
      // Get the current selected layout
      const selectedLayoutObj = layouts.find(l => l.id === selectedLayout);
      if (!selectedLayoutObj) {
        console.error("No selected layout found");
        return;
      }
      
      // Get images for the current layout
      const layoutImageCount = selectedLayoutObj.imageCount;
      
      // Make sure we have enough images
      if (capturedImages.filter(img => img !== null).length < layoutImageCount) {
        console.warn("Not enough images captured for the selected layout");
        return;
      }
      
      // Use the captured images for rendering
      const imagesToRender = capturedImages.slice(0, layoutImageCount);
      
      // Render the image - ADD THE SELECTED FRAME HERE
      const dataUrl = await renderFinalImage(
        canvasRef.current,
        selectedLayout,
        layouts,
        imagesToRender,
        borderColor,
        selectedFilter,
        applyFilter,
        selectedFrame  // Pass the selected frame
      );
      
      // Update the final image URL once we have the result
      setFinalImageUrl(dataUrl);
    } catch (error) {
      console.error("Error rendering final image:", error);
      // Handle error if needed
    }
  };
  
  const updateLayoutImages = async (selectedImageData) => {
    // Check if we have any valid images
    const hasValidImages = selectedImageData && selectedImageData.some(img => img !== null);
    
    // If no valid images, clear the final image
    if (!hasValidImages) {
      setFinalImageUrl(null);
      return;
    }
    
    try {
      // Get the current selected layout
      const selectedLayoutObj = layouts.find(l => l.id === selectedLayout);
      if (!selectedLayoutObj) {
        console.error("No selected layout found");
        return;
      }
      
      console.log("Rendering with images:", selectedImageData);
      
      // Render the final image - ADD THE SELECTED FRAME HERE
      const dataUrl = await renderFinalImage(
        canvasRef.current,
        selectedLayout,
        layouts,
        selectedImageData,
        borderColor,
        selectedFilter,
        applyFilter,
        selectedFrame  // Pass the selected frame
      );
      
      // Update the final image URL
      setFinalImageUrl(dataUrl);
    } catch (error) {
      console.error("Error in updateLayoutImages:", error);
      // Reset loading state on error
      setFinalImageUrl(null);
    }
  };

  const resetAndRetake = () => {
    // Reset states and go back to layout selection
    setCapturedImages([]);
    setCurrentImageIndex(0);
    setSelectedFilter('none');
    setBorderColor('#ffffff');
    setFinalImageUrl(null);
    setCurrentStep('layout');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return <Landing onStartClick={handleStartClick} />;
        
      case 'layout':
        return (
          <LayoutSelection 
            layouts={layouts}
            selectedLayout={selectedLayout}
            onLayoutSelect={handleLayoutSelect}
            onProceed={proceedToCamera}
          />
        );
        
      case 'camera':
        return (
          <Camera 
            videoRef={videoRef}
            cameraError={cameraError}
            capturedImages={capturedImages}
            currentImageIndex={currentImageIndex}
            startCamera={startCamera}
            capturePhoto={capturePhoto}
          />
        );
        
        case 'editing':
          return (
            <Editing 
            layout={layouts.find(l => l.id === selectedLayout)}
            finalImageUrl={finalImageUrl}
            selectedLayout={selectedLayout}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            borderColor={borderColor}
            setBorderColor={setBorderColor}
            borderColors={borderColors}
            filters={filters}
            downloadPhoto={downloadPhoto}
            resetAndRetake={resetAndRetake}
            capturedImages={capturedImages}
            updateLayoutImages={updateLayoutImages}
            selectedFrame={selectedFrame}
            setSelectedFrame={setSelectedFrame}
            />
          );
        
      default:
        return <div>Something went wrong</div>;
    }
  };

  return (
    <div className="photobooth">
      {renderCurrentStep()}
      
      {/* Hidden canvas for image processing */}
      <canvas 
        ref={canvasRef} 
        className="hidden-canvas"
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default App;