import React, { useState, useContext } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { SoundContext } from '../context/SoundContext';
import SoundToggle from './SoundToggle';
import MusicToggle from './MusicToggle';

interface PauseMenuProps {
    onResume: () => void;
    onLeave: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onLeave }) => {
    const [isConfirmingLeave, setIsConfirmingLeave] = useState(false);
    const { playClick } = useContext(SoundContext);

    const handleResume = () => {
        playClick();
        onResume();
    }
    
    const handleLeave = () => {
        playClick();
        onLeave();
    }

    const handleLeaveClick = () => {
        playClick();
        setIsConfirmingLeave(true);
    }
    
    if(isConfirmingLeave) {
        return (
            <ConfirmationModal 
                title="Leave Game?"
                message="Your current progress will be lost. Are you sure you want to quit?"
                onConfirm={handleLeave}
                onCancel={() => setIsConfirmingLeave(false)}
            />
        )
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-8">
                    Paused
                </h2>
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={handleResume}
                        className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                    >
                        Resume
                    </button>
                    <button
                        onClick={handleLeaveClick}
                        className="w-full bg-gray-200 dark:bg-gray-600 text-slate-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
                    >
                        Leave Game
                    </button>
                </div>
                 <div className="flex justify-center gap-4 mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <MusicToggle />
                    <SoundToggle />
                </div>
            </div>
        </div>
    );
};

export default PauseMenu;
