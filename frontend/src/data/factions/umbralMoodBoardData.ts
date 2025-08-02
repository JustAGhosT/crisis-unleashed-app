import { MoodBoardData } from '../types/MoodBoardTypes';

export const umbralMoodBoardData: MoodBoardData = {
  factionId: 'umbral',
  tagline: "Shadow & Veiled Design",
  
  visualElements: [
    {
      name: "Shadow Silhouettes",
      description: "Dark forms with glowing edges that hint at hidden depths",
      iconUrl: "/assets/icons/umbral/shadow_silhouette.svg",
      cssClass: "shadowSilhouettes"
    },
    {
      name: "Shifting Fractals",
      description: "Recursive patterns that appear to move when observed",
      iconUrl: "/assets/icons/umbral/fractal.svg",
      cssClass: "fractals"
    },
    {
      name: "Veiled Imagery",
      description: "Partially obscured visuals requiring careful observation",
      iconUrl: "/assets/icons/umbral/veiled.svg",
      cssClass: "veiled"
    },
    {
      name: "Ink-like Swirls",
      description: "Flowing, dark tendrils that spread organically",
      iconUrl: "/assets/icons/umbral/ink_swirl.svg",
      cssClass: "inkSwirls"
    },
    {
      name: "Asymmetrical Design",
      description: "Organic, unbalanced forms that challenge perception",
      iconUrl: "/assets/icons/umbral/asymmetrical.svg",
      cssClass: "asymmetrical"
    },
    {
      name: "Distorted Reflections",
      description: "Mirrored surfaces showing altered realities",
      iconUrl: "/assets/icons/umbral/reflection.svg",
      cssClass: "reflective"
    }
  ],
  
  colorPalette: [
    {
      name: "Medium Purple",
      hex: "#9B59B6",
      description: "Primary color representing shadow magic"
    },
    {
      name: "Dark Violet",
      hex: "#8E44AD",
      description: "Secondary color for depth and mystery"
    },
    {
      name: "Deep Purple",
      hex: "#6C3483",
      description: "Accent color for ancient shadow power"
    },
    {
      name: "Near-Black",
      hex: "#0A0A0A",
      description: "Background color symbolizing the void"
    }
  ],
  
  typography: [
    {
      name: "Variable Serif",
      description: "Serif fonts with thick and thin stroke variations",
      cssClass: "serif",
      example: "Shadow Protocol"
    },
    {
      name: "Redacted Text",
      description: "Information that appears partially hidden or censored",
      cssClass: "redacted",
      example: "Classified Information"
    },
    {
      name: "Shadow Effects",
      description: "Text with subtle dark auras behind it",
      cssClass: "shadowed",
      example: "Dark Knowledge"
    }
  ],
  
  iconography: [
    {
      name: "Eclipse Symbols",
      description: "Circular forms with partial shadowing",
      iconUrl: "/assets/icons/umbral/eclipse.svg",
      cssClass: "eclipseIcon"
    },
    {
      name: "Interlocking Rings",
      description: "Connected circles representing secret networks",
      iconUrl: "/assets/icons/umbral/rings.svg",
      cssClass: "ringsIcon"
    },
    {
      name: "Unusual Eye Designs",
      description: "Watching eyes with non-standard pupils",
      iconUrl: "/assets/icons/umbral/eye.svg",
      cssClass: "eyeIcon"
    },
    {
      name: "Neural Networks",
      description: "Branching pathways resembling thought patterns",
      iconUrl: "/assets/icons/umbral/network.svg",
      cssClass: "networkIcon"
    }
  ],
  
  visualTreatments: [
    {
      name: "Shadow Casting",
      description: "Layered shadows that create depth and mystery",
      imageUrl: "/assets/treatments/shadow_casting.jpg",
      cssClass: "shadowCasting"
    },
    {
      name: "Smoke & Mist",
      description: "Vapor effects that obscure and reveal",
      imageUrl: "/assets/treatments/smoke_mist.jpg",
      cssClass: "smokeMist"
    },
    {
      name: "Glitch Effects",
      description: "Digital distortions suggesting reality instability",
      imageUrl: "/assets/treatments/glitch.jpg",
      cssClass: "glitchEffect"
    },
    {
      name: "Violet Highlights",
      description: "Subtle purple accents in dark areas",
      imageUrl: "/assets/treatments/violet_highlight.jpg",
      cssClass: "violetHighlights"
    }
  ],
  
  examples: [
    {
      type: "Interface Design",
      imageUrl: "/assets/examples/umbral_interface.jpg",
      description: "Shadowy interfaces with partially revealed information"
    },
    {
      type: "Document Style",
      imageUrl: "/assets/examples/umbral_document.jpg",
      description: "Mysterious texts with redacted sections and hidden meanings"
    },
    {
      type: "Architectural Concept",
      imageUrl: "/assets/examples/umbral_architecture.jpg",
      description: "Structures that blend with shadows and challenge perception"
    }
  ]
};