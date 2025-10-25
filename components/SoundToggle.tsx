import React, { useContext } from 'react';
import { SoundContext } from '../context/SoundContext';

const SoundOnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const SoundOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2L17 8m2 2l2 2" />
    </svg>
);

const SoundToggle: React.FC = () => {
    const { isSoundEnabled, toggleSound, playClick } = useContext(SoundContext);

    const handleToggle = () => {
        playClick();
        toggleSound();
    }

    return (
        <button
            onClick={handleToggle}
            className="p-2 rounded-full bg-slate-200 dark:bg-gray-700 text-slate-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-gray-900 focus:ring-emerald-500"
            aria-label={isSoundEnabled ? "Mute sounds" : "Unmute sounds"}
        >
            {isSoundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
        </button>
    );
};

export default SoundToggle;
