import { MoodBoardData } from '../types/MoodBoardTypes';

export const solarisMoodBoardData: MoodBoardData = {
  factionId: 'solaris',
  tagline: "Divine Precision & Radiant Light",
  
  visualElements: [
    {
      name: "Golden Light",
      description: "Radiant illumination emanating from central sources",
      iconUrl: "/assets/icons/solaris/golden_light.svg",
      cssClass: "goldenLight"
    },
    {
      name: "Geometric Precision",
      description: "Perfect symmetrical patterns with divine proportions",
      iconUrl: "/assets/icons/solaris/geometric_pattern.svg",
      cssClass: "geometricPrecision"
    },
    {
      name: "Halos & Circles",
      description: "Circular motifs representing perfection and divinity",
      iconUrl: "/assets/icons/solaris/halo.svg",
      cssClass: "halos"
    },
    {
      name: "Crystalline Structures",
      description: "Light-refracting crystal forms with perfect angles",
      iconUrl: "/assets/icons/solaris/crystal.svg",
      cssClass: "crystalline"
    },
    {
      name: "Divine Proportions",
      description: "Clean, minimalist interfaces with perfect ratios",
      iconUrl: "/assets/icons/solaris/divine_proportion.svg",
      cssClass: "minimalist"
    },
    {
      name: "Light Beams",
      description: "Directed rays of light cutting through darkness",
      iconUrl: "/assets/icons/solaris/light_beams.svg",
      cssClass: "lightBeams"
    }
  ],
  
  colorPalette: [
    {
      name: "Gold",
      hex: "#FFD700",
      description: "Primary color representing divine light"
    },
    {
      name: "Dark Orange",
      hex: "#FF8C00",
      description: "Secondary color for energy and power"
    },
    {
      name: "Orange-Red",
      hex: "#FF4500",
      description: "Accent color for divine fire and purification"
    },
    {
      name: "Deep Space Blue",
      hex: "#0A0A1A",
      description: "Background color symbolizing the cosmos"
    }
  ],
  
  typography: [
    {
      name: "Uniform Sans-Serif",
      description: "Sans-serif fonts with uniform stroke widths",
      cssClass: "sansSerif",
      example: "Divine Algorithm"
    },
    {
      name: "Glowing Highlight",
      description: "Text with luminous edges for emphasis",
      cssClass: "glowing",
      example: "Radiant Light"
    },
    {
      name: "Sacred Geometry",
      description: "Headers integrated with geometric patterns",
      cssClass: "geometricHeader",
      example: "Sacred Geometry"
    }
  ],
  
  iconography: [
    {
      name: "Sun/Star Symbols",
      description: "Radiating stellar imagery representing the divine light",
      iconUrl: "/assets/icons/solaris/sun.svg",
      cssClass: "sunIcon"
    },
    {
      name: "Algorithm Patterns",
      description: "Circuit-like patterns made of light",
      iconUrl: "/assets/icons/solaris/algorithm.svg",
      cssClass: "algorithmIcon"
    },
    {
      name: "Radiant Halos",
      description: "Circular glows surrounding important concepts",
      iconUrl: "/assets/icons/solaris/halo.svg",
      cssClass: "haloIcon"
    },
    {
      name: "Divine Hierarchy",
      description: "Triangular formations representing order",
      iconUrl: "/assets/icons/solaris/triangle.svg",
      cssClass: "triangleIcon"
    }
  ],
  
  visualTreatments: [
    {
      name: "Lens Flares",
      description: "Bright light diffusion effects",
      imageUrl: "/assets/treatments/lens_flare.jpg",
      cssClass: "lensFlare"
    },
    {
      name: "Golden Borders",
      description: "Thin golden edges on containers and elements",
      imageUrl: "/assets/treatments/golden_border.jpg",
      cssClass: "goldenBorder"
    },
    {
      name: "Glowing Text",
      description: "Luminous text for quotes and important passages",
      imageUrl: "/assets/treatments/glowing_text.jpg",
      cssClass: "glowingText"
    },
    {
      name: "Light Particles",
      description: "Subtle floating motes of light in backgrounds",
      imageUrl: "/assets/treatments/light_particles.jpg",
      cssClass: "lightParticles"
    }
  ],
  
  examples: [
    {
      type: "Interface Design",
      imageUrl: "/assets/examples/solaris_interface.jpg",
      description: "Luminous interfaces with perfect symmetry and golden accents"
    },
    {
      type: "Document Style",
      imageUrl: "/assets/examples/solaris_document.jpg",
      description: "Sacred texts with glowing highlights and geometric margins"
    },
    {
      type: "Architectural Concept",
      imageUrl: "/assets/examples/solaris_architecture.jpg",
      description: "Crystalline structures bathed in divine light"
    }
  ]
};