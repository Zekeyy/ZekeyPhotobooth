/**
 * Renders the final composite image to the canvas
 * @param {HTMLCanvasElement} canvas - The canvas element to draw on
 * @param {string} selectedLayoutId - ID of the selected layout
 * @param {Array} layouts - Array of available layouts
 * @param {Array} imageData - Array of image data URLs positioned according to layout
 * @param {string} borderColor - Selected border color
 * @param {string} filterType - Selected filter type
 * @param {Function} applyFilterFn - Function to apply filters
 * @param {Object} selectedFrame - Selected frame object with style information
 * @returns {Promise<string>} - Promise resolving to data URL of the rendered image
 */

export const renderFinalImage = async (
  canvas, 
  selectedLayoutId, 
  layouts, 
  imageData, 
  borderColor, 
  filterType, 
  applyFilterFn,
  selectedFrame
) => {
  return new Promise((resolve) => {
    const ctx = canvas.getContext('2d');
    const layout = layouts.find(l => l.id === selectedLayoutId);
    if (!layout) {
      resolve(null);
      return;
    }
    
    // Check if we have any images to render
    const validImagesExist = imageData && imageData.some(img => img !== null);
    if (!validImagesExist) {
      resolve(null);
      return;
    }
    
    // Set canvas dimensions based on layout orientation
    let canvasWidth, canvasHeight;
    if (layout.orientation === 'portrait') {
      canvasWidth = 600;
      canvasHeight = 900;
    } else {
      canvasWidth = 900;
      canvasHeight = 600;
    }
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Get frame or border properties
    const frameOrBorderColor = selectedFrame ? selectedFrame.borderColor || borderColor : borderColor;
    const borderWidth = selectedFrame ? selectedFrame.borderWidth || 10 : 10;
    
    // Fill canvas with frame/border color
    ctx.fillStyle = frameOrBorderColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Adjust the frame for the current layout if needed
    let frameToUse = selectedFrame;
    if (selectedFrame && selectedFrame.adjustForOrientation) {
      // This would implement the adjustFrameForLayout function logic
      const layoutSize = layout.size || '3x3';
      const layoutOrientation = layout.orientation || 'portrait';
      
      frameToUse = { ...selectedFrame };
      
      // Adjust hole positions based on orientation
      if (frameToUse.holes) {
        if (layoutOrientation === 'portrait') {
          if (frameToUse.holes.position === 'sides') {
            frameToUse.holePositions = ['left', 'right'];
          } else {
            frameToUse.holePositions = ['top', 'bottom'];
          }
        } else { // landscape
          if (frameToUse.holes.position === 'sides') {
            frameToUse.holePositions = ['top', 'bottom'];
          } else {
            frameToUse.holePositions = ['left', 'right'];
          }
        }
      }
      
      // Adjust border widths for different layout sizes
      if (layoutSize === '6x2') {
        // For narrower layouts, reduce border width slightly
        frameToUse.borderWidth = Math.max(8, Math.floor(selectedFrame.borderWidth * 0.8));
        if (frameToUse.matWidth) {
          frameToUse.matWidth = Math.max(15, Math.floor(selectedFrame.matWidth * 0.7));
        }
      }
    }
    
    // Handle film frame with holes
    if (frameToUse && frameToUse.id === 'film-frame' && frameToUse.holes) {
      // Draw holes based on hole positions
      if (frameToUse.holePositions && frameToUse.holes) {
        ctx.fillStyle = "#000000"; // Film strip is always black for the background
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        const holeDiameter = frameToUse.holes.size || 7;
        const holeSpacing = frameToUse.holes.spacing || 36;
        
        // Calculate how many holes we need
        let holeCount;
        
        if (frameToUse.holePositions.includes('left') || frameToUse.holePositions.includes('right')) {
          holeCount = Math.floor(canvasHeight / holeSpacing);
        } else {
          holeCount = Math.floor(canvasWidth / holeSpacing);
        }
        
        ctx.fillStyle = frameToUse.holes.color || "#ffffff";
        
        for (let i = 0; i < holeCount; i++) {
          if (frameToUse.holePositions.includes('left')) {
            const centerY = i * holeSpacing + holeSpacing / 2;
            ctx.beginPath();
            ctx.arc(borderWidth / 2, centerY, holeDiameter / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          
          if (frameToUse.holePositions.includes('right')) {
            const centerY = i * holeSpacing + holeSpacing / 2;
            ctx.beginPath();
            ctx.arc(canvasWidth - borderWidth / 2, centerY, holeDiameter / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          
          if (frameToUse.holePositions.includes('top')) {
            const centerX = i * holeSpacing + holeSpacing / 2;
            ctx.beginPath();
            ctx.arc(centerX, borderWidth / 2, holeDiameter / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          
          if (frameToUse.holePositions.includes('bottom')) {
            const centerX = i * holeSpacing + holeSpacing / 2;
            ctx.beginPath();
            ctx.arc(centerX, canvasHeight - borderWidth / 2, holeDiameter / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    
    // Handle matted frame
    if (frameToUse && frameToUse.matWidth) {
      const matWidth = frameToUse.matWidth;
      ctx.fillStyle = frameToUse.matColor || "#f5f5f5";
      ctx.fillRect(
        borderWidth, 
        borderWidth, 
        canvasWidth - borderWidth * 2, 
        canvasHeight - borderWidth * 2
      );
      
      // Inner area for photos
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(
        borderWidth + matWidth, 
        borderWidth + matWidth, 
        canvasWidth - (borderWidth + matWidth) * 2, 
        canvasHeight - (borderWidth + matWidth) * 2
      );
    } else if (frameToUse && frameToUse.edgeEffect && frameToUse.edgeEffect.type === 'wrap') {
      // Handle canvas wrap effect
      const wrapDepth = frameToUse.edgeEffect.depth || 20;
      const wrapColor = frameToUse.edgeEffect.color || "#FAFAFA";
      
      // Draw side edges for canvas wrap effect
      ctx.fillStyle = wrapColor;
      // Left edge
      ctx.fillRect(0, 0, wrapDepth, canvasHeight);
      // Right edge
      ctx.fillRect(canvasWidth - wrapDepth, 0, wrapDepth, canvasHeight);
      // Top edge
      ctx.fillRect(0, 0, canvasWidth, wrapDepth);
      // Bottom edge
      ctx.fillRect(0, canvasHeight - wrapDepth, canvasWidth, wrapDepth);
      
      // Create shadow effect for canvas wrap
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
    } else if (frameToUse && frameToUse.floatEffect) {
      // Handle floating frame effect
      const floatDistance = frameToUse.floatEffect.distance || 10;
      const floatBgColor = frameToUse.floatEffect.backgroundColor || "#ffffff";
      
      // Draw the shadow first
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 8;
      ctx.shadowOffsetY = 8;
      
      // Draw the background with shadow
      ctx.fillStyle = floatBgColor;
      ctx.fillRect(floatDistance, floatDistance, canvasWidth - floatDistance * 2, canvasHeight - floatDistance * 2);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    } else {
      // Standard frame with inner area
      // Create inner area for photos if we have an inner border
      if (frameToUse && frameToUse.innerBorderWidth) {
        const innerBorderWidth = frameToUse.innerBorderWidth;
        ctx.fillStyle = frameToUse.innerBorderColor || "#ffffff";
        ctx.fillRect(
          borderWidth, 
          borderWidth, 
          canvasWidth - borderWidth * 2, 
          canvasHeight - borderWidth * 2
        );
        
        // White inner area inside the inner border
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
          borderWidth + innerBorderWidth, 
          borderWidth + innerBorderWidth, 
          canvasWidth - (borderWidth + innerBorderWidth) * 2, 
          canvasHeight - (borderWidth + innerBorderWidth) * 2
        );
      } else {
        // Standard white inner area
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
          borderWidth, 
          borderWidth, 
          canvasWidth - borderWidth * 2, 
          canvasHeight - borderWidth * 2
        );
      }
    }
    
    // Draw decorations if frame has them
    if (frameToUse && frameToUse.decorations) {
      frameToUse.decorations.forEach(deco => {
        if (deco.type === 'star') {
          ctx.fillStyle = deco.color;
          ctx.font = `${deco.size}px Arial`;
          // Convert percentage position to pixels
          const x = typeof deco.x === 'string' && deco.x.includes('%') 
            ? parseInt(deco.x) / 100 * canvasWidth 
            : parseInt(deco.x);
          const y = typeof deco.y === 'string' && deco.y.includes('%') 
            ? parseInt(deco.y) / 100 * canvasHeight 
            : parseInt(deco.y);
          ctx.fillText('★', x, y);
        } else if (deco.type === 'circle') {
          ctx.fillStyle = deco.color;
          // Convert percentage position to pixels
          const x = typeof deco.x === 'string' && deco.x.includes('%') 
            ? parseInt(deco.x) / 100 * canvasWidth 
            : parseInt(deco.x);
          const y = typeof deco.y === 'string' && deco.y.includes('%') 
            ? parseInt(deco.y) / 100 * canvasHeight 
            : parseInt(deco.y);
          ctx.beginPath();
          ctx.arc(x, y, deco.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }
 
    // Calculate the inner drawing area based on frame type
    let innerAreaX, innerAreaY, innerAreaWidth, innerAreaHeight;
    
    if (frameToUse && frameToUse.matWidth) {
      // For matted frames
      const matWidth = frameToUse.matWidth;
      innerAreaX = borderWidth + matWidth;
      innerAreaY = borderWidth + matWidth;
      innerAreaWidth = canvasWidth - (borderWidth + matWidth) * 2;
      innerAreaHeight = canvasHeight - (borderWidth + matWidth) * 2;
    } else if (frameToUse && frameToUse.innerBorderWidth) {
      // For frames with inner borders
      const innerBorderWidth = frameToUse.innerBorderWidth;
      innerAreaX = borderWidth + innerBorderWidth;
      innerAreaY = borderWidth + innerBorderWidth;
      innerAreaWidth = canvasWidth - (borderWidth + innerBorderWidth) * 2;
      innerAreaHeight = canvasHeight - (borderWidth + innerBorderWidth) * 2;
    } else if (frameToUse && frameToUse.edgeEffect) {
      // For canvas wrap
      const wrapDepth = frameToUse.edgeEffect.depth || 20;
      innerAreaX = wrapDepth;
      innerAreaY = wrapDepth;
      innerAreaWidth = canvasWidth - wrapDepth * 2;
      innerAreaHeight = canvasHeight - wrapDepth * 2;
    } else if (frameToUse && frameToUse.floatEffect) {
      // For floating frames
      const floatDistance = frameToUse.floatEffect.distance || 10;
      innerAreaX = floatDistance;
      innerAreaY = floatDistance;
      innerAreaWidth = canvasWidth - floatDistance * 2;
      innerAreaHeight = canvasHeight - floatDistance * 2;
    } else {
      // Standard frames
      innerAreaX = borderWidth;
      innerAreaY = borderWidth;
      innerAreaWidth = canvasWidth - borderWidth * 2;
      innerAreaHeight = canvasHeight - borderWidth * 2;
    }
    
    // Load images that are not null
    const loadImagesPromises = [];
    
    layout.positions.forEach((pos, posIndex) => {
      // Only load if we have an image for this position
      if (posIndex < imageData.length && imageData[posIndex]) {
        const img = new Image();
        const loadPromise = new Promise((resolve) => {
          img.onload = () => resolve({ img, posIndex });
          img.onerror = () => {
            console.error(`Failed to load image for position ${posIndex}`);
            resolve({ img: null, posIndex });
          };
          img.src = imageData[posIndex];
        });
        loadImagesPromises.push(loadPromise);
      }
    });
    
    // Skip rendering if no valid images
    if (loadImagesPromises.length === 0) {
      resolve(null);
      return;
    }
    
    // Draw images once they're all loaded
    Promise.all(loadImagesPromises).then(loadedImages => {
      // Draw each image in its position
      loadedImages.forEach(({ img, posIndex }) => {
        if (!img || posIndex >= layout.positions.length) return;
        
        const pos = layout.positions[posIndex];
        
        // Calculate exact position based on inner area
        const x = innerAreaX + (pos.x * innerAreaWidth);
        const y = innerAreaY + (pos.y * innerAreaHeight);
        const width = pos.width * innerAreaWidth;
        const height = pos.height * innerAreaHeight;
        
        // Draw white borders around each image
        const photoBorderWidth = 5;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x, y, width, height);
        
        // Draw the image inside the border
        ctx.drawImage(
          img, 
          x + photoBorderWidth, 
          y + photoBorderWidth, 
          width - (photoBorderWidth * 2), 
          height - (photoBorderWidth * 2)
        );
      });
      
      // Apply selected filter if any
      if (filterType !== 'none') {
        applyFilterFn(ctx, canvas.width, canvas.height, filterType);
      }
      
      // Add text labels from frame
      if (frameToUse) {
        if (frameToUse.bottomText) {
          const textStyle = frameToUse.textStyle || {};
          ctx.font = textStyle.fontSize ? `${textStyle.fontSize}px ${textStyle.fontFamily || 'Arial'}` : '24px Arial';
          ctx.fillStyle = textStyle.color || '#000000';
          
          const textWidth = ctx.measureText(frameToUse.bottomText).width;
          const x = (canvasWidth - textWidth) / 2;
          const y = canvasHeight - borderWidth / 2;
          
          ctx.fillText(frameToUse.bottomText, x, y);
        }
        
        if (frameToUse.textLabels) {
          frameToUse.textLabels.forEach(label => {
            const textStyle = frameToUse.textStyle || {};
            ctx.font = textStyle.fontSize ? `${textStyle.fontSize}px ${textStyle.fontFamily || 'Arial'}` : '18px Arial';
            ctx.fillStyle = label.color || textStyle.color || '#000000';
            
            // Convert percentage position to pixels
            const y = typeof label.y === 'string' && label.y.includes('%') 
              ? parseInt(label.y) / 100 * canvasHeight 
              : parseInt(label.y);
            
            const textWidth = ctx.measureText(label.text).width;
            const x = textStyle.textAlign === 'center' ? (canvasWidth - textWidth) / 2 : canvasWidth - textWidth - borderWidth;
            
            ctx.fillText(label.text, x, y);
          });
        }
      }
      
      // Add footer with date
      const footerY = canvasHeight - 30;
      ctx.fillStyle = frameOrBorderColor; // Use border color for footer background too
      ctx.fillRect(0, footerY, canvasWidth, 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      const date = new Date().toLocaleDateString();
      ctx.fillText(`Zekey's Photo Booth - ${date}`, 20, footerY + 20);
      
      // Now resolve with the data URL after all drawing is complete
      resolve(canvas.toDataURL('image/jpeg', 1.0)); // Add quality parameter
    });
  });
};
  /**
   * Applies various image filters to the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @param {string} filterType - Type of filter to apply
   */
  export const applyFilter = (ctx, width, height, filterType) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    switch (filterType) {
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;     // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
        }
        break;
        
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        break;
        
      case 'cool':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Cool blue tint
          data[i] = r * 0.8;      // reduce red
          data[i + 1] = g * 0.9;  // slightly reduce green
          data[i + 2] = Math.min(255, b * 1.2); // enhance blue
        }
        break;
        
      case 'vintage':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Vintage look (sepia + lower contrast)
          data[i] = Math.min(255, (r * 0.9) + (g * 0.2) + (b * 0.1) + 20);
          data[i + 1] = Math.min(255, (r * 0.22) + (g * 0.9) + (b * 0.1) + 10);
          data[i + 2] = Math.min(255, (r * 0.22) + (g * 0.2) + (b * 0.9));
        }
        break;
        
      default:
        // No filter
        break;
    }
    
    ctx.putImageData(imageData, 0, 0);
  };