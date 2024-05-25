import { useAtomValue, useSetAtom } from 'jotai';
import TownNameChangerDialog from '~/components/modals/town-name-changer-dialog';
import { BASE_CITIZEN_COUNT } from '~/constants/defaults';
import { setContentAtom, townNameAtom, workersAtom } from '~/store/atoms';

export default function PopulationView() {
  const workers = useAtomValue(workersAtom);
  const townName = useAtomValue(townNameAtom);
  const setIsModalOpen = useSetAtom(setContentAtom);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 p-4 text-white">
      <button
        type="button"
        onClick={() =>
          setIsModalOpen({
            title: 'Change town name',
            content: <TownNameChangerDialog />,
            onClose: (val) => console.log(`modal closed. Here's the value we cooked up => ${val}`),
          })
        }
      >
        <h1 className="text-3xl">{townName}</h1>
      </button>
      {/* should show in </PopulationView> */}
      {/* <p>Population: {Object.values(workers).reduce((a, b) => a + b, 0) + BASE_CITIZEN_COUNT}</p> */}
    </div>
  );
}

