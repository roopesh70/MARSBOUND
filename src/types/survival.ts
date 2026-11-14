export interface SuitResources {
  oxygen: number; // 0 to 100 %
  oxygenMax: number;
  oxygenDepletionRatePerSec: number; // Normal expedition consumption rate
  
  battery: number; // 0 to 100 %
  batteryMax: number;
  batteryPassiveDrainPerSec: number;
  scannerBatteryCost: number; // Flat cost per scan action

  suitHealth: number; // 0 to 100 %
  suitTemperatureCelsius: number; // Regulated inside suit: ~20 C
  radiationDoseAccumulatedmSv: number; // Informational cumulative exposure

  isInSafeZone: boolean; // Outpost habitat or pressurized rover
  isSprinting: boolean;
  isSuffocating: boolean;
  isBatteryDepleted: boolean;
}

export type SurvivalMode = 'survival_normal' | 'free_exploration' | 'learning_mode';
