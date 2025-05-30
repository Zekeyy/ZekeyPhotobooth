import React from 'react';
import { renderLayoutPreview } from '../utils/layoutUtils';

const LayoutSelection = ({ layouts, selectedLayout, onLayoutSelect, onProceed }) => {
  return (
    <div className="layout-selection">
      <h2>Choose a Layout</h2>
      <div className="layout-grid">
        {layouts.map(layout => (
          <div 
            key={layout.id}
            className={`layout-option ${selectedLayout === layout.id ? 'selected' : ''}`}
            onClick={() => onLayoutSelect(layout.id)}
          >
            {renderLayoutPreview(layout)}
            <div className="layout-info">
              <p>Layout {layout.id}</p>
              <p className="layout-size">Size: {layout.size}</p>
              <p>({layout.imageCount} photo{layout.imageCount > 1 ? 's' : ''})</p>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="proceed-button" 
        onClick={onProceed}
        disabled={!selectedLayout}
      >
        Continue to Camera
      </button>
    </div>
  );
};

export default LayoutSelection;