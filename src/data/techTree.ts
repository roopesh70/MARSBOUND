import { TechUpgrade } from '../types/science';

export const TECH_TREE_UPGRADES: TechUpgrade[] = [
  {
    id: 'tech_spectroscopic_hud',
    name: 'Visor Hyperspectral Mineral HUD',
    category: 'suit',
    costRP: 150,
    iconName: 'Eye',
    description: 'Integrates real-time CRISM & SuperCam hyperspectral imaging into the astronaut helmet HUD visor.',
    gameplayEffect: 'Displays mineral phase signatures and composition directly on discovery pins and reticles.',
  },
  {
    id: 'tech_battery_boost',
    name: 'Graphene-Silica Battery Matrix',
    category: 'suit',
    costRP: 250,
    iconName: 'BatteryCharging',
    description: 'Advanced solid-state electrolyte cells utilizing local Martian silica and graphene nanosheets.',
    gameplayEffect: '+30% Suit battery capacity (130 max) and -25% Rover battery consumption rate during traverse.',
  },
  {
    id: 'tech_o2_scrubber',
    name: 'Closed-Loop MOXIE & Polymer O2 Scrubber',
    category: 'suit',
    costRP: 300,
    iconName: 'Wind',
    description: 'High-efficiency solid oxide electrolysis membrane that recycles exhaled CO₂ into breathable O₂.',
    gameplayEffect: 'Reduces astronaut suit oxygen consumption rate by 35% during EVA exploration.',
  },
  {
    id: 'tech_rover_transmission',
    name: 'Titanium Planetary Gearbox & Inverter',
    category: 'rover',
    costRP: 350,
    iconName: 'Zap',
    description: 'Hardened titanium-carbide planetary reduction hubs and high-frequency SiC power inverters.',
    gameplayEffect: 'Unlocks Rover Turbo Mode: boosts top speed to 80 km/h with enhanced slope climbing torque.',
  },
  {
    id: 'tech_chemin_cryo',
    name: 'Cryo-Cooled CheMin CCD Upgrade',
    category: 'instruments',
    costRP: 450,
    iconName: 'Sparkles',
    description: 'Active Stirling cryocooler chilling the X-Ray diffraction CCD sensor down to -100°C for ultra-low noise.',
    gameplayEffect: 'Grants +40% Research Points (RP) on all sample analyses and reveals trace ppm elements.',
  },
  {
    id: 'tech_solar_perovskite',
    name: 'Perovskite Tandem Solar Coating',
    category: 'outpost',
    costRP: 500,
    iconName: 'Sun',
    description: 'Dual-junction metal halide perovskite thin-film coating tuned to the red-shifted Martian solar spectrum.',
    gameplayEffect: '+40% Outpost solar generation power (adds +960W per tracking solar array).',
  },
  {
    id: 'tech_msr_caching',
    name: 'Hermetic Titanium MSR Sample Cache',
    category: 'instruments',
    costRP: 600,
    iconName: 'CheckCircle2',
    description: 'Gold-plated hermetic sealing collars for sample tubes, meeting NASA planetary protection standards.',
    gameplayEffect: 'Qualifies cached samples for NASA Mars Sample Return orbital launch and unlocks MSR flight dossier.',
    prerequisites: ['tech_chemin_cryo']
  }
];
