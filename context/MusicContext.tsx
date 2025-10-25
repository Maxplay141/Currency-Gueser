import React, { createContext, ReactNode } from 'react';
import { useMusic } from '../hooks/useMusic';

interface MusicContextType {
    isMusicPlaying: boolean;
    toggleMusic: () => void;
}

export const MusicContext = createContext<MusicContextType>({
    isMusicPlaying: false,
    toggleMusic: () => {},
});

interface MusicContextProviderProps {
    children: ReactNode;
}

export const MusicContextProvider: React.FC<MusicContextProviderProps> = ({ children }) => {
    const music = useMusic();
    return (
        <MusicContext.Provider value={music}>
            {children}
        </MusicContext.Provider>
    );
};
