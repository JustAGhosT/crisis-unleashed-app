/**
 * Script to generate placeholder SVG assets for the Faction Portal
 * Run with Node.js: node scripts/generate-placeholder-assets.cjs
 */

const fs = require('fs');
const path = require('path');

// Base directories
const PUBLIC_DIR = path.join(__dirname, '../public');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');

// Faction colors
const FACTION_COLORS = {
  solaris: '#FFD700', // Gold
  umbral: '#9B59B6',  // Medium Purple
  neuralis: '#00CED1', // Dark Turquoise
  aeonic: '#9370DB',  // Medium Purple
  infernal: '#FF4500', // Red-Orange
  primordial: '#32CD32', // Lime Green
  synthetic: '#1E90FF', // Dodger Blue
};

// Required directories
const DIRS = [
  'assets/backgrounds',
  'assets/effects',
  'assets/examples',
  'assets/icons',
  'assets/treatments',
  ...Object.keys(FACTION_COLORS).map(faction => `assets/factions/${faction}`),
  ...Object.keys(FACTION_COLORS).map(faction => `assets/icons/${faction}`)
];

// Create directories
function createDirectories() {
  console.log('Creating asset directories...');
  
  DIRS.forEach(dir => {
    const fullPath = path.join(PUBLIC_DIR, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created: ${fullPath}`);
    }
  });
}

// Generate faction emblems
function generateFactionEmblems() {
  console.log('Generating faction emblems...');
  
  Object.entries(FACTION_COLORS).forEach(([faction, color]) => {
    const svgContent = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="none" stroke="${color}" stroke-width="8" />
      <text x="100" y="110" font-family="Arial" font-size="24" fill="${color}" text-anchor="middle">${faction}</text>
      ${faction === 'solaris' ? '<path d="M100,40 L100,20 M60,60 L45,45 M40,100 L20,100 M60,140 L45,155 M100,160 L100,180 M140,140 L155,155 M160,100 L180,100 M140,60 L155,45" stroke="'+color+'" stroke-width="4" />' : ''}
      ${faction === 'umbral' ? '<circle cx="100" cy="100" r="40" fill="black" stroke="'+color+'" stroke-width="4" />' : ''}
      ${faction === 'neuralis' ? '<path d="M60,80 Q100,20 140,80 T180,100" stroke="'+color+'" stroke-width="4" fill="none" />' : ''}
      ${faction === 'aeonic' ? '<circle cx="100" cy="100" r="60" fill="none" stroke="'+color+'" stroke-width="3" /><path d="M100,40 L100,100 L140,100" stroke="'+color+'" stroke-width="4" fill="none" />' : ''}
      ${faction === 'infernal' ? '<path d="M70,130 L100,60 L130,130 L70,130 Z" fill="'+color+'" />' : ''}
      ${faction === 'primordial' ? '<path d="M100,40 C140,60 140,140 100,160 C60,140 60,60 100,40 Z" fill="'+color+'" fill-opacity="0.6" />' : ''}
      ${faction === 'synthetic' ? '<rect x="60" y="60" width="80" height="80" fill="none" stroke="'+color+'" stroke-width="4" /><circle cx="100" cy="100" r="25" fill="'+color+'" fill-opacity="0.5" />' : ''}
    </svg>
    `;
    
    fs.writeFileSync(path.join(PUBLIC_DIR, `assets/factions/${faction}/emblem.svg`), svgContent);
    console.log(`Generated emblem for ${faction}`);
  });
}

// Part of the script to generate background images
function generateBackgrounds() {
  console.log('Generating background images...');
  
  // Universe map for hub page
  const universeMapSvg = `
  <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="800" fill="#0A0A1A" />
    <circle cx="600" cy="400" r="300" fill="url(#grad1)" />
    <circle cx="200" cy="200" r="100" fill="url(#grad2)" />
    <circle cx="900" cy="600" r="150" fill="url(#grad3)" />
    
    <defs>
      <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style="stop-color:rgb(255,255,255);stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:rgb(255,215,0);stop-opacity:0" />
      </radialGradient>
      
      <radialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style="stop-color:rgb(155,89,182);stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:rgb(155,89,182);stop-opacity:0" />
      </radialGradient>
      
      <radialGradient id="grad3" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style="stop-color:rgb(50,205,50);stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:rgb(50,205,50);stop-opacity:0" />
      </radialGradient>
    </defs>
  </svg>
  `;
  
  fs.writeFileSync(path.join(PUBLIC_DIR, 'assets/backgrounds/universe_map.jpg'), universeMapSvg);
  console.log('Generated universe map background');
  
  // Timeline header
  const timelineHeaderSvg = `
  <svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="600" fill="#0A0A1A" />
    
    <!-- Time flow representation -->
    <path d="M0,300 C400,200 800,400 1200,300" stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="none" />
    
    <!-- Event markers -->
    <circle cx="200" cy="300" r="15" fill="#FFD700" />
    <circle cx="400" cy="260" r="15" fill="#9B59B6" />
    <circle cx="600" cy="320" r="15" fill="#FF4500" />
    <circle cx="800" cy="280" r="15" fill="#32CD32" />
    <circle cx="1000" cy="310" r="15" fill="#1E90FF" />
  </svg>
  `;
  
  fs.writeFileSync(path.join(PUBLIC_DIR, 'assets/backgrounds/timeline_header.jpg'), timelineHeaderSvg);
  console.log('Generated timeline header background');
}

// Generate faction backgrounds
function generateFactionBackgrounds() {
  console.log('Generating faction backgrounds...');
  
  // Faction backgrounds
  Object.entries(FACTION_COLORS).forEach(([faction, color]) => {
    const factionBgSvg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#0A0A1A" />
      
      <!-- Faction-specific pattern -->
      ${faction === 'solaris' ? '<circle cx="400" cy="300" r="200" fill="none" stroke="' + color + '" stroke-width="2" stroke-opacity="0.3" />' : ''}
      ${faction === 'umbral' ? '<path d="M0,300 Q400,100 800,300 T1600,300" stroke="' + color + '" stroke-width="2" stroke-opacity="0.3" fill="none" />' : ''}
      ${faction === 'neuralis' ? '<path d="M200,200 L600,200 L600,400 L200,400 Z" fill="none" stroke="' + color + '" stroke-width="2" stroke-opacity="0.3" />' : ''}
      ${faction === 'aeonic' ? '<circle cx="400" cy="300" r="150" fill="none" stroke="' + color + '" stroke-width="2" stroke-opacity="0.3" /><circle cx="400" cy="300" r="100" fill="none" stroke="' + color + '" stroke-width="2" stroke-opacity="0.3" /><circle cx="400" cy="300" r="50" fill="none" stroke="' + color + '" stroke-width="2" stroke-opacity="0.3" />' : ''}
      ${faction === 'infernal' ? '<path d="M350,200 L450,200 L500,300 L400,400 L300,300 Z" fill="none" stroke="' + color + '" stroke-width="2" stroke-opacity="0.3" />' : ''}
      ${faction === 'primordial' ? '<path d="M400,150 C500,200 500,400 400,450 C300,400 300,200 400,150 Z" fill="none" stroke="' + color + '" stroke-width="2" stroke-opacity="0.3" />' : ''}
      ${faction === 'synthetic' ? '<rect x="300" y="200" width="200" height="200" fill="none" stroke="' + color + '" stroke-width="2" stroke-opacity="0.3" /><rect x="350" y="250" width="100" height="100" fill="none" stroke="' + color + '" stroke-width="2" stroke-opacity="0.3" />' : ''}
    </svg>
    `;
    
    fs.writeFileSync(path.join(PUBLIC_DIR, `assets/factions/${faction}/background.jpg`), factionBgSvg);
    console.log(`Generated background for ${faction}`);
  });
}

// Run all generators
function runAll() {
  try {
    createDirectories();
    generateFactionEmblems();
    generateBackgrounds();
    generateFactionBackgrounds();
    console.log('First part of assets generated successfully!');

    // Call part 2
    require('./generate-placeholder-assets-part2.cjs');
  } catch (error) {
    console.error('Error generating assets:', error);
  }
}

// Run the script
runAll();