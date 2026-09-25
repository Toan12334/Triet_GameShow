import React, { useState } from 'react';
import { HelpCircle, Check, X, Sparkles, Trophy, Eye, Lock } from 'lucide-react';
import { playCorrect, playIncorrect, playClick } from '../utils/audio';

export default function GuessModal({
  isOpen,
  secretAnswer,
  onClose,
  onGuessSuccess
}) {
  const [guessInput, setGuessInput] = useState('');
  const [showHostAnswer, setShowHostAnswer] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleHostConfirm = (isCorrect) => {
    playClick();
    if (isCorrect) {
      playCorrect();
      onGuessSuccess();
      onClose();
    } else {
      playIncorrect();
      setErrorMessage('❌ Đáp án chưa chính xác! Hãy tiếp tục lật mở các mảnh ghép để tìm thêm manh mối.');
    }
  };

  const handlePlayerSubmit = (e) => {
    e.preventDefault();
    if (!guessInput.trim()) return;

    // Normalize comparison
    const cleanGuess = guessInput.trim().toLowerCase();
    const cleanSecret = (secretAnswer || '').trim().toLowerCase();

    // Check if guess matches secret answer
    if (cleanSecret && (cleanSecret.includes(cleanGuess) || cleanGuess.includes(cleanSecret))) {
      playCorrect();
      onGuessSuccess();
      onClose();
    } else {
      playIncorrect();
      setErrorMessage(`❌ Đáp án "${guessInput}" chưa chính xác!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden gameshow-gold-glow">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-950 to-amber-950 p-6 border-b border-amber-500/30 text-center relative">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg flex items-center justify-center animate-bounce">
            <Trophy className="w-8 h-8 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black font-orbitron bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            ĐOÁN BỨC ẢNH BÍ ẨN
          </h2>
          <p className="text-xs text-amber-200/80 mt-1 font-medium">
            Cơ hội chiến thắng toàn bộ vòng chơi và lật mở toàn cảnh bức tranh!
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handlePlayerSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Nhập câu trả lời hoặc dự đoán của bạn:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={guessInput}
                  onChange={(e) => {
                    setGuessInput(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Ví dụ: Karl Marx, Tháp Eiffel, Vịnh Hạ Long..."
                  className="w-full px-5 py-3.5 bg-slate-950/90 border-2 border-amber-500/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20 text-base font-semibold transition-all"
                  autoFocus
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs sm:text-sm animate-shake">
                {errorMessage}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl font-orbitron tracking-wider text-base shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>XÁC NHẬN ĐÁP ÁN</span>
              </button>
            </div>
          </form>

          {/* Host / MC Quick Verification Section */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Dành cho Ban Giám Khảo / MC
              </span>
              <button
                type="button"
                onClick={() => setShowHostAnswer(!showHostAnswer)}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                {showHostAnswer ? 'Ẩn đáp án bí mật' : 'Xem đáp án bí mật'}
              </button>
            </div>

            {showHostAnswer && (
              <div className="p-3 mb-4 bg-slate-950/80 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                <span className="font-bold text-white">Đáp án thiết lập: </span>
                {secretAnswer || '(Chưa cài đặt đáp án bí mật trong phần Cài đặt)'}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleHostConfirm(true)}
                className="py-2.5 px-4 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/50 text-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>MC Phán Quyết: ĐÚNG</span>
              </button>
              <button
                type="button"
                onClick={() => handleHostConfirm(false)}
                className="py-2.5 px-4 bg-red-900/60 hover:bg-red-800/80 border border-red-500/50 text-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <X className="w-4 h-4 text-red-400" />
                <span>MC Phán Quyết: SAI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            Quay Lại Bàn Chơi
          </button>
        </div>
      </div>
    </div>
  );
}
