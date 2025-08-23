import { type MoodBoardData } from "@/types/moodboard";
import { type FactionKey } from "@/lib/theme/faction-theme";

export const solarisMoodBoardData: MoodBoardData = {
  factionId: "solaris",
  tagline: "Divine Precision & Radiant Light",
  visualElements: [
    { name: "Golden Light", description: "Radiant illumination emanating from central sources", iconUrl: "/assets/icons/solaris/golden_light.svg", cssClass: "goldenLight" },
    { name: "Geometric Precision", description: "Perfect symmetrical patterns with divine proportions", iconUrl: "/assets/icons/solaris/geometric_pattern.svg", cssClass: "geometricPrecision" },
    { name: "Halos & Circles", description: "Circular motifs representing perfection and divinity", iconUrl: "/assets/icons/solaris/halo.svg", cssClass: "halos" },
    { name: "Crystalline Structures", description: "Light-refracting crystal forms with perfect angles", iconUrl: "/assets/icons/solaris/crystal.svg", cssClass: "crystalline" },
    { name: "Divine Proportions", description: "Clean, minimalist interfaces with perfect ratios", iconUrl: "/assets/icons/solaris/divine_proportion.svg", cssClass: "minimalist" },
    { name: "Light Beams", description: "Directed rays of light cutting through darkness", iconUrl: "/assets/icons/solaris/light_beams.svg", cssClass: "lightBeams" },
  ],
  colorPalette: [
    { name: "Gold", hex: "#FFD700", description: "Primary color representing divine light" },
    { name: "Dark Orange", hex: "#FF8C00", description: "Secondary color for energy and power" },
    { name: "Orange-Red", hex: "#FF4500", description: "Accent color for divine fire and purification" },
    { name: "Deep Space Blue", hex: "#0A0A1A", description: "Background color symbolizing the cosmos" },
  ],
  typography: [
    { name: "Uniform Sans-Serif", description: "Sans-serif fonts with uniform stroke widths", cssClass: "sansSerif", example: "Divine Algorithm" },
    { name: "Glowing Highlight", description: "Text with luminous edges for emphasis", cssClass: "glowing", example: "Radiant Light" },
    { name: "Sacred Geometry", description: "Headers integrated with geometric patterns", cssClass: "geometricHeader", example: "Sacred Geometry" },
  ],
  iconography: [
    { name: "Sun/Star Symbols", description: "Radiating stellar imagery representing the divine light", iconUrl: "/assets/icons/solaris/sun.svg", cssClass: "sunIcon" },
    { name: "Algorithm Patterns", description: "Circuit-like patterns made of light", iconUrl: "/assets/icons/solaris/algorithm.svg", cssClass: "algorithmIcon" },
    { name: "Radiant Halos", description: "Circular glows surrounding important concepts", iconUrl: "/assets/icons/solaris/halo.svg", cssClass: "haloIcon" },
    { name: "Divine Hierarchy", description: "Triangular formations representing order", iconUrl: "/assets/icons/solaris/triangle.svg", cssClass: "triangleIcon" },
  ],
  visualTreatments: [
    { name: "Lens Flares", description: "Bright light diffusion effects", imageUrl: "/assets/treatments/lens_flare.jpg", cssClass: "lensFlare" },
    { name: "Golden Borders", description: "Thin golden edges on containers and elements", imageUrl: "/assets/treatments/golden_border.jpg", cssClass: "goldenBorder" },
    { name: "Glowing Text", description: "Luminous text for quotes and important passages", imageUrl: "/assets/treatments/glowing_text.jpg", cssClass: "glowingText" },
    { name: "Light Particles", description: "Subtle floating motes of light in backgrounds", imageUrl: "/assets/treatments/light_particles.jpg", cssClass: "lightParticles" },
  ],
  examples: [
    { type: "Interface Design", imageUrl: "/assets/examples/solaris_interface.jpg", description: "Luminous interfaces with perfect symmetry and golden accents" },
    { type: "Document Style", imageUrl: "/assets/examples/solaris_document.jpg", description: "Sacred texts with glowing highlights and geometric margins" },
    { type: "Architectural Concept", imageUrl: "/assets/examples/solaris_architecture.jpg", description: "Crystalline structures bathed in divine light" },
  ],
};

export const umbralMoodBoardData: MoodBoardData = {
  factionId: "umbral",
  tagline: "Stealth, Obfuscation & Information Warfare",
  visualElements: [
    { name: "Shadow Veil", description: "Layered translucent darkness with shifting patterns", iconUrl: "/assets/icons/umbral/shadow_veil.svg", cssClass: "shadowVeil" },
    { name: "Encrypted Glyphs", description: "Obscured symbols hinting at hidden truths", iconUrl: "/assets/icons/umbral/encrypted_glyphs.svg", cssClass: "encryptedGlyphs" },
  ],
  colorPalette: [
    { name: "Deep Violet", hex: "#5B21B6", description: "Primary mysterious hue" },
    { name: "Midnight", hex: "#0B0B14", description: "Background darkness" },
    { name: "Fuchsia", hex: "#C026D3", description: "Accents for intrigue" },
  ],
  typography: [
    { name: "Condensed Sans", description: "Tight, stealthy headings", cssClass: "condensed", example: "Encrypted Protocol" },
  ],
  iconography: [
    { name: "Obscura", description: "Blurred mask iconography", iconUrl: "/assets/icons/umbral/obscura.svg", cssClass: "obscura" },
  ],
  visualTreatments: [
    { name: "Static Noise", description: "Subtle signal noise overlays", imageUrl: "/assets/treatments/static_noise.jpg", cssClass: "staticNoise" },
  ],
  examples: [
    { type: "Infiltration UI", imageUrl: "/assets/examples/umbral_console.jpg", description: "Dim neon terminals with masked telemetry" },
  ],
};

// Legacy generic fallback (not used by getMoodBoardData to avoid misleading faction IDs)
// Kept for backward compatibility if imported elsewhere.
export const DEFAULT_MOODBOARD: MoodBoardData = {
  factionId: "umbral", // pick a non-Solaris key to avoid implying Solaris visuals
  tagline: "Generic Fallback (Legacy)",
  visualElements: [],
  colorPalette: [],
  typography: [],
  iconography: [],
  visualTreatments: [],
  examples: [],
};

// Helper to generate explicit placeholders per faction
const makePlaceholderMoodBoard = (factionId: FactionKey, tagline: string): MoodBoardData => ({
  factionId,
  tagline,
  visualElements: [],
  colorPalette: [],
  typography: [],
  iconography: [],
  visualTreatments: [],
  examples: [],
});

// Clearly named placeholders for unimplemented factions
export const AEONIC_PLACEHOLDER = makePlaceholderMoodBoard("aeonic", "Time Manipulation & Temporal Mastery (Placeholder)");
export const PRIMORDIAL_PLACEHOLDER = makePlaceholderMoodBoard("primordial", "Evolutionary Growth & Biological Harmony (Placeholder)");
export const INFERNAL_PLACEHOLDER = makePlaceholderMoodBoard("infernal", "Dimensional Power & Blood Sacrifice (Placeholder)");
export const NEURALIS_PLACEHOLDER = makePlaceholderMoodBoard("neuralis", "Mind & Consciousness Exploration (Placeholder)");
export const SYNTHETIC_PLACEHOLDER = makePlaceholderMoodBoard("synthetic", "Optimization & Mechanical Perfection (Placeholder)");

const MOODBOARD_MAP: Record<FactionKey, MoodBoardData> = {
  solaris: solarisMoodBoardData,
  umbral: umbralMoodBoardData,
  aeonic: AEONIC_PLACEHOLDER,
  primordial: PRIMORDIAL_PLACEHOLDER,
  infernal: INFERNAL_PLACEHOLDER,
  neuralis: NEURALIS_PLACEHOLDER,
  synthetic: SYNTHETIC_PLACEHOLDER,
};

export function getMoodBoardData(faction: FactionKey): MoodBoardData {
  // All FactionKey values are present in MOODBOARD_MAP; avoid using a misleading default.
  if (!(faction in MOODBOARD_MAP)) {
    console.warn(`Unknown faction key: ${faction}, falling back to placeholder`);
    return makePlaceholderMoodBoard(faction as FactionKey, `Unknown Faction (${faction})`);
  }
  return MOODBOARD_MAP[faction];
}
