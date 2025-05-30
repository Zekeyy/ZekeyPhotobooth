// frames.js - Enhanced definitions for professional and elegant photo frames
const frames = [
  // Classic Black Frame - Simple, elegant black frame suitable for all layouts
  {
    id: 'classic-black',
    name: 'Classic Black',
    borderWidth: 12,
    borderColor: '#000000',
    innerBorderWidth: 2,
    innerBorderColor: '#ffffff',
    orientation: 'universal',
    backgroundColor: '#000000',
    style: {
      border: '12px solid #000000',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      position: 'relative',
      padding: '2px',
      boxSizing: 'border-box'
    }
  },
  
  // Minimalist White Frame - Clean, modern look for any layout
  {
    id: 'minimalist-white',
    name: 'Minimalist White',
    borderWidth: 15,
    borderColor: '#ffffff',
    orientation: 'universal',
    backgroundColor: '#ffffff',
    style: {
      border: '15px solid #ffffff',
      boxShadow: '0 3px 6px rgba(0,0,0,0.08), 0 3px 6px rgba(0,0,0,0.12)',
      position: 'relative'
    }
  },
  
  // Premium Gold Frame - Elegant gold trim for special occasions
  {
    id: 'premium-gold',
    name: 'Premium Gold',
    borderWidth: 15,
    borderColor: '#d4af37',
    innerBorderWidth: 3,
    innerBorderColor: '#ffffff',
    orientation: 'universal',
    backgroundColor: '#d4af37',
    style: {
      border: '15px solid #d4af37',
      backgroundImage: 'linear-gradient(45deg, #d4af37 25%, #e5c54e 25%, #e5c54e 50%, #d4af37 50%, #d4af37 75%, #e5c54e 75%, #e5c54e 100%)',
      backgroundSize: '10px 10px',
      padding: '3px',
      boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
    }
  },
  
  // Film Frame - Refined version of the filmstrip for photography enthusiasts
  {
    id: 'film-frame',
    name: 'Professional Film',
    borderWidth: 18,
    borderColor: '#1a1a1a',
    orientation: 'universal',
    backgroundColor: '#1a1a1a',
    style: {
      border: '18px solid #1a1a1a',
      position: 'relative',
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
    },
    holes: {
      position: 'sides', // 'sides' for portrait, 'top-bottom' for landscape
      size: 7,
      spacing: 36,
      color: '#000000'
    },
    adjustForOrientation: true // This will make the holes appear on the correct sides based on orientation
  },
  
  // Matted Frame - Gallery-style matted frame
  {
    id: 'gallery-matted',
    name: 'Gallery Matted',
    borderWidth: 12,
    borderColor: '#2c2c2c',
    matWidth: 30, // Extra wide mat for gallery look
    matColor: '#f5f5f5',
    orientation: 'universal',
    backgroundColor: '#2c2c2c',
    style: {
      border: '12px solid #2c2c2c',
      padding: '30px',
      backgroundColor: '#f5f5f5',
      boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
    }
  },
  
  // Wooden Frame - Natural wood look
  {
    id: 'natural-wood',
    name: 'Natural Wood',
    borderWidth: 18,
    borderColor: '#8B4513',
    innerBorderWidth: 2,
    innerBorderColor: '#f5f5f5',
    orientation: 'universal',
    backgroundColor: '#8B4513',
    style: {
      border: '18px solid #8B4513',
      backgroundImage: 'url("../frames/wood-texture.png")',
      backgroundSize: 'cover',
      padding: '2px',
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
    }
  },
  
  // Silver Frame - Modern metallic look
  {
    id: 'modern-silver',
    name: 'Modern Silver',
    borderWidth: 10,
    borderColor: '#C0C0C0',
    orientation: 'universal',
    backgroundColor: '#C0C0C0',
    style: {
      border: '10px solid #C0C0C0',
      backgroundImage: 'linear-gradient(45deg, #C0C0C0, #E8E8E8, #C0C0C0, #ABABAB, #C0C0C0)',
      backgroundSize: '100% 100%',
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
    }
  },
  
  // Brushed Metal - For a contemporary look
  {
    id: 'brushed-metal',
    name: 'Brushed Metal',
    borderWidth: 14,
    borderColor: '#7A7A7A',
    orientation: 'universal',
    backgroundColor: '#7A7A7A',
    style: {
      border: '14px solid #7A7A7A',
      backgroundImage: 'url("../frames/brushed-metal.png")',
      backgroundSize: 'cover',
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
    }
  },
  
  // Canvas Wrap - Simulates a gallery canvas wrap
  {
    id: 'canvas-wrap',
    name: 'Canvas Wrap',
    borderWidth: 20,
    borderColor: '#FAFAFA',
    orientation: 'universal',
    backgroundColor: '#FAFAFA',
    style: {
      border: '0',
      padding: '0',
      position: 'relative',
      boxShadow: '8px 8px 10px rgba(0,0,0,0.1)'
    },
    edgeEffect: {
      type: 'wrap',
      depth: 20,
      color: '#FAFAFA'
    }
  },
  
  // Floating Frame - Modern minimal float effect
  {
    id: 'floating',
    name: 'Floating Frame',
    borderWidth: 0,
    shadowWidth: 15,
    orientation: 'universal',
    style: {
      border: '0',
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
      margin: '15px',
      position: 'relative'
    },
    floatEffect: {
      distance: 10,
      backgroundColor: '#ffffff'
    }
  },
  
  // Christmas Frame - Traditional Christmas theme
  {
    id: 'christmas-traditional',
    name: 'Traditional Christmas',
    borderWidth: 16,
    borderColor: '#aa0505',
    innerBorderWidth: 3,
    innerBorderColor: '#ffffff',
    orientation: 'universal',
    backgroundColor: '#aa0505',
    style: {
      border: '16px solid #aa0505',
      backgroundImage: 'url("../frames/christmas-pattern.png")',
      backgroundSize: 'cover',
      padding: '3px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.19)'
    }
  },
  
  // Christmas Snowflakes Frame
  {
    id: 'christmas-snow',
    name: 'Christmas Snowflakes',
    borderWidth: 14,
    borderColor: '#2c4770',
    innerBorderWidth: 2,
    innerBorderColor: '#ffffff',
    orientation: 'universal',
    backgroundColor: '#2c4770',
    style: {
      border: '14px solid #2c4770',
      backgroundImage: 'url("../frames/christmas-snowflakes.png")',
      backgroundSize: 'cover',
      padding: '2px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)'
    }
  },
  
  // Christmas Holly Frame
  {
    id: 'christmas-holly',
    name: 'Christmas Holly',
    borderWidth: 15,
    borderColor: '#0a5828',
    innerBorderWidth: 2,
    innerBorderColor: '#ffffff',
    orientation: 'universal',
    backgroundColor: '#0a5828',
    style: {
      border: '15px solid #0a5828',
      backgroundImage: 'url("../frames/christmas-holly.png")',
      backgroundSize: 'cover',
      padding: '2px',
      boxShadow: '0 6px 10px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)'
    }
  },
  
  // Valentine's Day Hearts Frame
  {
    id: 'valentines-hearts',
    name: 'Valentine Hearts',
    borderWidth: 15,
    borderColor: '#e91e63',
    innerBorderWidth: 2,
    innerBorderColor: '#ffffff',
    orientation: 'universal',
    backgroundColor: '#e91e63',
    style: {
      border: '15px solid #e91e63',
      backgroundImage: 'url("../frames/valentines-hearts.png")',
      backgroundSize: 'cover',
      padding: '2px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)'
    }
  },
  
  // Valentine's Day Roses Frame
  {
    id: 'valentines-roses',
    name: 'Valentine Roses',
    borderWidth: 16,
    borderColor: '#9c27b0',
    innerBorderWidth: 3,
    innerBorderColor: '#f8bbd0',
    orientation: 'universal',
    backgroundColor: '#9c27b0',
    style: {
      border: '16px solid #9c27b0',
      backgroundImage: 'url("../frames/valentines-roses.png")',
      backgroundSize: 'cover',
      padding: '3px',
      boxShadow: '0 6px 10px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)'
    }
  },
  
  // Valentine's Day Lace Frame
  {
    id: 'valentines-lace',
    name: 'Valentine Lace',
    borderWidth: 14,
    borderColor: '#d81b60',
    innerBorderWidth: 2,
    innerBorderColor: '#ffffff',
    orientation: 'universal',
    backgroundColor: '#d81b60',
    style: {
      border: '14px solid #d81b60',
      backgroundImage: 'url("../frames/valentines-lace.png")',
      backgroundSize: 'cover',
      padding: '2px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)'
    }
  },
  
  // Easter Eggs Frame
  {
    id: 'easter-eggs',
    name: 'Easter Eggs',
    borderWidth: 14,
    borderColor: '#8bc34a',
    innerBorderWidth: 2,
    innerBorderColor: '#ffffff',
    orientation: 'universal',
    backgroundColor: '#8bc34a',
    style: {
      border: '14px solid #8bc34a',
      backgroundImage: 'url("../frames/easter-eggs.png")',
      backgroundSize: 'cover',
      padding: '2px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)'
    }
  },
  
  // Easter Flowers Frame
  {
    id: 'easter-flowers',
    name: 'Easter Flowers',
    borderWidth: 15,
    borderColor: '#9575cd',
    innerBorderWidth: 2,
    innerBorderColor: '#ffffff',
    orientation: 'universal',
    backgroundColor: '#9575cd',
    style: {
      border: '15px solid #9575cd',
      backgroundImage: 'url("../frames/easter-flowers.png")',
      backgroundSize: 'cover',
      padding: '2px',
      boxShadow: '0 6px 10px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)'
    }
  },
  
  // Easter Bunnies Frame
  {
    id: 'easter-bunnies',
    name: 'Easter Bunnies',
    borderWidth: 16,
    borderColor: '#ffb74d',
    innerBorderWidth: 3,
    innerBorderColor: '#ffffff',
    orientation: 'universal',
    backgroundColor: '#ffb74d',
    style: {
      border: '16px solid #ffb74d',
      backgroundImage: 'url("../frames/easter-bunnies.png")',
      backgroundSize: 'cover',
      padding: '3px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.19)'
    }
  },
  
  // Minimalist Dots Frame
  {
    id: 'minimalist-dots',
    name: 'Minimalist Dots',
    borderWidth: 12,
    borderColor: '#eceff1',
    innerBorderWidth: 0,
    orientation: 'universal',
    backgroundColor: '#eceff1',
    style: {
      border: '12px solid #eceff1',
      backgroundImage: 'url("../frames/minimalist-dots.png")',
      backgroundSize: 'cover',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)'
    }
  },
  
  // Minimalist Lines Frame
  {
    id: 'minimalist-lines',
    name: 'Minimalist Lines',
    borderWidth: 14,
    borderColor: '#cfd8dc',
    innerBorderWidth: 0,
    orientation: 'universal',
    backgroundColor: '#cfd8dc',
    style: {
      border: '14px solid #cfd8dc',
      backgroundImage: 'url("../frames/minimalist-lines.png")',
      backgroundSize: 'cover',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)'
    }
  },
  
  // Minimalist Grid Frame
  {
    id: 'minimalist-grid',
    name: 'Minimalist Grid',
    borderWidth: 16,
    borderColor: '#e0e0e0',
    innerBorderWidth: 0,
    orientation: 'universal',
    backgroundColor: '#e0e0e0',
    style: {
      border: '16px solid #e0e0e0',
      backgroundImage: 'url("../frames/minimalist-grid.png")',
      backgroundSize: 'cover',
      boxShadow: '0 3px 6px rgba(0,0,0,0.06), 0 3px 6px rgba(0,0,0,0.03)'
    }
  },
  
  // Halloween Webs Frame
  {
    id: 'halloween-webs',
    name: 'Halloween Webs',
    borderWidth: 16,
    borderColor: '#37474f',
    innerBorderWidth: 3,
    innerBorderColor: '#ff9800',
    orientation: 'universal',
    backgroundColor: '#37474f',
    style: {
      border: '16px solid #37474f',
      backgroundImage: 'url("../frames/halloween-webs.png")',
      backgroundSize: 'cover',
      padding: '3px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.3), 0 6px 20px rgba(0,0,0,0.19)'
    }
  },
  
  // Halloween Pumpkins Frame
  {
    id: 'halloween-pumpkins',
    name: 'Halloween Pumpkins',
    borderWidth: 16,
    borderColor: '#ff5722',
    innerBorderWidth: 3,
    innerBorderColor: '#212121',
    orientation: 'universal',
    backgroundColor: '#ff5722',
    style: {
      border: '16px solid #ff5722',
      backgroundImage: 'url("../frames/halloween-pumpkins.png")',
      backgroundSize: 'cover',
      padding: '3px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.3), 0 6px 20px rgba(0,0,0,0.19)'
    }
  },
  
  // Halloween Bats Frame
  {
    id: 'halloween-bats',
    name: 'Halloween Bats',
    borderWidth: 15,
    borderColor: '#6a1b9a',
    innerBorderWidth: 2,
    innerBorderColor: '#b388ff',
    orientation: 'universal',
    backgroundColor: '#6a1b9a',
    style: {
      border: '15px solid #6a1b9a',
      backgroundImage: 'url("../frames/halloween-bats.jpg")',
      backgroundSize: 'cover',
      padding: '2px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.3), 0 6px 20px rgba(0,0,0,0.19)'
    }
  },
  
  // Birthday Confetti Frame
  {
    id: 'birthday-confetti',
    name: 'Birthday Confetti',
    borderWidth: 16,
    borderColor: '#fdd835',
    innerBorderWidth: 3,
    innerBorderColor: '#ffffff',
    orientation: 'universal',
    backgroundColor: '#fdd835',
    style: {
      border: '16px solid #fdd835',
      backgroundImage: 'url("../frames/birthday-confetti.png")',
      backgroundSize: 'cover',
      padding: '3px',
      boxShadow: '0 6px 10px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)'
    }
  },
  
  // Birthday Balloons Frame
  {
    id: 'birthday-balloons',
    name: 'Birthday Balloons',
    borderWidth: 14,
    borderColor: '#4fc3f7',
    innerBorderWidth: 2,
    innerBorderColor: '#ffffff',
    orientation: 'universal',
    backgroundColor: '#4fc3f7',
    style: {
      border: '14px solid #4fc3f7',
      backgroundImage: 'url("../frames/birthday-balloons.png")',
      backgroundSize: 'cover',
      padding: '2px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)'
    }
  },
  
  // Birthday Streamers Frame
  {
    id: 'birthday-streamers',
    name: 'Birthday Streamers',
    borderWidth: 15,
    borderColor: '#7e57c2',
    innerBorderWidth: 2,
    innerBorderColor: '#ffffff',
    orientation: 'universal',
    backgroundColor: '#7e57c2',
    style: {
      border: '15px solid #7e57c2',
      backgroundImage: 'url("../frames/birthday-streamers.png")',
      backgroundSize: 'cover',
      padding: '2px',
      boxShadow: '0 6px 10px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)'
    }
  }
];

// Helper function to adjust frame properties based on layout orientation
const adjustFrameForLayout = (frame, layout) => {
  const adjustedFrame = { ...frame };
  
  // Adjust frame properties based on layout orientation
  if (frame.adjustForOrientation && layout.orientation) {
    if (layout.orientation === 'portrait') {
      if (frame.holes && frame.holes.position === 'sides') {
        adjustedFrame.holePositions = ['left', 'right'];
      } else {
        adjustedFrame.holePositions = ['top', 'bottom'];
      }
    } else { // landscape
      if (frame.holes && frame.holes.position === 'sides') {
        adjustedFrame.holePositions = ['top', 'bottom'];
      } else {
        adjustedFrame.holePositions = ['left', 'right'];
      }
    }
  }
  
  // Adjust border widths for different layout sizes
  if (layout.size === '6x2') {
    // For narrower layouts, reduce border width slightly
    adjustedFrame.borderWidth = Math.max(8, Math.floor(frame.borderWidth * 0.8));
    if (adjustedFrame.matWidth) {
      adjustedFrame.matWidth = Math.max(15, Math.floor(frame.matWidth * 0.7));
    }
  }
  
  return adjustedFrame;
};

export { frames, adjustFrameForLayout };