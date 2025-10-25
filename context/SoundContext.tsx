import React, { createContext, ReactNode } from 'react';
import { useSound } from '../hooks/useSound';

interface SoundContextType {
    isSoundEnabled: boolean;
    toggleSound: () => void;
    playCorrect: () => void;
    playIncorrect: () => void;
    playClick: () => void;
    playPurchase: () => void;
}

export const SoundContext = createContext<SoundContextType>({
    isSoundEnabled: true,
    toggleSound: () => {},
    playCorrect: () => {},
    playIncorrect: () => {},
    playClick: () => {},
    playPurchase: () => {},
});

interface SoundContextProviderProps {
    children: ReactNode;
}

export const SoundContextProvider: React.FC<SoundContextProviderProps> = ({ children }) => {
    const sound = useSound();
    return (
        <SoundContext.Provider value={sound}>
            {children}
        </SoundContext.Provider>
    );
};
