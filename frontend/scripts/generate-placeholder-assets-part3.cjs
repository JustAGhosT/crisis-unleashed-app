/**
 * Script to generate placeholder SVG assets for the Faction Portal - Part 3
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

// Generate example designs
function generateExamples() {
  console.log('Generating example designs...');
  
  const exampleTypes = ['interface', 'document', 'architecture'];
  
  Object.entries(FACTION_COLORS).forEach(([faction, color]) => {
    exampleTypes.forEach(type => {
      const exampleSvg = `
      <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#1A1A2A" />
        <rect x="50" y="50" width="500" height="300" fill="none" stroke="${color}" stroke-width="2" />
        <text x="300" y="200" font-family="Arial" font-size="24" fill="${color}" text-anchor="middle">${faction} ${type}</text>
      </svg>
      `;
      
      fs.writeFileSync(path.join(PUBLIC_DIR, `assets/examples/${faction}_${type}.jpg`), exampleSvg);
    });
  });
  
  console.log('Generated example designs');
}

// Generate effect images
function generateEffects() {
  console.log('Generating effect images...');
  
  const effects = [
    'light_particles', // Solaris
    'shadow_mist', // Umbral
    'time_distortion', // Aeonic
    'energy_pulse', // Infernal
    'biogrowth', // Primordial
    'mind_wave', // Neuralis
    'data_stream' // Synthetic
  ];
  
  effects.forEach(effect => {
    const effectSvg = `
    <svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="500" fill="#0A0A1A" />
      <text x="250" y="250" font-family="Arial" font-size="24" fill="white" text-anchor="middle">${effect}</text>
    </svg>
    `;
    
    fs.writeFileSync(path.join(PUBLIC_DIR, `assets/effects/${effect}.png`), effectSvg);
  });
  
  console.log('Generated effect images');
}

// Run part 3 generators and complete the process
function runPart3() {
  console.log('Running asset generation part 3...');
  try {
    generateExamples();
    generateEffects();
    
    console.log('\n===========================================');
    console.log('All placeholder assets generated successfully!');
    console.log('===========================================');
    console.log('\nYou can now run your application to see the faction portal with placeholder assets.');
    console.log('Replace these assets with high-quality graphics when available.\n');
  } catch (error) {
    console.error('Error in part 3:', error);
  }
}

// Run part 3
runPart3();