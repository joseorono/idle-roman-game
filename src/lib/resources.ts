import { BUILDINGS, BUILDINGS_ARRAY, BUILDINGS_COUNT } from '~/constants/buildings';
import { WORKERS, WORKERS_ARRAY, WORKERS_COUNT } from '~/constants/workers';
import { LEVELS, UPGRADES } from '~/constants/upgrades';
import {
  buildingData,
  playerResources,
  priceData,
  workerData,
  buildingCount,
  UpgradeKeys,
  activeIncomeData,
  buildingKeys,
  workerCount,
  passiveIncomeData,
  workerKeys,
  tilesKey,
} from '~/types/game-data-types';
import { SoundNames, soundService } from '~/services/sound-service';

export function getBuildingById(id: number): buildingData | null {
  // Handle the case where the building is not found
  return BUILDINGS_ARRAY.find((building: buildingData) => building.id === id) ?? null;
}

export function getWorkerById(id: number): workerData | null {
  // Handle the case where the worker is not found
  return WORKERS_ARRAY.find((worker: workerData) => worker.id === id) ?? null;
}

export function getBuildingCost(id: number): priceData | null {
  const building = getBuildingById(id);
  if (!building) return null;
  return {
    costGold: building.costGold,
    costGrain: building.costGrain,
    costStone: building.costStone,
  };
}

export function getWorkerCost(id: number): priceData | null {
  const worker = getWorkerById(id);
  if (!worker) return null;
  return {
    costGold: worker.costGold,
    costGrain: worker.costGrain,
    costStone: worker.costStone,
  };
}

export function canAffordBuilding(id: number, res: playerResources): boolean {
  const cost = getBuildingCost(id);
  if (!cost) return false;
  return res.gold >= cost.costGold && res.grain >= cost.costGrain && res.stone >= cost.costStone;
}

export function canAffordWorker(id: number, res: playerResources): boolean {
  const cost = getWorkerCost(id);
  if (!cost) return false;
  return res.gold >= cost.costGold && res.grain >= cost.costGrain && res.stone >= cost.costStone;
}

export function getBestAffordableBuilding(res: playerResources): number | null {
  // This function assumes that the BUILDINGS array is sorted by profitability in ascending order

  // Is the player broke???
  if (res.gold == 0) {
    return null;
  }

  // Don't bother checking if the player can't afford the cheapest building
  if (
    res.gold < BUILDINGS_ARRAY[0].costGold ||
    res.grain < BUILDINGS_ARRAY[0].costGrain ||
    res.stone < BUILDINGS_ARRAY[0].costStone
  ) {
    return null;
  }

  // Use for loop to go through the buildings array backwards and check if the player can afford the building
  // Return the first building that the player can afford
  for (let i = BUILDINGS_COUNT - 1; i >= 0; i--) {
    if (canAffordBuilding(BUILDINGS_ARRAY[i].id, res)) {
      return BUILDINGS_ARRAY[i].id;
    }
  }

  // Return null if no building is affordable
  return null;
}

export function getBestAffordableWorker(res: playerResources): number | null {
  // This function assumes that the BUILDINGS array is sorted by profitability in ascending order

  // Is the player broke???
  if (res.gold == 0) {
    return null;
  }

  // Don't bother checking if the player can't afford the cheapest building
  if (
    res.gold < WORKERS_ARRAY[0].costGold ||
    res.grain < WORKERS_ARRAY[0].costGrain ||
    res.stone < WORKERS_ARRAY[0].costStone
  ) {
    return null;
  }

  // Use for loop to go through the buildings array backwards and check if the player can afford the building
  // Return the first building that the player can afford
  for (let i = WORKERS_COUNT - 1; i >= 0; i--) {
    if (canAffordWorker(WORKERS_ARRAY[i].id, res)) {
      return WORKERS_ARRAY[i].id;
    }
  }

  // Return null if no building is affordable
  return null;
}

export function calculatePassiveIncome(
  buildingCount: buildingCount,
  upgradeKey: UpgradeKeys,
  playerLevel: number = 0,
): passiveIncomeData {
  // Declare variables to store calculated values and the current multipliers
  let accumulatedGoldPerSecond = 0;
  let accumulatedGrainPerSecond = 0;
  let accumulatedStonePerSecond = 0;
  const CURRENT_MULTIPLIER = LEVELS[playerLevel].baseMultiplier;
  const CURRENT_UPGRADE = UPGRADES[upgradeKey];
  // Iterate buildings to calculate income per each building
  for (const key in buildingCount) {
    if (buildingCount[key as keyof buildingCount] == 0) continue;
    const BUILDING_INFO = BUILDINGS[key as buildingKeys];
    const BUILDING_COUNT = buildingCount[key as keyof buildingCount];
    accumulatedGoldPerSecond += BUILDING_INFO.goldPerSecond * BUILDING_COUNT;
    accumulatedGrainPerSecond += BUILDING_INFO.grainPerSecond * BUILDING_COUNT;
    accumulatedStonePerSecond += BUILDING_INFO.stonePerSecond * BUILDING_COUNT;
  }

  return {
    goldPerSecond: accumulatedGoldPerSecond * CURRENT_MULTIPLIER * CURRENT_UPGRADE.goldMultiplier,
    grainPerSecond: accumulatedGrainPerSecond * CURRENT_MULTIPLIER * CURRENT_UPGRADE.grainMultiplier,
    stonePerSecond: accumulatedStonePerSecond * CURRENT_MULTIPLIER * CURRENT_UPGRADE.stoneMultiplier,
  };
}

export function calculateActiveIncome(
  workerCount: workerCount,
  upgradeKey: UpgradeKeys,
  playerLevel: number = 0,
): activeIncomeData {
  // Declare variables to store calculated values and the current multipliers
  let accumulatedGoldPerClick = 0;
  let accumulatedGrainPerClick = 0;
  let accumulatedStonePerClick = 0;
  const CURRENT_MULTIPLIER = LEVELS[playerLevel].baseMultiplier;
  const CURRENT_UPGRADE = UPGRADES[upgradeKey];
  // Iterate workers to calculate income per each building
  for (const key in workerCount) {
    if (workerCount[key as keyof workerCount] == 0) continue;
    const WORKER_INFO = WORKERS[key as workerKeys];
    const WORKER_COUNT = workerCount[key as keyof workerCount];
    accumulatedGoldPerClick += WORKER_INFO.goldPerClick * WORKER_COUNT;
    accumulatedGrainPerClick += WORKER_INFO.grainPerClick * WORKER_COUNT;
    accumulatedStonePerClick += WORKER_INFO.stonePerClick * WORKER_COUNT;
  }

  return {
    goldPerClick: 1 + accumulatedGoldPerClick * CURRENT_MULTIPLIER * CURRENT_UPGRADE.goldMultiplier,
    grainPerClick: accumulatedGrainPerClick * CURRENT_MULTIPLIER * CURRENT_UPGRADE.grainMultiplier,
    stonePerClick: accumulatedStonePerClick * CURRENT_MULTIPLIER * CURRENT_UPGRADE.stoneMultiplier,
  };
}

export function playBuildingSound(buildingName: tilesKey) {
  const minVolume = Math.min(soundService.globalVolume, 0.8);
  switch (buildingName) {
    case 'slave':
      soundService.playSound(SoundNames.buySlave, minVolume);
      break;
    case 'miner':
    case 'quarry':
      soundService.playSound(SoundNames.buyMiner, minVolume);
      break;
    default:
      break;
  }
}

