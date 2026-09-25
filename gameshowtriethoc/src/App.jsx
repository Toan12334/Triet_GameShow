import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GameBoard from './components/GameBoard';
import SetupPanel from './components/SetupPanel';
import { SAMPLE_PACKS } from './utils/sampleData';
import { setSoundMuted, getSoundMuted, playClick, playBgm, pauseBgm, resumeBgm } from './utils/audio';

const STORAGE_KEY = 'gameshow_triethoc_game_data';


export default function App() {
  const [currentMode, setMode] = useState('play'); // 'play' | 'setup'
  
  // Load saved gameData from localStorage or fallback to default sample pack
  const [gameData, setGameData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(SAMPLE_PACKS[0]));
  });

  // Track which tiles are currently open (boolean array)
  const totalTiles = gameData.gridConfig.rows * gameData.gridConfig.cols;
  const [openedTiles, setOpenedTiles] = useState(() => new Array(totalTiles).fill(false));
  const [isMuted, setIsMuted] = useState(false);

  // Sync openedTiles length when totalTiles changes
  useEffect(() => {
    setOpenedTiles(new Array(totalTiles).fill(false));
  }, [totalTiles]);

  // Save gameData to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }, [gameData]);

  // Handle Background Music (BGM) playback with auto-looping
  useEffect(() => {
    if (currentMode === 'play' && gameData.bgAudioUrl && !isMuted) {
      playBgm(gameData.bgAudioUrl, 0.35);
    } else {
      pauseBgm();
    }
  }, [currentMode, gameData.bgAudioUrl, isMuted]);

  // Sound toggle
  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setSoundMuted(nextMuted);
    if (!nextMuted) {
      playClick();
      if (currentMode === 'play' && gameData.bgAudioUrl) {
        resumeBgm();
      }
    } else {
      pauseBgm();
    }
  };


  // Reset board (close all tiles)
  const handleResetBoard = () => {
    setOpenedTiles(new Array(totalTiles).fill(false));
  };

  const openedCount = openedTiles.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Top Navigation */}
      <Navbar
        currentMode={currentMode}
        setMode={setMode}
        gameData={gameData}
        setGameData={setGameData}
        isMuted={isMuted}
        toggleSound={toggleSound}
        onResetBoard={handleResetBoard}
        openedTilesCount={openedCount}
        totalTilesCount={totalTiles}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {currentMode === 'play' ? (
          <GameBoard
            gameData={gameData}
            openedTiles={openedTiles}
            setOpenedTiles={setOpenedTiles}
            onResetBoard={handleResetBoard}
            onGoToSetup={() => setMode('setup')}
          />
        ) : (
          <SetupPanel
            gameData={gameData}
            setGameData={setGameData}
            onStartPlay={() => {
              setMode('play');
              handleResetBoard();
            }}
          />
        )}
      </main>
    </div>
  );
}
