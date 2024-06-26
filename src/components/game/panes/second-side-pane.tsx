import { useState } from 'react';
import BuildingsShop from '../shop/buildings-shop';
import WorkersShop from '../shop/workers-shop';
import { SoundNames, soundService } from '~/services/sound-service';
import PlayerLevelUpgrades from '../key/player-level-upgrades';

const VALID_SHOP_TABS = ['workers', 'buildings'] as const;
type ShopTab = (typeof VALID_SHOP_TABS)[number];

export default function SecondSidePane({ className = '' }) {
  const [currentTab, setTab] = useState<ShopTab>('workers');

  const isWorkersTab = currentTab === 'workers';

  const handleTabChange = (tab: ShopTab) => {
    soundService.playSound(SoundNames.click, 0.2, 0.1);
    setTab(tab);
  };

  return (
    <div className={className}>
      <div className="SectionHeader ">Upgrades</div>
      <PlayerLevelUpgrades />

      <div className="SectionHeader ">Store</div>

      <div className="store-wrapper overflow-auto">
        <div role="tablist" className="tabs tabs-bordered sticky top-0 z-50 mb-2 bg-[#3e4f59] pt-2">
          <a
            role="tab"
            onMouseDown={() => handleTabChange('workers')}
            className={'tab h-auto !p-1 !text-xl leading-none ' + (isWorkersTab ? 'tab-active font-bold' : '')}
          >
            Workers
          </a>
          <a
            role="tab"
            onMouseDown={() => handleTabChange('buildings')}
            className={'tab h-auto !p-1 !text-xl leading-none  ' + (isWorkersTab ? '' : 'tab-active font-bold')}
          >
            Buildings
          </a>
        </div>
        <div className={`${isWorkersTab ? '!hidden' : ''}`}>
          <BuildingsShop />
        </div>
        <div className={isWorkersTab ? '' : '!hidden'}>
          <WorkersShop />
        </div>
      </div>
    </div>
  );
}
