import toast from 'react-hot-toast';

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
import { CONST_MAX_BUILDING_TYPE } from '~/constants/defaults';

export function getBuildingById(id: number): buildingData | null {
  // Handle the case where the building is not found
  return BUILDINGS_ARRAY.find((building: buildingData) => building.id === id) ?? null;
}

export function getWorkerById(id: number): workerData | null {
  // Handle the case where the worker is not found
  return WORKERS_ARRAY.find((worker: workerData) => worker.id === id) ?? null;
}

export function getBuildingInfo(id: number): (priceData & passiveIncomeData) | null {
  const building = getBuildingById(id);
  if (!building) return null;
  return {
    costGold: building.costGold,
    costGrain: building.costGrain,
    costStone: building.costStone,
    goldPerSecond: building.goldPerSecond,
    stonePerSecond: building.stonePerSecond,
    grainPerSecond: building.grainPerSecond,
  };
}

export function getWorkerInfo(id: number): (priceData & activeIncomeData) | null {
  const worker = getWorkerById(id);
  if (!worker) return null;
  return {
    costGold: worker.costGold,
    costGrain: worker.costGrain,
    costStone: worker.costStone,
    goldPerClick: worker.goldPerClick,
    stonePerClick: worker.stonePerClick,
    grainPerClick: worker.grainPerClick,
  };
}

export function canAffordBuilding(id: number, res: playerResources): boolean {
  const cost = getBuildingInfo(id);
  if (!cost) return false;
  return res.gold >= cost.costGold && res.grain >= cost.costGrain && res.stone >= cost.costStone;
}

export function canAffordWorker(id: number, res: playerResources): boolean {
  const cost = getWorkerInfo(id);
  if (!cost) return false;
  return res.gold >= cost.costGold && res.grain >= cost.costGrain && res.stone >= cost.costStone;
}

export function getBestAffordableBuilding(res: playerResources, buildings: buildingCount): buildingData | null {
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
    if (
      canAffordBuilding(BUILDINGS_ARRAY[i].id, res) &&
      buildings[BUILDINGS_ARRAY[i].name.toLowerCase() as keyof buildingCount] < CONST_MAX_BUILDING_TYPE
    ) {
      return BUILDINGS_ARRAY[i];
    }
  }

  // Return null if no building is affordable
  return null;
}

export function getBestAffordableWorker(res: playerResources, workers: workerCount): workerData | null {
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
    if (
      canAffordWorker(WORKERS_ARRAY[i].id, res) &&
      workers[WORKERS_ARRAY[i].name.toLowerCase() as keyof workerCount] < CONST_MAX_BUILDING_TYPE
    ) {
      return WORKERS_ARRAY[i];
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

export function playBuildingSound(buildingName: string) {
  const minVolume = Math.min(soundService.globalVolume, 0.5);
  switch (buildingName) {
    case 'fields':
      soundService.playSound(SoundNames.buyFields, minVolume);
      break;
    case 'slave':
      soundService.playSound(SoundNames.buySlave, minVolume);
      break;
    case 'miner':
    case 'quarry':
      soundService.playSound(SoundNames.buyMiner, minVolume);
      break;
    case 'agricola':
      soundService.playSound(SoundNames.buyFarmer, minVolume + 0.1);
      break;
    case 'bakery':
    case 'baker':
      soundService.playSound(SoundNames.buyBaker, minVolume + 0.1);
      break;
    case 'mercator':
      soundService.playSound(SoundNames.buyMercator, minVolume);
      break;
    case 'smithy':
    case 'blacksmith':
      soundService.playSound(SoundNames.buySmith, minVolume);
      break;
    case 'legionary':
    case 'castra':
      soundService.playSound(SoundNames.buyLegionary, minVolume);
      break;
    case 'priest':
    case 'temple':
      soundService.playSound(SoundNames.buyPriest, minVolume + 0.2);
      break;
    case 'forum':
      soundService.playSound(SoundNames.buyForum, minVolume);
      break;
    default:
      break;
  }
}

export function hasAllShopItems(buildings: buildingCount, workers: workerCount): boolean {
  for (const key in buildings) {
    if (buildings[key as keyof buildingCount] < CONST_MAX_BUILDING_TYPE) {
      return false;
    }
  }

  for (const key in workers) {
    if (workers[key as keyof workerCount] < CONST_MAX_BUILDING_TYPE) {
      return false;
    }
  }

  return true;

  /* We can do this without iteration? */
  /*
    return Object.values(buildings).every((building) => building >= CONST_MAX_BUILDING_TYPE) &&
        Object.values(workers).every((worker) => worker >= CONST_MAX_BUILDING_TYPE);
    */
}

export function handleBuy(
  purchaseName: string,
  workerOrbuildingCount: buildingCount | workerCount,
  amountToPurchase: number,
  cost: priceData,
  setPurchaseCount: Function,
  setResources: Function,
  resources: playerResources,
): void {
  console.log('handle buy');

  if (cost === null) {
    console.error('trying to buy building with 0 cost. Shouldnt be possible');
    return;
  }

  toast.success(`Bought ${amountToPurchase} ${purchaseName}(s)`);

  //adding amount in case we implement buying in increments (ex 10 at a time)
  // increase building by amount
  setPurchaseCount({
    ...workerOrbuildingCount,
    [purchaseName]: workerOrbuildingCount[purchaseName as keyof (buildingCount | workerCount)] + amountToPurchase,
  });

  // setPurchaseCount((purchaseDraft) => {
  //   purchaseDraft[purchaseName as keyof (buildingCount | workerCount)] += amountToPurchase;
  // });

  // decrease resources by cost * amount
  setResources({
    gold: resources.gold - cost.costGold * amountToPurchase,
    stone: resources.stone - cost.costStone * amountToPurchase,
    grain: resources.grain - cost.costGrain * amountToPurchase,
  });
  playBuildingSound(purchaseName);
}
