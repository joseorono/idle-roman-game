import { eventData } from '~/types/game-data-types';

export const GLOBAL_EVENTS: Array<eventData> = [
  {
    id: 1,
    probability: 0.05,
    name: 'Bountiful Harvest',
    description: 'The village experiences an exceptionally good harvest season.',
    grain: 100,
  },
  {
    id: 2,
    probability: 0.15,
    name: 'Trade Caravan',
    description: 'A trade caravan passes through, bringing wealth to the village.',
    gold: 50,
    grain: 20,
    stone: 10,
  },
  {
    id: 3,
    probability: 0.1,
    name: 'New Settlers',
    description: 'New settlers arrive, increasing the village’s workforce and economy.',
    gold: 30,
    grain: 30,
    stone: 20,
    slave: 1,
    agricola: 1,
  },
  {
    id: 4,
    probability: 0.1,
    name: 'Bandit Raid',
    description: 'Bandits raid the village, stealing resources.',
    gold: -40,
    grain: -50,
    stone: -10,
  },
  {
    id: 5,
    probability: 0.1,
    name: 'Drought',
    description: 'A severe drought reduces the village’s grain production.',
    grain: -70,
  },
  {
    id: 6,
    probability: 0.1,
    name: 'Earthquake',
    description: 'An earthquake damages buildings and infrastructure.',
    gold: -20,
    stone: -50,
    fields: -1,
    quarry: -1,
  },
  {
    id: 7,
    probability: 0.05,
    name: 'Festival',
    description: 'A successful festival boosts morale and trade.',
    gold: 40,
    grain: 10,
  },
  {
    id: 8,
    probability: 0.05,
    name: 'Invention',
    description: 'An inventor in the village creates a tool that increases productivity.',
    grain: 50,
    stone: 20,
  },
  {
    id: 9,
    probability: 0.1,
    name: 'Flood',
    description: 'A flood devastates the village, causing significant losses.',
    gold: -30,
    grain: -80,
    stone: -20,
    fields: -1,
  },
  {
    id: 10,
    probability: 0.2,
    name: 'Peace Treaty',
    description: 'A peace treaty with neighboring tribes allows for increased trade and security.',
    gold: 60,
    grain: 30,
    stone: 10,
    mercator: 1,
  },
] as const;