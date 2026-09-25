import React, { useEffect } from 'react';
import { Trophy, Sparkles, RotateCcw, Settings, Star, Award, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playFanfare, playClick } from '../utils/audio';

export default function VictoryModal({
  isOpen,
  gameData,
  onClose,
  onResetBoard,
  onGoToSetup,
  stats
}) {
  useEffect(() => {
    if (isOpen) {
      playFanfare();

      // Multi-stage confetti celebration
      const end = Date.now() + 3000;
      const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#fbbf24'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-400 rounded-3xl shadow-2xl overflow-hidden gameshow-gold-glow my-8">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:16px_16px]" />
          
          <div className="relative z-10">
            <div className="w-18 h-18 sm:w-20 sm:h-20 mx-auto mb-3 rounded-full bg-slate-950 p-2 shadow-2xl flex items-center justify-center border-2 border-amber-300 animate-bounce">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-5 h-5 text-slate-950 fill-slate-950" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-950 font-orbitron">
                CHIẾN THẮNG TUYỆT ĐỐI
              </span>
              <Star className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-orbitron tracking-tight drop-shadow-sm">
              KHÁM PHÁ BỨC ẢNH THÀNH CÔNG!
            </h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {/* Main Image Revealed Card */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl mb-6 group">
            <img
              src={gameData.mainImageUrl}
              alt="Bức ảnh bí ẩn"
              className="w-full max-h-[360px] object-cover sm:object-contain bg-slate-950 mx-auto transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 sm:p-6">
              <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider font-orbitron">
                Bức Ảnh Bí Ẩn
              </span>
              <h3 className="text-lg sm:text-2xl font-bold text-white mt-1">
                {gameData.secretAnswer || gameData.title || 'Bức tranh hoàn chỉnh'}
              </h3>
              {gameData.description && (
                <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2">
                  {gameData.description}
                </p>
              )}
            </div>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block mb-1">Mảnh Ghép Đã Mở</span>
              <span className="text-xl sm:text-2xl font-black font-orbitron text-amber-400">
                {stats?.openedCount || gameData.questions.length} / {gameData.questions.length}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block mb-1">Độ Chính Xác</span>
              <span className="text-xl sm:text-2xl font-black font-orbitron text-emerald-400">
                {stats?.accuracy || 100}%
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl text-center col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400 block mb-1">Kích Thước Lưới</span>
              <span className="text-xl sm:text-2xl font-black font-orbitron text-cyan-400">
                {gameData.gridConfig.rows} x {gameData.gridConfig.cols}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                playClick();
                onResetBoard();
                onClose();
              }}
              className="w-full sm:flex-1 py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl font-orbitron tracking-wider text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <RotateCcw className="w-5 h-5 text-slate-950" />
              <span>CHƠI LẠI VÒNG NÀY</span>
            </button>

            <button
              onClick={() => {
                playClick();
                onGoToSetup();
                onClose();
              }}
              className="w-full sm:flex-1 py-3.5 px-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Settings className="w-5 h-5 text-cyan-400" />
              <span>CHỈNH SỬA / ĐỀ MỚI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
