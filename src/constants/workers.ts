type workersData = {
  name: string;
  description: string;
  costGold: number;
  costGrain: number;
  costStone: number;
  goldPerClick: number;
  grainPerClick: number;
  stonePerClick: number;
};

const workers: workersData[] = [
  {
    name: 'Slave',
    description: "Multipurpose worker and someone's property. May be granted citizenship one day",
    costGold: 1,
    costGrain: 15,
    costStone: 0,
    goldPerClick: 1,
    grainPerClick: 1,
    stonePerClick: 1,
  },
  {
    name: 'Farmer',
    description: 'People dedicated to the craft of the land. Actually mostly slaves. ',
    costGold: 5,
    costGrain: 50,
    costStone: 0,
    goldPerClick: 0,
    grainPerClick: 3,
    stonePerClick: 0,
  },
  {
    name: 'Miner',
    description: 'Workers for the mines. Ill-fated people, likely to face death. Good for the economy, though.',
    costGold: 5,
    costGrain: 50,
    costStone: 0,
    goldPerClick: 1,
    grainPerClick: 0,
    stonePerClick: 3,
  },
  {
    name: 'Baker',
    description: 'Keeps the people fed. Makes some good bread.',
    costGold: 30,
    costGrain: 250,
    costStone: 0,
    goldPerClick: 10,
    grainPerClick: 0,
    stonePerClick: 0,
  },
  {
    name: 'Mercatores',
    description: 'Sells goods. Buys goods. Makes the markets lively.',
    costGold: 1500,
    costGrain: 800,
    costStone: 0,
    goldPerClick: 10,
    grainPerClick: 30,
    stonePerClick: 10,
  },
  {
    name: 'Blacksmith',
    description: 'Skilled worker, covers a wide array of needs of the roman people.',
    costGold: 2500,
    costGrain: 3000,
    costStone: 0,
    goldPerClick: 50,
    grainPerClick: 10,
    stonePerClick: 0,
  },
  {
    name: 'Legionary',
    description: 'Soldiers, security and even builders. Legionaries are really versatile.',
    costGold: 10000,
    costGrain: 5000,
    costStone: 0,
    goldPerClick: 100,
    grainPerClick: 40,
    stonePerClick: 0,
  },
  {
    name: 'Priest',
    description: 'Tends to the temples, holds rituals and receives offerings',
    costGold: 20000,
    costGrain: 8000,
    costStone: 0,
    goldPerClick: 150,
    grainPerClick: 90,
    stonePerClick: 0,
  },
];

export default workers;
