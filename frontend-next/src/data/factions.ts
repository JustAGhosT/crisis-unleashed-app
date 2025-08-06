import { FactionId } from "@/types/faction";

/**
 * Get faction options for form select fields
 */
export function getFactionOptions() {
  return [
    { value: 'solaris', label: 'Solaris Nexus' },
    { value: 'umbral', label: 'Umbral Eclipse' },
    { value: 'aeonic', label: 'Aeonic Dominion' },
    { value: 'primordial', label: 'Primordial Genesis' },
    { value: 'infernal', label: 'Infernal Core' },
    { value: 'neuralis', label: 'Neuralis Conclave' },
    { value: 'synthetic', label: 'Synthetic Directive' }
  ];
}

/**
 * Get all available faction IDs
 */
export const FACTION_IDS: FactionId[] = [
  'solaris',
  'umbral',
  'aeonic',
  'primordial',
  'infernal',
  'neuralis',
  'synthetic'
];

/**
 * Get a specific faction by its ID
 */
export function getFactionById(id: FactionId) {
  const options = getFactionOptions();
  return options.find(option => option.value === id);
}

/**
 * Format faction name for display
 */
export function formatFactionName(id: FactionId): string {
  const faction = getFactionById(id);
  return faction ? faction.label : id;
}

/**
 * Get faction color class
 */
export function getFactionColorClass(id: FactionId): string {
  switch (id) {
    case 'solaris':
      return 'text-yellow-400';
    case 'umbral':
      return 'text-purple-400';
    case 'aeonic':
      return 'text-blue-400';
    case 'primordial':
      return 'text-green-400';
    case 'infernal':
      return 'text-red-400';
    case 'neuralis':
      return 'text-cyan-400';
    case 'synthetic':
      return 'text-gray-400';
    default:
      return 'text-white';
  }
}