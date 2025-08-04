/**
 * Script to generate placeholder SVG assets for the Faction Portal - Part 2
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

// Generate icons for each faction
function generateIcons() {
  console.log('Generating faction icons...');
  
  // Common icons for each faction
  const iconTypes = [
    'golden_light', 'geometric_pattern', 'halo', 'crystal', 'divine_proportion', 'light_beams', // Solaris
    'shadow_silhouette', 'fractal', 'veiled', 'ink_swirl', 'asymmetrical', 'reflection', // Umbral
    'neural_network', 'consciousness', 'telepathy', 'meditation', 'thought_control', 'mindscape', // Neuralis
    'clock', 'timeline', 'hourglass', 'pendulum', 'geometry', 'threads', // Aeonic
    'mechanical_organic', 'energy_conduit', 'dimensional_rift', 'angular', 'altar', 'living_tech', // Infernal
    'bioluminescent', 'dna', 'evolution', 'organic', 'symbiosis', 'growth', // Primordial
    'mechanical', 'fractal_pattern', 'grid', 'modular', 'interface', 'resource' // Synthetic
  ];
  
  // Generate simple placeholder icons
  iconTypes.forEach(iconType => {
    let faction = '';
    if (iconType.match(/(golden|geometric|halo|crystal|divine|light)/)) faction = 'solaris';
    else if (iconType.match(/(shadow|fractal|veiled|ink|asymmetrical|reflection)/)) faction = 'umbral';
    else if (iconType.match(/(neural|consciousness|telepathy|meditation|thought|mindscape)/)) faction = 'neuralis';
    else if (iconType.match(/(clock|timeline|hourglass|pendulum|geometry|threads)/)) faction = 'aeonic';
    else if (iconType.match(/(mechanical_organic|energy|dimensional|angular|altar|living)/)) faction = 'infernal';
    else if (iconType.match(/(bioluminescent|dna|evolution|organic|symbiosis|growth)/)) faction = 'primordial';
    else if (iconType.match(/(mechanical|fractal_pattern|grid|modular|interface|resource)/)) faction = 'synthetic';
    
    const color = FACTION_COLORS[faction];
    
    const iconSvg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="none" stroke="${color}" stroke-width="2" />
      <text x="50" y="55" font-family="Arial" font-size="10" fill="${color}" text-anchor="middle">${iconType}</text>
    </svg>
    `;
    
    fs.writeFileSync(path.join(PUBLIC_DIR, `assets/icons/${faction}/${iconType}.svg`), iconSvg);
  });
  
  console.log('Generated faction icons');
}

// Generate treatment images
function generateTreatments() {
  console.log('Generating treatment images...');
  
  const treatments = [
    'lens_flare', 'golden_border', 'glowing_text', 'light_particles', // Solaris
    'shadow_casting', 'smoke_mist', 'glitch', 'violet_highlight', // Umbral
    'pulsing', 'scarred', 'heat_distortion', 'viscous', // Infernal
    'after_image', 'transparent_layer', 'dust', 'blurred_edge', // Aeonic
    'growth', 'textured', 'bioluminescence', 'water', // Primordial
    'brainwave', 'holographic', 'depth', 'gradient', // Neuralis
    'projection', 'minimal', 'symmetrical', 'scanning' // Synthetic
  ];
  
  treatments.forEach(treatment => {
    const treatmentSvg = `
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" fill="#1A1A2A" />
      <text x="150" y="100" font-family="Arial" font-size="20" fill="white" text-anchor="middle">${treatment}</text>
    </svg>
    `;
    
    fs.writeFileSync(path.join(PUBLIC_DIR, `assets/treatments/${treatment}.jpg`), treatmentSvg);
  });
  
  console.log('Generated treatment images');
}

// Run part 2 generators
function runPart2() {
  console.log('Running asset generation part 2...');
  try {
    generateIcons();
    generateTreatments();
    
    // Call part 3
    require('./generate-placeholder-assets-part3.cjs');
  } catch (error) {
    console.error('Error in part 2:', error);
  }
}

// Run part 2
runPart2();