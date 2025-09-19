
import React, { useState, useRef, useEffect } from 'react';

const MusicOnIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
);

const MusicOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.27 3 3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4v3.61l2 2V3h-6v5.27L8.73 3zM19.73 21 16 17.27V15c.73 0 1.41.21 2 .55v-1.72l1.73 1.73z"/>
    </svg>
);

const MUSIC_URL = 'https://cdn.pixabay.com/audio/2022/08/25/audio_51591f3531.mp3';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (audioRef.current.paused) {
      audioRef.current.play().catch(error => {
        console.warn("Audio play was prevented.", error);
        // The 'pause' event listener will ensure the state is correct.
      });
    } else {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    const audioEl = audioRef.current;
    if (audioEl) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audioEl.addEventListener('play', handlePlay);
      audioEl.addEventListener('pause', handlePause);

      // Set initial state in case browser blocks autoplay
      setIsPlaying(!audioEl.paused);

      return () => {
        audioEl.removeEventListener('play', handlePlay);
        audioEl.removeEventListener('pause', handlePause);
      };
    }
  }, []);

  return (
    <>
      <audio ref={audioRef} src={MUSIC_URL} loop />
      <button
        onClick={togglePlayPause}
        className="fixed bottom-6 right-6 z-20 w-14 h-14 bg-red-600/80 backdrop-blur-sm hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out"
        aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
      >
        {isPlaying ? (
          <MusicOnIcon className="w-7 h-7" />
        ) : (
          <MusicOffIcon className="w-7 h-7 opacity-80" />
        )}
      </button>
    </>
  );
};

export default MusicPlayer;
