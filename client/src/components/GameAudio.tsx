'use client';

import { useEffect, useRef, useState } from 'react';

interface GameAudioProps {
  src?: string;
  volume?: number;
  loop?: boolean;
}

export default function GameAudio({ 
  src = '/sounds/town.mp3', 
  volume = 0.3,
  loop = true 
}: GameAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // 嘗試自動播放
    const playAudio = () => {
      if (audioRef.current && !isMuted) {
        audioRef.current.volume = volume;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log('播放被阻止:', err));
      }
    };

    // 使用者互動後嘗試播放（解決瀏覽器自動播放限制）
    const handleInteraction = () => {
      playAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [volume, isMuted]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        audioRef.current.play().catch(() => {});
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop={loop}
        preload="auto"
      />
      
      {/* 音樂控制按鈕 */}
      <button
        onClick={toggleMute}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 bg-gold-500 hover:bg-gold-600 rounded-full flex items-center justify-center shadow-lg transition-all"
        title={isMuted ? '開啟音樂' : '關閉音樂'}
      >
        {isMuted ? (
          <span className="text-white text-lg">🔇</span>
        ) : (
          <span className="text-white text-lg">🔊</span>
        )}
      </button>
    </>
  );
}