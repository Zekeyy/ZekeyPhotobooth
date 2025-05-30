// Layout definitions - matching the provided layout images (A through L)
const layouts = [
    { 
      id: 'A', 
      size: '6x2', 
      imageCount: 3, 
      positions: [
        { x: 0, y: 0, width: 0.5, height: 0.33 },
        { x: 0, y: 0.33, width: 0.5, height: 0.33 },
        { x: 0, y: 0.66, width: 0.5, height: 0.34 },
      ],
      orientation: 'portrait'
    },
    { 
      id: 'B', 
      size: '6x2', 
      imageCount: 4,
      positions: [
        { x: 0, y: 0, width: 0.5, height: 0.25 },
        { x: 0, y: 0.25, width: 0.5, height: 0.25 },
        { x: 0, y: 0.5, width: 0.5, height: 0.25 },
        { x: 0, y: 0.75, width: 0.5, height: 0.25 },
      ],
      orientation: 'portrait'
    },
    { 
      id: 'C', 
      size: '6x2', 
      imageCount: 4,
      positions: [
        { x: 0.5, y: 0, width: 0.5, height: 0.25 },
        { x: 0.5, y: 0.25, width: 0.5, height: 0.25 },
        { x: 0.5, y: 0.5, width: 0.5, height: 0.25 },
        { x: 0.5, y: 0.75, width: 0.5, height: 0.25 },
      ],
      orientation: 'portrait'
    },
    { 
      id: 'D', 
      size: '6x2', 
      imageCount: 4,
      positions: [
        { x: 0, y: 0, width: 0.5, height: 0.25 },
        { x: 0, y: 0.25, width: 0.5, height: 0.25 },
        { x: 0, y: 0.5, width: 0.5, height: 0.25 },
        { x: 0, y: 0.75, width: 0.5, height: 0.25 },
      ],
      orientation: 'portrait'
    },
    { 
      id: 'E', 
      size: '4x6', 
      imageCount: 4,
      positions: [
        { x: 0, y: 0, width: 0.5, height: 0.5 },
        { x: 0.5, y: 0, width: 0.5, height: 0.5 },
        { x: 0, y: 0.5, width: 0.5, height: 0.5 },
        { x: 0.5, y: 0.5, width: 0.5, height: 0.5 },
      ],
      orientation: 'landscape'
    },
    { 
      id: 'F', 
      size: '4x6', 
      imageCount: 3,
      positions: [
        { x: 0, y: 0, width: 0.5, height: 0.5 },
        { x: 0.5, y: 0, width: 0.5, height: 0.5 },
        { x: 0, y: 0.5, width: 1, height: 0.5 },
      ],
      orientation: 'landscape'
    },
    { 
      id: 'G', 
      size: '4x6', 
      imageCount: 3,
      positions: [
        { x: 0, y: 0, width: 0.65, height: 1 },
        { x: 0.65, y: 0, width: 0.35, height: 0.5 },
        { x: 0.65, y: 0.5, width: 0.35, height: 0.5 },
      ],
      orientation: 'landscape'
    },
    { 
      id: 'H', 
      size: '4x6', 
      imageCount: 3,
      positions: [
        { x: 0, y: 0, width: 0.5, height: 0.65 },
        { x: 0.5, y: 0, width: 0.5, height: 0.65 },
        { x: 0, y: 0.65, width: 1, height: 0.35 },
      ],
      orientation: 'landscape'
    },
    { 
      id: 'I', 
      size: '4x6', 
      imageCount: 2,
      positions: [
        { x: 0, y: 0, width: 0.65, height: 1 },
        { x: 0.65, y: 0, width: 0.35, height: 1 },
      ],
      orientation: 'landscape'
    },
    { 
      id: 'J', 
      size: '4x6', 
      imageCount: 2,
      positions: [
        { x: 0, y: 0, width: 1, height: 0.4 },
        { x: 0, y: 0.4, width: 1, height: 0.6 },
      ],
      orientation: 'landscape'
    },
    { 
      id: 'K', 
      size: '4x6', 
      imageCount: 2,
      positions: [
        { x: 0, y: 0, width: 1, height: 0.5 },
        { x: 0, y: 0.5, width: 1, height: 0.5 },
      ],
      orientation: 'portrait'
    },
    { 
      id: 'L', 
      size: '4x6', 
      imageCount: 1,
      positions: [
        { x: 0, y: 0, width: 1, height: 1 },
      ],
      orientation: 'landscape'
    },
  ];
  export default layouts;