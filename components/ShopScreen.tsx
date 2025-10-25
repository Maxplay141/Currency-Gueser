import React, { useContext } from 'react';
import { PlayerDataContext } from '../context/PlayerDataContext';
import { THEMES, CURRENCY_PACKS } from '../constants';
import ShopItem from './ShopItem';
import { SoundContext } from '../context/SoundContext';

interface ShopScreenProps {
  onGoHome: () => void;
}

const ShopScreen: React.FC<ShopScreenProps> = ({ onGoHome }) => {
  const { playerData, spendCoins, unlockTheme, setActiveTheme, unlockCurrencyPack } = useContext(PlayerDataContext);
  const { playClick } = useContext(SoundContext);

  const handleGoHome = () => {
    playClick();
    onGoHome();
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
      <header className="flex justify-between items-center mb-8 mt-12">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Shop
        </h1>
        <button
        onClick={handleGoHome}
        className="bg-gray-200 dark:bg-gray-600 text-slate-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
        >
        &larr; Back to Menu
        </button>
      </header>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-slate-700 dark:text-gray-300 mb-6 border-b-2 border-primary/30 pb-3">
            Themes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {THEMES.map(theme => (
              <ShopItem
                key={theme.id}
                item={theme}
                type="theme"
                isOwned={playerData.unlockedThemeIds.includes(theme.id)}
                isActive={playerData.activeThemeId === theme.id}
                canAfford={playerData.coins >= theme.price}
                onBuy={() => {
                  spendCoins(theme.price);
                  unlockTheme(theme.id);
                  setActiveTheme(theme.id);
                }}
                onEquip={() => setActiveTheme(theme.id)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-slate-700 dark:text-gray-300 mb-6 border-b-2 border-secondary/30 pb-3">
            Currency Packs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CURRENCY_PACKS.map(pack => (
               <ShopItem
                key={pack.id}
                item={pack}
                type="pack"
                isOwned={pack.currencyIds.every(id => playerData.unlockedCurrencyIds.includes(id))}
                canAfford={playerData.coins >= pack.price}
                onBuy={() => {
                  spendCoins(pack.price);
                  unlockCurrencyPack(pack.currencyIds);
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShopScreen;