import React from 'react';

/**
 * Renders a preview of a photo booth layout
 * @param {Object} layout - The layout configuration object
 * @returns {JSX.Element} - The layout preview component
 */
export const renderLayoutPreview = (layout) => {
  const isPortrait = layout.orientation === 'portrait';
  const previewWidth = isPortrait ? 80 : 120;
  const previewHeight = isPortrait ? 120 : 80;
  
  return (
    <div className="layout-preview" style={{ 
      width: `${previewWidth}px`, 
      height: `${previewHeight}px`,
      backgroundColor: '#000000',
      padding: '2px',
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      {layout.positions.map((pos, idx) => (
        <div 
          key={idx}
          style={{
            position: 'absolute',
            left: `${pos.x * previewWidth + 2}px`,
            top: `${pos.y * previewHeight + 2}px`,
            width: `${pos.width * previewWidth - 4}px`,
            height: `${pos.height * previewHeight - 4}px`,
            backgroundColor: '#ffffff',
            border: '1px solid #dddddd'
          }}
        />
      ))}
    </div>
  );
};