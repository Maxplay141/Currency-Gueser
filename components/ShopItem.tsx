import React, { useContext } from 'react';
import { Theme, CurrencyPack } from '../types';
import { SoundContext } from '../context/SoundContext';

type ShopItemProps = {
    type: 'theme' | 'pack';
    item: Theme | CurrencyPack;
    isOwned: boolean;
    isActive?: boolean;
    canAfford: boolean;
    onBuy: () => void;
    onEquip?: () => void;
};

const ThemePreview: React.FC<{ theme: Theme }> = ({ theme }) => (
    <div className="flex -space-x-2 overflow-hidden">
        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" style={{ backgroundColor: `rgb(${theme.colors.primary})` }}></div>
        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" style={{ backgroundColor: `rgb(${theme.colors.secondary})` }}></div>
        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" style={{ backgroundColor: `rgb(${theme.colors.accent})` }}></div>
    </div>
);


const ShopItem: React.FC<ShopItemProps> = ({ type, item, isOwned, isActive, canAfford, onBuy, onEquip }) => {
    const { playClick, playPurchase } = useContext(SoundContext);
    const isTheme = (item: Theme | CurrencyPack): item is Theme => type === 'theme';
    
    const handleBuy = () => {
        playPurchase();
        onBuy();
    };

    const handleEquip = () => {
        if(onEquip) {
            playClick();
            onEquip();
        }
    };

    const renderButton = () => {
        if (isOwned) {
            if (type === 'theme') {
                if (isActive) {
                    return <button disabled className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg opacity-70 cursor-not-allowed">Equipped</button>;
                }
                return <button onClick={handleEquip} className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">Equip</button>;
            }
            return <button disabled className="w-full bg-slate-500 text-white font-bold py-2 px-4 rounded-lg opacity-70 cursor-not-allowed">Owned</button>;
        }
        
        return (
            <button onClick={handleBuy} disabled={!canAfford} className="w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                Buy for {item.price}
            </button>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between gap-4">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-gray-200">{item.name}</h3>
                    {isTheme(item) && <ThemePreview theme={item} />}
                </div>
                {'description' in item && <p className="text-slate-500 dark:text-gray-400 mt-2">{item.description}</p>}
            </div>
            {renderButton()}
        </div>
    );
};

export default ShopItem;