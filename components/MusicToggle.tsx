import React, { useContext } from 'react';
import { MusicContext } from '../context/MusicContext';
import { SoundContext } from '../context/SoundContext';
import MusicOnIcon from './icons/MusicOnIcon';
import MusicOffIcon from './icons/MusicOffIcon';

const MusicToggle: React.FC = () => {
    const { isMusicPlaying, toggleMusic } = useContext(MusicContext);
    const { playClick } = useContext(SoundContext);
    
    const handleToggle = () => {
        playClick();
        toggleMusic();
    };

    return (
        <button
            onClick={handleToggle}
            className="p-2 rounded-full bg-slate-200 dark:bg-gray-700 text-slate-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-gray-900 focus:ring-emerald-500"
            aria-label={isMusicPlaying ? "Mute music" : "Unmute music"}
        >
            {isMusicPlaying ? <MusicOnIcon /> : <MusicOffIcon />}
        </button>
    );
};

export default MusicToggle;
