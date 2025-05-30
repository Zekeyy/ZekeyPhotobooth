import React, { useEffect, useState } from 'react';
import { frames, adjustFrameForLayout } from '../frames/imageFrames'; // Updated import path

const Editing = ({ 
  layout,
  finalImageUrl,
  selectedLayout,
  selectedFilter,
  setSelectedFilter,
  borderColor,
  setBorderColor,
  borderColors,
  filters,
  downloadPhoto,
  resetAndRetake,
  capturedImages,
  updateLayoutImages,
  selectedFrame,
  setSelectedFrame
}) => {
  const [isLoading, setIsLoading] = useState(!finalImageUrl);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [adjustedFrame, setAdjustedFrame] = useState(null);
  
  useEffect(() => {
    // Initialize the selected positions when layout is loaded
    if (layout) {
      // Create array of nulls (no auto-assignment)
      const positionsNeeded = layout.imageCount;
      const newPositions = Array(positionsNeeded).fill(null);
      setSelectedPositions(newPositions);
    }
  }, [layout]);
  
  // Adjust the frame for the current layout whenever it changes
  useEffect(() => {
    if (selectedFrame && layout) {
      // Create layout object in the format expected by adjustFrameForLayout
      const layoutForAdjustment = {
        orientation: layout.orientation,
        size: layout.size || '3x3' // Default size if not specified
      };
      
      // Adjust the frame for the current layout
      const adjusted = adjustFrameForLayout(selectedFrame, layoutForAdjustment);
      setAdjustedFrame(adjusted);
    } else {
      setAdjustedFrame(null);
    }
  }, [selectedFrame, layout]);
  
  // Update the layout images when selections change
  useEffect(() => {
    if (!layout || !capturedImages.length) return;
    
    // Create a full array the same size as the layout's image count
    const newImageArray = Array(layout.imageCount).fill(null);
    
    // Only place selected images at their positions
    selectedPositions.forEach((imageIndex, posIndex) => {
      if (imageIndex !== null && capturedImages[imageIndex]) {
        newImageArray[posIndex] = capturedImages[imageIndex];
      }
    });
    
    // Update as soon as we have at least one image
    if (selectedPositions.some(pos => pos !== null)) {
      updateLayoutImages(newImageArray);
    }
  }, [selectedPositions, layout, capturedImages, updateLayoutImages]);

  // Update images when frame or border color changes
  useEffect(() => {
    if (selectedFrame !== null || borderColor) {
      setIsLoading(true);
      updateLayoutImages(selectedPositions.map((pos, idx) => 
        pos !== null ? capturedImages[pos] : null
      ));
    }
  }, [selectedFrame, borderColor, selectedPositions, capturedImages, updateLayoutImages]);

  // Handle selecting an image for a position
  const selectImageForPosition = (positionIndex, imageIndex) => {
    console.log(`Selecting image ${imageIndex} for position ${positionIndex}`);
    setIsLoading(true);
    
    // Check if this image is already assigned to another position
    const currentPositionForImage = selectedPositions.findIndex(pos => pos === imageIndex);
    
    // If it's already assigned elsewhere, remove it from there first
    if (currentPositionForImage !== -1 && currentPositionForImage !== positionIndex) {
      setSelectedPositions(prev => {
        const newSelections = [...prev];
        newSelections[currentPositionForImage] = null;
        newSelections[positionIndex] = imageIndex;
        return newSelections;
      });
    } else {
      // Just assign to new position
      setSelectedPositions(prev => {
        const newSelections = [...prev];
        newSelections[positionIndex] = imageIndex;
        return newSelections;
      });
    }
  };

  // Handle removing an image from a position
  const removeImageFromPosition = (positionIndex) => {
    console.log(`Removing image from position ${positionIndex}`);
    setIsLoading(true);
    
    setSelectedPositions(prev => {
      const newSelections = [...prev];
      newSelections[positionIndex] = null;
      return newSelections;
    });
  };

// Enhanced renderLayoutPreview function
const renderLayoutPreview = () => {
  // Calculate aspect ratio based on orientation
  const containerWidth = layout.orientation === 'landscape' ? 700 : 300;
  const containerHeight = layout.orientation === 'landscape' ? 500 : 450;

  // Get filter CSS properties based on selected filter
  const getFilterStyle = () => {
    switch (selectedFilter) {
      case 'grayscale':
        return 'grayscale(100%)';
      case 'sepia':
        return 'sepia(100%)';
      case 'vintage':
        return 'sepia(50%) contrast(85%) brightness(90%)';
      case 'highContrast':
        return 'contrast(150%) brightness(110%)';
      case 'warm':
        return 'saturate(150%) hue-rotate(10deg) brightness(105%)';
      case 'cool':
        return 'saturate(90%) hue-rotate(-10deg) brightness(95%)';
      default:
        return 'none'; // Default/Normal filter
    }
  };

  // Get the frame to use - either adjusted or selected, or default border
  const frameToUse = adjustedFrame || selectedFrame;
  const frameStyle = frameToUse ? { ...frameToUse.style } : { 
    border: `5px solid ${borderColor}`, 
    backgroundColor: borderColor 
  };
  
  // Calculate the correct inner area for photos based on frame type
  let innerAreaX, innerAreaY, innerAreaWidth, innerAreaHeight;
  
  if (frameToUse) {
    const borderWidth = frameToUse.borderWidth || 0;
    
    if (frameToUse.matWidth) {
      // For matted frames
      const matWidth = frameToUse.matWidth;
      innerAreaX = borderWidth + matWidth;
      innerAreaY = borderWidth + matWidth;
      innerAreaWidth = containerWidth - (borderWidth + matWidth) * 2;
      innerAreaHeight = containerHeight - (borderWidth + matWidth) * 2;
    } else if (frameToUse.innerBorderWidth) {
      // For frames with inner borders
      const innerBorderWidth = frameToUse.innerBorderWidth;
      innerAreaX = borderWidth + innerBorderWidth;
      innerAreaY = borderWidth + innerBorderWidth;
      innerAreaWidth = containerWidth - (borderWidth + innerBorderWidth) * 2;
      innerAreaHeight = containerHeight - (borderWidth + innerBorderWidth) * 2;
    } else if (frameToUse.edgeEffect && frameToUse.edgeEffect.type === 'wrap') {
      // For canvas wrap
      const wrapDepth = frameToUse.edgeEffect.depth || 20;
      innerAreaX = wrapDepth;
      innerAreaY = wrapDepth;
      innerAreaWidth = containerWidth - wrapDepth * 2;
      innerAreaHeight = containerHeight - wrapDepth * 2;
    } else if (frameToUse.floatEffect) {
      // For floating frames
      const floatDistance = frameToUse.floatEffect.distance || 10;
      innerAreaX = floatDistance;
      innerAreaY = floatDistance;
      innerAreaWidth = containerWidth - floatDistance * 2;
      innerAreaHeight = containerHeight - floatDistance * 2;
    } else {
      // Standard frames
      innerAreaX = borderWidth;
      innerAreaY = borderWidth;
      innerAreaWidth = containerWidth - borderWidth * 2;
      innerAreaHeight = containerHeight - borderWidth * 2;
    }
  } else {
    // Default with simple border
    const defaultBorderWidth = 5;
    innerAreaX = defaultBorderWidth;
    innerAreaY = defaultBorderWidth;
    innerAreaWidth = containerWidth - defaultBorderWidth * 2;
    innerAreaHeight = containerHeight - defaultBorderWidth * 2;
  }

  // Create an array to track which grid lines should be visible
  // Initialize all lines as invisible
  const visibleGridLines = {
    vertical: new Array(layout.positions.length).fill(false),
    horizontal: new Array(layout.positions.length).fill(false)
  };

  // Determine which grid lines should be visible based on layout logic
  layout.positions.forEach((pos, idx) => {
    // Skip the first position as reference
    if (idx === 0) return;
    
    const posX = pos.x;
    const posY = pos.y;
    const width = pos.width;
    const height = pos.height;
    
    // Check if this position creates unique edges that need grid lines
    layout.positions.forEach((otherPos, otherIdx) => {
      if (otherIdx === idx) return; // Skip self-comparison
      
      // Check if positions share an edge along X-axis
      if (Math.abs(posX - otherPos.x) < 0.001 && 
         !(Math.abs(posX) < 0.001 || Math.abs(posX - 1) < 0.001)) {
        // They share an X position that's not at the outer edges
        visibleGridLines.vertical[idx] = true;
      }
      
      // Check if positions share an edge along Y-axis
      if (Math.abs(posY - otherPos.y) < 0.001 && 
         !(Math.abs(posY) < 0.001 || Math.abs(posY - 1) < 0.001)) {
        // They share a Y position that's not at the outer edges
        visibleGridLines.horizontal[idx] = true;
      }
    });
    
    // Special case: if this position is the only one at this X or Y value,
    // AND it doesn't span the full height/width, we may still need a line
    const isUniqueX = !layout.positions.some((otherPos, otherIdx) => 
      otherIdx !== idx && Math.abs(posX - otherPos.x) < 0.001);
      
    const isUniqueY = !layout.positions.some((otherPos, otherIdx) => 
      otherIdx !== idx && Math.abs(posY - otherPos.y) < 0.001);
      
    // For Layout E (2x2 grid), we specifically need to ensure grid lines show properly
    if (layout.id === 'E') {
      if (posX === 0.5) visibleGridLines.vertical[idx] = true;
      if (posY === 0.5) visibleGridLines.horizontal[idx] = true;
    }
  });

  return (
    <div 
      className="layout-preview-container" 
      style={{ 
        width: `${containerWidth}px`, 
        height: `${containerHeight}px`,
        position: 'relative',
        margin: '0 auto 20px auto',
        ...frameStyle,
        boxSizing: 'border-box'
      }}
    >
      {/* Inner white area for photos */}
      <div style={{
        position: 'absolute',
        left: `${innerAreaX}px`,
        top: `${innerAreaY}px`,
        width: `${innerAreaWidth}px`,
        height: `${innerAreaHeight}px`,
        backgroundColor: '#ffffff',
        zIndex: 3,
        overflow: 'hidden'
      }}>
        {/* Image grid container */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%'
        }}>
          {layout.positions.map((pos, idx) => {
            const imageIndex = selectedPositions[idx];
            const hasImage = imageIndex !== null && capturedImages[imageIndex];
            
            const posX = pos.x * innerAreaWidth;
            const posY = pos.y * innerAreaHeight;
            const posWidth = pos.width * innerAreaWidth;
            const posHeight = pos.height * innerAreaHeight;
            
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: `${posX}px`,
                  top: `${posY}px`,
                  width: `${posWidth}px`,
                  height: `${posHeight}px`,
                  border: hasImage ? 'none' : '1px dashed #aaa',
                  backgroundColor: hasImage ? 'transparent' : '#f8f8f8',
                  overflow: 'hidden',
                  cursor: hasImage ? 'pointer' : 'default'
                }}
                onClick={hasImage ? () => removeImageFromPosition(idx) : null}
              >
                {hasImage ? (
                  <>
                    <img
                      src={capturedImages[imageIndex]}
                      alt={`Position ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: getFilterStyle(),
                        display: 'block'
                      }}
                    />
                    <div 
                      className="remove-overlay"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        fontSize: '14px'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
                    >
                      Click to remove
                    </div>
                  </>
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#aaa' }}>Image {idx + 1}</div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>Select an image below</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Custom dividing lines for layout-specific designs */}
      {layout.id === 'E' && (
        <div style={{
          position: 'absolute',
          left: `${innerAreaX}px`,
          top: `${innerAreaY}px`,
          width: `${innerAreaWidth}px`,
          height: `${innerAreaHeight}px`,
          zIndex: 4,
          pointerEvents: 'none'
        }}>
          {/* Horizontal middle line for 2x2 grid */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: `${innerAreaHeight / 2}px`,
            width: '100%',
            height: '1px',
            backgroundColor: '#ffffff',
            zIndex: 4
          }} />
          
          {/* Vertical middle line for 2x2 grid */}
          <div style={{
            position: 'absolute',
            left: `${innerAreaWidth / 2}px`,
            top: 0,
            width: '1px',
            height: '100%',
            backgroundColor: '#ffffff',
            zIndex: 4
          }} />
        </div>
      )}
      
      {/* Layout F - horizontal line only */}
      {layout.id === 'F' && (
        <div style={{
          position: 'absolute',
          left: `${innerAreaX}px`,
          top: `${innerAreaY}px`,
          width: `${innerAreaWidth}px`,
          height: `${innerAreaHeight}px`,
          zIndex: 4,
          pointerEvents: 'none'
        }}>
          {/* Horizontal middle line */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: `${innerAreaHeight / 2}px`,
            width: '100%',
            height: '1px',
            backgroundColor: '#ffffff',
            zIndex: 4
          }} />
          
          {/* Vertical line at 0.5 position (between left images) */}
          <div style={{
            position: 'absolute',
            left: `${innerAreaWidth * 0.5}px`,
            top: 0,
            width: '1px',
            height: `${innerAreaHeight / 2}px`, // Only goes halfway down
            backgroundColor: '#ffffff',
            zIndex: 4
          }} />
        </div>
      )}
      
      {/* Layout G - vertical line only */}
      {layout.id === 'G' && (
        <div style={{
          position: 'absolute',
          left: `${innerAreaX}px`,
          top: `${innerAreaY}px`,
          width: `${innerAreaWidth}px`,
          height: `${innerAreaHeight}px`,
          zIndex: 4,
          pointerEvents: 'none'
        }}>
          {/* Vertical line at 65% */}
          <div style={{
            position: 'absolute',
            left: `${innerAreaWidth * 0.65}px`,
            top: 0,
            width: '1px',
            height: '100%',
            backgroundColor: '#ffffff',
            zIndex: 4
          }} />
          
          {/* Horizontal line at 50% but only for right portion */}
          <div style={{
            position: 'absolute',
            left: `${innerAreaWidth * 0.65}px`,
            top: `${innerAreaHeight * 0.5}px`,
            width: `${innerAreaWidth * 0.35}px`,
            height: '1px',
            backgroundColor: '#ffffff',
            zIndex: 4
          }} />
        </div>
      )}
      
      {/* Layout H - specific lines */}
      {layout.id === 'H' && (
        <div style={{
          position: 'absolute',
          left: `${innerAreaX}px`,
          top: `${innerAreaY}px`,
          width: `${innerAreaWidth}px`,
          height: `${innerAreaHeight}px`,
          zIndex: 4,
          pointerEvents: 'none'
        }}>
          {/* Horizontal line at 65% */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: `${innerAreaHeight * 0.65}px`,
            width: '100%',
            height: '1px',
            backgroundColor: '#ffffff',
            zIndex: 4
          }} />
          
          {/* Vertical line at 50% but only for top portion */}
          <div style={{
            position: 'absolute',
            left: `${innerAreaWidth * 0.5}px`,
            top: 0,
            width: '1px',
            height: `${innerAreaHeight * 0.65}px`,
            backgroundColor: '#ffffff',
            zIndex: 4
          }} />
        </div>
      )}
      
      {/* Layout I - vertical line only */}
      {layout.id === 'I' && (
        <div style={{
          position: 'absolute',
          left: `${innerAreaX}px`,
          top: `${innerAreaY}px`,
          width: `${innerAreaWidth}px`,
          height: `${innerAreaHeight}px`,
          zIndex: 4,
          pointerEvents: 'none'
        }}>
          {/* Vertical line at 65% */}
          <div style={{
            position: 'absolute',
            left: `${innerAreaWidth * 0.65}px`,
            top: 0,
            width: '1px',
            height: '100%',
            backgroundColor: '#ffffff',
            zIndex: 4
          }} />
        </div>
      )}
      
      {/* Layout J - horizontal line only */}
      {layout.id === 'J' && (
        <div style={{
          position: 'absolute',
          left: `${innerAreaX}px`,
          top: `${innerAreaY}px`,
          width: `${innerAreaWidth}px`,
          height: `${innerAreaHeight}px`,
          zIndex: 4,
          pointerEvents: 'none'
        }}>
          {/* Horizontal line at 40% */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: `${innerAreaHeight * 0.4}px`,
            width: '100%',
            height: '1px',
            backgroundColor: '#ffffff',
            zIndex: 4
          }} />
        </div>
      )}
      
      {/* Layout K - horizontal line only */}
      {layout.id === 'K' && (
        <div style={{
          position: 'absolute',
          left: `${innerAreaX}px`,
          top: `${innerAreaY}px`,
          width: `${innerAreaWidth}px`,
          height: `${innerAreaHeight}px`,
          zIndex: 4,
          pointerEvents: 'none'
        }}>
          {/* Horizontal line at 50% */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: `${innerAreaHeight * 0.5}px`,
            width: '100%',
            height: '1px',
            backgroundColor: '#ffffff',
            zIndex: 4 
          }} />
        </div>
      )}

      {/* Layout A - horizontal lines only */}
      {layout.id === 'A' && (
        <div style={{
          position: 'absolute',
          left: `${innerAreaX}px`,
          top: `${innerAreaY}px`,
          width: `${innerAreaWidth}px`,
          height: `${innerAreaHeight}px`,
          zIndex: 4,
          pointerEvents: 'none'
        }}>
          {/* Horizontal line at 33% */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: `${innerAreaHeight * 0.33}px`,
            width: `${innerAreaWidth * 0.5}px`, // Only for half width
            height: '1px',
            backgroundColor: '#ffffff',
            zIndex: 4 
          }} />

          {/* Horizontal line at 66% */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: `${innerAreaHeight * 0.66}px`,
            width: `${innerAreaWidth * 0.5}px`, // Only for half width
            height: '1px', 
            backgroundColor: '#ffffff',
            zIndex: 4
          }} />
        </div>
      )}

      {/* Layout B,C,D - horizontal lines only */}
      {(layout.id === 'B' || layout.id === 'C' || layout.id === 'D') && (
        <div style={{
          position: 'absolute',
          left: `${innerAreaX}px`,
          top: `${innerAreaY}px`,
          width: `${innerAreaWidth}px`,
          height: `${innerAreaHeight}px`,
          zIndex: 4,
          pointerEvents: 'none'
        }}>
          {/* Four image layout with three horizontal lines */}
          {[0.25, 0.5, 0.75].map((yPos, idx) => (
            <div 
              key={idx}
              style={{
                position: 'absolute',
                left: layout.id === 'C' ? `${innerAreaWidth * 0.5}px` : 0,
                top: `${innerAreaHeight * yPos}px`,
                width: `${innerAreaWidth * 0.5}px`,
                height: '1px',
                backgroundColor: '#ffffff',
                zIndex: 4 
              }} 
            />
          ))}
        </div>
      )}
      
      {/* Footer with date - now properly positioned */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: `${innerAreaX}px`,
        width: `${innerAreaWidth}px`,
        height: '30px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        zIndex: 10
      }}>
        Zekey's Photo Booth - {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

  return (
    <div className="editing-container">
      <div className="image-selection-header">
        <h2>Choose Photos for Your Layout</h2>
      </div>

      {/* Image selection pool */}
      <div className="available-images">
        <h3>Available Photos</h3>
        <div className="image-pool" style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '10px', 
          justifyContent: 'center' 
        }}>
          {capturedImages.map((img, idx) => 
            img ? (
              <div 
                key={idx}
                style={{
                  position: 'relative',
                  width: '220px',
                  height: '220px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: selectedPositions.includes(idx) ? '3px solid #007bff' : '1px solid #ddd',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  // Find the first empty position
                  const emptyPosIndex = selectedPositions.findIndex(pos => pos === null);
                  if (emptyPosIndex !== -1) {
                    selectImageForPosition(emptyPosIndex, idx);
                  } else if (!selectedPositions.includes(idx)) {
                    // If all positions are filled, replace the first one
                    selectImageForPosition(0, idx);
                  }
                }}
              >
                <img 
                  src={img} 
                  alt={`Image ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                {selectedPositions.includes(idx) && (
                  <div style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '10px'
                  }}>
                    Position {selectedPositions.indexOf(idx) + 1}
                  </div>
                )}
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Side by side layout for final preview and editing controls */}
      <div className="editing-layout" style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        gap: '20px',
        margin: '30px 0',
        flexWrap: 'wrap' 
      }}>
        <div className="preview-side" style={{ flex: '1', minWidth: '300px' }}>
          <h3>Final Preview</h3>
          <div className="final-preview-container" style={{
            borderRadius: '4px',
            padding: '10px',
            minHeight: '300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
           {renderLayoutPreview()}
          </div>
          <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
            Layout {selectedLayout} - {layout?.size} - {layout?.imageCount} photo{layout?.imageCount > 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="editing-controls" style={{ flex: '1', minWidth: '300px' }}>
          {/* Frame selection section */}
          <div className="frame-section" style={{ marginBottom: '20px' }}>
            <h3>Choose Frame Style</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {frames.map(frame => (
                <div 
                  key={frame.id}
                  style={{
                    width: '100px',
                    height: '130px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: selectedFrame && selectedFrame.id === frame.id ? '3px solid #007bff' : '1px solid #ddd',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    backgroundColor: frame.backgroundColor || '#f9f9f9',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                  }}
                  onClick={() => {
                    setSelectedFrame(frame);
                    setIsLoading(true);
                  }}
                >
                  <div style={{ 
                    fontSize: '14px', 
                    color: frame.backgroundColor === '#000000' ? 'white' : 'black',
                    textAlign: 'center',
                    padding: '2px'
                  }}>
                    {frame.name}
                  </div>
                  
                  {/* Mini preview of frame style features */}
                  {frame.id === 'film-frame' && (
                    <>
                      <div style={{ 
                        position: 'absolute', 
                        left: '3px', 
                        top: '20px',
                        width: '4px',
                        height: '4px',
                        backgroundColor: 'white',
                        borderRadius: '50%'
                      }}></div>
                      <div style={{ 
                        position: 'absolute', 
                        right: '3px', 
                        top: '20px',
                        width: '4px',
                        height: '4px',
                        backgroundColor: 'white',
                        borderRadius: '50%'
                      }}></div>
                    </>
                  )}
                </div>
              ))}
              {/* Option to use just border color (no frame) */}
              <div 
                key="no-frame"
                style={{
                  width: '100px',
                  height: '130px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: !selectedFrame ? '3px solid #007bff' : '1px solid #ddd',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  backgroundColor: '#f9f9f9',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  
                }}
                onClick={() => {
                  setSelectedFrame(null);
                  setIsLoading(true);
                }}
              >
                <div style={{ 
                  fontSize: '14px', 
                  color: 'black',
                  textAlign: 'center',
                  padding: '2px'
                }}>
                  No Frame
                </div>
              </div>
            </div>
          </div>

          <div className="filter-section" style={{ marginBottom: '20px' }}>
            <h3>Choose Filter</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {filters.map(filter => (
                <div 
                  key={filter.value}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: selectedFilter === filter.value ? '#007bff' : '#f0f0f0',
                    color: selectedFilter === filter.value ? 'white' : 'black',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => {
                    setSelectedFilter(filter.value);
                    setIsLoading(true);
                  }}
                >
                  {filter.name}
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-section" style={{ marginBottom: '20px' }}>
            <h3>{selectedFrame ? 'Choose Alternative Border Color' : 'Choose Border Color'}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {borderColors.map(color => (
                <div 
                  key={color}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: color,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: borderColor === color ? '3px solid #007bff' : '1px solid #ddd',
                    boxSizing: 'border-box',
                    opacity: selectedFrame ? 0.5 : 1 // Dim if frame is selected
                  }}
                  onClick={() => {
                    setBorderColor(color);
                    setIsLoading(true);
                  }}
                />
              ))}
            </div>
            {selectedFrame && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Note: Frame style overrides border color
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
            <button 
              style={{
                padding: '15px 25px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                borderRadius: '4px',
                cursor: finalImageUrl ? 'pointer' : 'not-allowed',
                opacity: finalImageUrl ? 1 : 0.6
              }}
              onClick={downloadPhoto}
              disabled={!finalImageUrl}
            >
              Download Photo
            </button>
            <button 
              style={{
                padding: '15px 25px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
              onClick={resetAndRetake}
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editing;