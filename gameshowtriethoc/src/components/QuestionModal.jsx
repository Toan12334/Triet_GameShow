import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  AlertTriangle,
  Lightbulb,
  Unlock,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCorrect, playIncorrect, playTick, playClick } from '../utils/audio';

export default function QuestionModal({
  isOpen,
  tileIndex,
  question,
  onClose,
  onAnswerResult
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const timerRef = useRef(null);

  const optionLetters = ['A', 'B', 'C', 'D'];
  const optionColors = [
    'hover:border-blue-500/80 hover:bg-blue-950/40 text-blue-300',
    'hover:border-amber-500/80 hover:bg-amber-950/40 text-amber-300',
    'hover:border-emerald-500/80 hover:bg-emerald-950/40 text-emerald-300',
    'hover:border-purple-500/80 hover:bg-purple-950/40 text-purple-300'
  ];

  // Reset state when opening a new question
  useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setTimeLeft(30);
      setIsTimerPaused(false);
    }
  }, [isOpen, tileIndex]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || isAnswered || isTimerPaused) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        if (prev <= 6) {
          playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isOpen, isAnswered, isTimerPaused]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setIsCorrect(false);
    playIncorrect();
  };

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    playClick();
    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === question.correctOptionIndex;
    setIsCorrect(correct);

    if (correct) {
      playCorrect();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
      // Notify parent to reveal tile after 1.5s
      setTimeout(() => {
        onAnswerResult(true);
        onClose();
      }, 1800);
    } else {
      playIncorrect();
      // Keep open for 2.5s to let them see the correct answer, then close without revealing
      setTimeout(() => {
        onAnswerResult(false);
        onClose();
      }, 2500);
    }
  };

  const handleForceReveal = () => {
    playClick();
    playCorrect();
    onAnswerResult(true);
    onClose();
  };

  if (!isOpen || !question) return null;

  const timerPercentage = (timeLeft / 30) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-lg animate-in fade-in duration-300">

      <div className="relative w-full max-w-5xl lg:max-w-6xl bg-slate-900 border-2 sm:border-3 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden gameshow-gold-glow flex flex-col max-h-[95vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 px-6 sm:px-10 py-5 border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center font-orbitron font-black text-amber-400 text-xl sm:text-2xl shadow-lg shadow-amber-500/20">
              #{tileIndex + 1}
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-white flex items-center gap-2.5">
                <span>Câu Hỏi Mảnh Ghép #{tileIndex + 1}</span>
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Trả lời chính xác để mở góc ảnh bí ẩn</p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTimerPaused(!isTimerPaused)}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors shadow-sm"
              title="Tạm dừng thời gian"
            >
              {isTimerPaused ? 'Tiếp tục' : 'Tạm dừng'}
            </button>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 font-orbitron font-black text-base sm:text-xl md:text-2xl shadow-md ${
              timeLeft <= 5 
                ? 'bg-red-500/20 border-red-500/70 text-red-400 animate-bounce' 
                : 'bg-slate-950/90 border-amber-500/50 text-amber-400'
            }`}>
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              <span>{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Progress Bar for Timer */}
        <div className="w-full h-2 bg-slate-800 shrink-0">
          <div 
            className={`h-full transition-all duration-1000 ${
              timeLeft <= 5 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500'
            }`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>

        {/* Question Content Body */}
        <div className="p-6 sm:p-10 flex-1 overflow-y-auto flex flex-col justify-between">
          {/* Question Text Card */}
          <div className="bg-slate-950/80 border border-slate-800/90 p-6 sm:p-10 rounded-3xl shadow-inner mb-6 sm:mb-8 text-center min-h-[140px] sm:min-h-[180px] flex items-center justify-center">
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-50 leading-snug sm:leading-relaxed font-display">
              {question.questionText}
            </p>
          </div>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isTheCorrectOption = idx === question.correctOptionIndex;

              let optionStyle = 'bg-slate-950/90 border-slate-700/80 text-slate-100 hover:border-amber-400 hover:bg-slate-900 hover:scale-[1.01] active:scale-[0.99]';
              
              if (isAnswered) {
                if (isTheCorrectOption) {
                  optionStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-400/50';
                } else if (isSelected && !isTheCorrectOption) {
                  optionStyle = 'bg-red-950/90 border-red-400 text-red-100 shadow-xl shadow-red-500/30 ring-4 ring-red-400/50 animate-shake';
                } else {
                  optionStyle = 'bg-slate-950/40 border-slate-800 text-slate-600 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 sm:border-3 transition-all duration-300 flex items-center gap-4 sm:gap-5 text-left relative overflow-hidden group shadow-lg ${optionStyle}`}
                >
                  <span className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl font-orbitron font-black text-base sm:text-xl flex items-center justify-center shrink-0 shadow-md transition-colors ${
                    isAnswered && isTheCorrectOption
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : isAnswered && isSelected && !isTheCorrectOption
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-800/90 border border-slate-600 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:border-amber-300'
                  }`}>
                    {optionLetters[idx]}
                  </span>
                  
                  <span className="text-base sm:text-xl md:text-2xl font-bold flex-1 leading-normal">
                    {option}
                  </span>

                  {/* Icon status */}
                  {isAnswered && isTheCorrectOption && (
                    <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 shrink-0 animate-bounce" />
                  )}
                  {isAnswered && isSelected && !isTheCorrectOption && (
                    <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Banner */}
          {isAnswered && (
            <div className={`p-5 sm:p-6 rounded-3xl border-2 transition-all animate-in fade-in zoom-in-95 duration-300 ${
              isCorrect
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-xl shadow-emerald-500/20'
                : 'bg-red-950/80 border-red-400 text-red-200 shadow-xl shadow-red-500/20'
            }`}>
              <div className="flex items-start gap-4">
                {isCorrect ? (
                  <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-black text-base sm:text-xl">
                    {isCorrect ? '🎉 CHÍNH XÁC! Mảnh ghép đang được hé lộ...' : '❌ RẤT TIẾC! Câu trả lời chưa chính xác.'}
                  </h4>
                  {question.explanation && (
                    <p className="text-sm sm:text-base text-slate-200 mt-1.5 leading-relaxed font-medium">
                      <span className="font-bold text-amber-400">Giải thích: </span>
                      {question.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Host controls footer */}
        <div className="bg-slate-950 px-6 sm:px-10 py-4 border-t border-slate-800 flex items-center justify-between text-xs sm:text-sm text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handleForceReveal}
              className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl flex items-center gap-2 font-semibold transition-colors"
              title="Dành cho MC mở ô trực tiếp"
            >
              <Unlock className="w-4 h-4" />
              <span>MC Mở Mảnh Nhanh</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors"
          >
            Đóng Lại
          </button>
        </div>
      </div>
    </div>
  );
}

