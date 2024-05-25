import { GLOBAL_EVENTS, NOTHING_EVENT } from '~/constants/events';
import { getRandomEvent } from '~/lib/events-logic';
import { eventData } from '~/types/game-data-types';
import NewspaperHeadline from '../game/misc/newspaper-headline';
import { eventsAtom } from '~/store/atoms';
import { useAtomValue } from 'jotai';

interface IPropsEventDisplay {
  className?: string;
}

const EventDisplay = ({ className = '' }: IPropsEventDisplay) => {
  // If no event is passed, get a random
  const event = useAtomValue(eventsAtom);

  return (
    <div className="bg-scroll p-4 text-gray-700">
      <NewspaperHeadline headline={event.name} />
      <h1>{JSON.stringify(event)}</h1>
    </div>
  );
};

export default EventDisplay;
