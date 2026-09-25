import React from 'react';
import { HelpCircle, CheckCircle2, Lock } from 'lucide-react';
import { playClick } from '../utils/audio';

export default function Tile({
  index,
  total,
  rows,
  cols,
  isOpen,
  mainImageUrl,
  onTileClick,
  question
}) {
  const colIndex = index % cols;
  const rowIndex = Math.floor(index / cols);

  const posX = cols > 1 ? (colIndex / (cols - 1)) * 100 : 0;
  const posY = rows > 1 ? (rowIndex / (rows - 1)) * 100 : 0;

  const bgStyle = {
    backgroundImage: `url("${mainImageUrl}")`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${posX}% ${posY}%`,
    backgroundRepeat: 'no-repeat'
  };

  const handleClick = () => {
    if (!isOpen) {
      playClick();
      onTileClick(index);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative w-full h-full perspective-1000 select-none group ${
        isOpen ? 'cursor-default' : 'cursor-pointer'
      }`}
      style={{ minHeight: '60px' }}
    >
      <div
        className={`w-full h-full duration-700 transform-style-3d transition-transform ${
          isOpen ? 'rotate-y-180' : 'hover:-translate-y-1'
        }`}
      >
        {/* FRONT: CLOSED TILE (GAME SHOW SHIELD) */}
        <div className="absolute inset-0 backface-hidden w-full h-full rounded-xl overflow-hidden shadow-lg border border-amber-500/40 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-2 group-hover:border-amber-400 group-hover:shadow-amber-500/30 group-hover:shadow-2xl transition-all duration-300">
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:12px_12px]" />
          
          {/* Glowing center badge */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-slate-950/90 flex items-center justify-center border border-amber-400/50">
                <span className="font-orbitron font-black text-base sm:text-xl md:text-2xl text-transparent bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text drop-shadow">
                  {index + 1}
                </span>
              </div>
            </div>
            
            <span className="mt-1 text-[9px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:text-amber-300">
              <HelpCircle className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Mảnh</span> #{index + 1}
            </span>
          </div>

          {/* Golden corners */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-amber-400/70 rounded-tl-sm" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-amber-400/70 rounded-tr-sm" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-amber-400/70 rounded-bl-sm" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-amber-400/70 rounded-br-sm" />
        </div>

        {/* BACK: REVEALED IMAGE PIECE */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-xl overflow-hidden shadow-inner border border-amber-400/30 bg-slate-900 transition-all"
          style={bgStyle}
        >
          {/* Subtle shine badge indicating unmasked slice */}
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-md border border-emerald-500/50 flex items-center gap-1 text-[10px] font-bold text-emerald-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span className="font-orbitron">#{index + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
