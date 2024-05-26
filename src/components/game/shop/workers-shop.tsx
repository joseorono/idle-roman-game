import { useAtom } from 'jotai';
import { CONST_MAX_BUILDING_TYPE } from '~/constants/defaults';
import { WORKERS } from '~/constants/workers';
import { canAffordWorker, getWorkerCost, playBuildingSound } from '~/lib/resources';
import { resourcesAtom, workersAtom } from '~/store/atoms';
import { priceData, workerKeys } from '~/types/game-data-types';

export default function WorkersShop() {
  const [workersCount, setworkersCount] = useAtom(workersAtom);
  // this one is for testing, ideally this  atom should be passed through props
  const [resources, setResources] = useAtom(resourcesAtom);

  const handleBuy = (workerName: workerKeys, workerCount: number, amount: number, cost: priceData | null) => {
    console.log('handle buy');

    if (cost === null) {
      console.error('trying to buy building with 0 cost. Shouldnt be possible');
      return;
    }
    //adding amount in case we implement buying in increments (ex 10 at a time)
    // increase building by amount
    setworkersCount({ ...workersCount, [workerName]: workerCount + amount });
    // decrease resources by cost * amount
    setResources({
      gold: resources.gold - cost.costGold * amount,
      stone: resources.stone - cost.costStone * amount,
      grain: resources.grain - cost.costGrain * amount,
    });
    playBuildingSound(workerName);
  };

  return (
    <>
      <div className="building-store-wrapper">
        {Object.entries(WORKERS).map(([workerName, workerData]) => {
          const workerKey = workerName as workerKeys;
          const workerCost = getWorkerCost(workerData.id);
          const workerCount = workersCount[workerKey];
          const canAfford = canAffordWorker(workerData.id, resources);
          const maxCapacity = workerCount >= CONST_MAX_BUILDING_TYPE;
          return (
            <div key={workerData.id} className={`worker-${workerData.name} flex flex-row p-2`}>
              <div className="mr-2 flex h-[100px] basis-1/4 items-center justify-center border-2 border-solid border-white">
                buildIcon
              </div>
              <div className="flex-column basis-2/4">
                <h2>{workerData.name}</h2>
                <h3>{workerData.description}</h3>
                <p>current amount: {workerCount}</p>
                <p>
                  cost: {workerCost?.costGold}🪙 / {workerCost?.costGrain}🌾 / {workerCost?.costStone}🪨
                </p>
              </div>
              <button
                className="ml-2 flex h-[100px] basis-1/4 items-center justify-center border-2 border-solid border-white"
                type="button"
                disabled={maxCapacity || !canAfford}
                onClick={() => handleBuy(workerKey, workerCount, 1, workerCost)}
              >
                BUY
              </button>
              {/* <button
                className="ml-2 flex h-[100px] basis-1/4 items-center justify-center border-2 border-solid border-white"
                type="button"
                // disabled={maxCapacity || !canAfford}
                onClick={() => handleBuy(workerKey, workerCount, -1, workerCost)}
              >
                (debug) SELL!?
              </button> */}
            </div>
          );
        })}
      </div>
    </>
  );
}
