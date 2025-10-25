import React, { useContext } from 'react';
import { SoundContext } from '../context/SoundContext';

interface ConfirmationModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, onCancel }) => {
    const { playClick } = useContext(SoundContext);

    const handleConfirm = () => {
        playClick();
        onConfirm();
    }

    const handleCancel = () => {
        playClick();
        onCancel();
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40 animate-fadeIn p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-gray-200">{title}</h3>
                <p className="text-slate-600 dark:text-gray-400 mt-2 mb-6">{message}</p>
                <div className="flex gap-4">
                    <button
                        onClick={handleCancel}
                        className="w-full bg-gray-200 dark:bg-gray-600 text-slate-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
                    >
                        Cancel
                    </button>
                     <button
                        onClick={handleConfirm}
                        className="w-full bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-red-600 transition-colors duration-300"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
