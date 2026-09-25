import React, { useState } from 'react';
import { 
  Trophy, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Tile from './Tile';
import QuestionModal from './QuestionModal';
import GuessModal from './GuessModal';
import VictoryModal from './VictoryModal';
import { playClick, playFlip, playCorrect, isBgmPlaying, pauseBgm, resumeBgm } from '../utils/audio';


export default function GameBoard({
  gameData,
  openedTiles,
  setOpenedTiles,
  onResetBoard,
  onGoToSetup
}) {
  const [activeQuestionTile, setActiveQuestionTile] = useState(null);
  const [isGuessModalOpen, setIsGuessModalOpen] = useState(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const [gameStats, setGameStats] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    totalAttempts: 0
  });

  const { rows, cols } = gameData.gridConfig;
  const totalTiles = rows * cols;
  const openedCount = openedTiles.filter(Boolean).length;
  const isAllOpened = openedCount === totalTiles && totalTiles > 0;

  // Handle clicking a tile to answer question
  const handleTileClick = (index) => {
    setActiveQuestionTile(index);
  };

  // When question is answered in QuestionModal
  const handleAnswerResult = (isCorrect) => {
    setGameStats((prev) => ({
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: prev.wrongAnswers + (!isCorrect ? 1 : 0),
      totalAttempts: prev.totalAttempts + 1
    }));

    if (isCorrect && activeQuestionTile !== null) {
      setOpenedTiles((prev) => {
        const next = [...prev];
        next[activeQuestionTile] = true;
        
        // Check if this was the last tile
        const nextOpenedCount = next.filter(Boolean).length;
        if (nextOpenedCount === totalTiles) {
          setTimeout(() => {
            setIsVictoryModalOpen(true);
          }, 800);
        }
        return next;
      });
    }
  };

  // When player guesses mystery picture successfully
  const handleGuessSuccess = () => {
    // Open all tiles with staggered animation
    const allOpened = new Array(totalTiles).fill(true);
    setOpenedTiles(allOpened);
    setTimeout(() => {
      setIsVictoryModalOpen(true);
    }, 600);
  };

  // Host button to reveal all tiles immediately
  const handleRevealAll = () => {
    playClick();
    playFlip();
    const allOpened = new Array(totalTiles).fill(true);
    setOpenedTiles(allOpened);
  };

  // Host button to close all tiles
  const handleHideAll = () => {
    playClick();
    onResetBoard();
  };

  // Calculate dynamic grid template columns & rows
  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
  };

  const accuracy = gameStats.totalAttempts > 0
    ? Math.round((gameStats.correctAnswers / gameStats.totalAttempts) * 100)
    : 100;

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-between overflow-hidden">
      {/* Dynamic Game Show Background */}
      {gameData.bgImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 -z-10"
          style={{ backgroundImage: `url("${gameData.bgImageUrl}")` }}
        >
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.9)_100%)]" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 -z-10" />
      )}

      {/* Decorative ambient glowing lights */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Game Stage Banner & Stats */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-6 sm:pt-8 pb-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950/70 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl">
          {/* Left: Round Title & Topic */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                VÒNG KHÁM PHÁ
              </span>
              <span className="text-xs text-slate-400">
                Lưới: {rows}x{cols} ({totalTiles} Mảnh ghép)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-wide">
              {gameData.title || 'Mảnh Ghép Bí Ẩn'}
            </h2>
          </div>

          {/* Center: Guess Mystery Picture Master Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClick();
                setIsGuessModalOpen(true);
              }}
              className="relative group px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black font-orbitron tracking-wider text-sm sm:text-base shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-300 gameshow-gold-glow overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-slate-950 animate-bounce" />
                <span>ĐOÁN BỨC ẢNH BÍ ẨN</span>
              </div>
            </button>
          </div>

          {/* Right: Score and Progress counter */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 shadow-inner">
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Đã Mở</span>
              <span className="font-orbitron font-black text-lg text-amber-400">
                {openedCount}/{totalTiles}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-800" />

            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tiến Độ</span>
              <span className="font-orbitron font-black text-lg text-emerald-400">
                {Math.round((openedCount / (totalTiles || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Stage: The Picture Puzzle Grid Container */}
      <div className="max-w-4xl mx-auto w-full px-4 py-2 flex-1 flex flex-col items-center justify-center">
        {/* Dynamic Grid Board with Aspect Ratio wrapper */}
        <div className="relative w-full max-w-[760px] aspect-square p-3 sm:p-4 rounded-3xl bg-slate-950/80 backdrop-blur-2xl border-2 border-amber-500/40 shadow-2xl gameshow-gold-glow flex items-center justify-center">
          {/* Subtle Background Glow behind the picture */}
          <div className="absolute inset-2 rounded-2xl overflow-hidden pointer-events-none opacity-20">
            {gameData.mainImageUrl && (
              <img
                src={gameData.mainImageUrl}
                alt="Background preview"
                className="w-full h-full object-cover blur-sm"
              />
            )}
          </div>

          {/* CSS Grid */}
          <div
            className="grid gap-2 sm:gap-3 w-full h-full relative z-10"
            style={gridStyle}
          >
            {gameData.questions.map((q, idx) => (
              <Tile
                key={q.id || idx}
                index={idx}
                total={totalTiles}
                rows={rows}
                cols={cols}
                isOpen={!!openedTiles[idx]}
                mainImageUrl={gameData.mainImageUrl}
                onTileClick={handleTileClick}
                question={q}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Host / MC Control Bar */}
      <div className="max-w-7xl mx-auto w-full px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-2xl px-5 py-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Công Cụ Điều Khiển MC:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Background Music Toggle */}
            {gameData.bgAudioUrl && (
              <button
                onClick={() => {
                  playClick();
                  if (isBgmPlaying()) {
                    pauseBgm();
                  } else {
                    resumeBgm();
                  }
                }}
                className={`px-3 py-1.5 border rounded-xl flex items-center gap-1.5 transition-colors font-medium ${
                  isBgmPlaying()
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="Tạm dừng / Bật nhạc nền Game Show (Tự động lặp lại)"
              >
                <span>🎵</span>
                <span>{isBgmPlaying() ? 'Nhạc Nền: Đang Phát' : 'Nhạc Nền: Tạm Dừng'}</span>
              </button>
            )}

            {/* Reveal all */}
            <button
              onClick={handleRevealAll}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-300 rounded-xl flex items-center gap-1.5 transition-colors"
              title="Mở tất cả các mảnh ghép cùng lúc"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Mở Hết Mảnh</span>
            </button>

            {/* Hide all */}
            <button
              onClick={handleHideAll}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 rounded-xl flex items-center gap-1.5 transition-colors"
              title="Đóng tất cả các mảnh lại"
            >
              <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
              <span>Đóng Hết Mảnh</span>
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                playClick();
                onResetBoard();
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-red-400 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-400" />
              <span>Khởi Động Lại Vòng</span>
            </button>
          </div>

        </div>
      </div>

      {/* Modals */}
      {activeQuestionTile !== null && (
        <QuestionModal
          isOpen={activeQuestionTile !== null}
          tileIndex={activeQuestionTile}
          question={gameData.questions[activeQuestionTile]}
          onClose={() => setActiveQuestionTile(null)}
          onAnswerResult={handleAnswerResult}
        />
      )}

      <GuessModal
        isOpen={isGuessModalOpen}
        secretAnswer={gameData.secretAnswer}
        onClose={() => setIsGuessModalOpen(false)}
        onGuessSuccess={handleGuessSuccess}
      />

      <VictoryModal
        isOpen={isVictoryModalOpen}
        gameData={gameData}
        onClose={() => setIsVictoryModalOpen(false)}
        onResetBoard={onResetBoard}
        onGoToSetup={onGoToSetup}
        stats={{
          openedCount,
          accuracy
        }}
      />
    </div>
  );
}
