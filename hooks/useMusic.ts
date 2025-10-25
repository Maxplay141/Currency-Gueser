import { useState, useCallback, useRef, useEffect } from 'react';

const MUSIC_URL = 'https://storage.googleapis.com/vocal-generator-public/project-s-v2-previews/Internal-DEMO-ONLY/long/music/lo-fi.mp3';

export const useMusic = () => {
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hasInteracted = useRef(false);

    // Initialize Audio element
    useEffect(() => {
        const audio = new Audio(MUSIC_URL);
        audio.loop = true;
        audio.volume = 0.2; // Keep volume low to not be distracting
        audioRef.current = audio;

        const onPlay = () => setIsMusicPlaying(true);
        const onPause = () => setIsMusicPlaying(false);

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        
        return () => {
            audio.pause();
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
        };
    }, []);

    const toggleMusic = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        
        if (audio.paused) {
            audio.play().catch(e => console.warn("Music play failed. User may need to interact first.", e));
        } else {
            audio.pause();
        }
    }, []);
    
    // Handle browser autoplay policy: attempt to play on first user interaction.
    useEffect(() => {
        const enableAudioAndPlay = () => {
            if (!hasInteracted.current) {
                hasInteracted.current = true;
                toggleMusic();
            }
            // remove listeners after first interaction to avoid re-triggering
            window.removeEventListener('click', enableAudioAndPlay);
            window.removeEventListener('keydown', enableAudioAndPlay);
        };

        window.addEventListener('click', enableAudioAndPlay);
        window.addEventListener('keydown', enableAudioAndPlay);

        return () => {
            window.removeEventListener('click', enableAudioAndPlay);
            window.removeEventListener('keydown', enableAudioAndPlay);
        };
    }, [toggleMusic]);


    return { isMusicPlaying, toggleMusic };
};
