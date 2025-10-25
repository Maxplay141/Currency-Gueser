import { useState, useCallback, useRef, useEffect } from 'react';

export const useSound = () => {
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const audioCtxRef = useRef<AudioContext | null>(null);

    const initializeAudio = useCallback(() => {
        if (!audioCtxRef.current) {
            try {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("Web Audio API is not supported in this browser", e);
            }
        }
    }, []);

    useEffect(() => {
        const handleFirstInteraction = () => {
            initializeAudio();
            window.removeEventListener('click', handleFirstInteraction, { capture: true });
            window.removeEventListener('keydown', handleFirstInteraction, { capture: true });
        };
        // Use capture to ensure this runs before other click handlers that might play sounds
        window.addEventListener('click', handleFirstInteraction, { capture: true });
        window.addEventListener('keydown', handleFirstInteraction, { capture: true });

        return () => {
            window.removeEventListener('click', handleFirstInteraction, { capture: true });
            window.removeEventListener('keydown', handleFirstInteraction, { capture: true });
        };
    }, [initializeAudio]);

    const playSound = useCallback((type: OscillatorType, frequency: number, duration: number, volume: number = 1) => {
        if (!isSoundEnabled || !audioCtxRef.current) return;
        if(audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }

        const oscillator = audioCtxRef.current.createOscillator();
        const gainNode = audioCtxRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
        gainNode.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + duration);

        oscillator.start(audioCtxRef.current.currentTime);
        oscillator.stop(audioCtxRef.current.currentTime + duration);
    }, [isSoundEnabled]);

    const playCorrect = useCallback(() => {
        playSound('sine', 440, 0.1, 0.3);
        setTimeout(() => playSound('sine', 659.25, 0.15, 0.3), 100);
    }, [playSound]);

    const playIncorrect = useCallback(() => {
        playSound('sawtooth', 220, 0.2, 0.2);
    }, [playSound]);
    
    const playClick = useCallback(() => {
        playSound('triangle', 600, 0.05, 0.1);
    }, [playSound]);
    
    const playPurchase = useCallback(() => {
        playSound('sine', 523.25, 0.1, 0.3);
        setTimeout(() => playSound('sine', 783.99, 0.2, 0.3), 120);
    }, [playSound]);

    const toggleSound = useCallback(() => {
        initializeAudio();
        setIsSoundEnabled(prev => !prev);
    }, [initializeAudio]);

    return { isSoundEnabled, toggleSound, playCorrect, playIncorrect, playClick, playPurchase };
};
