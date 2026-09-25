import React, { useRef } from 'react';
import { 
  Sparkles, 
  Settings, 
  Play, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  RotateCcw, 
  Maximize, 
  Layers
} from 'lucide-react';
import { exportGameAsJson, parseAndValidateGameJson, SAMPLE_PACKS } from '../utils/sampleData';
import { playClick } from '../utils/audio';

export default function Navbar({
  currentMode,
  setMode,
  gameData,
  setGameData,
  isMuted,
  toggleSound,
  onResetBoard,
  openedTilesCount,
  totalTilesCount
}) {
  const fileInputRef = useRef(null);

  const handleModeChange = (mode) => {
    playClick();
    setMode(mode);
  };

  const handleExport = () => {
    playClick();
    const safeTitle = (gameData.title || 'manh-ghep-bi-an')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    exportGameAsJson(gameData, `${safeTitle}-${Date.now()}.json`);
  };

  const handleImportClick = () => {
    playClick();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      const res = parseAndValidateGameJson(content);
      if (res.success) {
        setGameData(res.data);
        onResetBoard();
        alert(`✅ Đã nhập thành công bộ câu hỏi: "${res.data.title}" (${res.data.gridConfig.rows}x${res.data.gridConfig.cols} = ${res.data.questions.length} mảnh)`);
      } else {
        alert(`❌ Lỗi khi đọc file JSON: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  const handleSelectSample = (sampleId) => {
    playClick();
    const pack = SAMPLE_PACKS.find((p) => p.id === sampleId);
    if (pack) {
      setGameData(JSON.parse(JSON.stringify(pack)));
      onResetBoard();
    }
  };

  const toggleFullscreen = () => {
    playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-amber-500/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 select-none">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center animate-pulse-slow">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase font-orbitron bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow">
                Mảnh Ghép Bí Ẩn
              </h1>
              <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 rounded border border-amber-500/40">
                PRO SHOW
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block truncate max-w-xs md:max-w-md font-medium">
              {gameData.title || 'Game Show Trí Tuệ & Khám Phá Hình Ảnh'}
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher (Play vs Setup) */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => handleModeChange('play')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
              currentMode === 'play'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30 scale-102'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Play className={`w-4 h-4 ${currentMode === 'play' ? 'fill-slate-950' : ''}`} />
            <span>Chơi Game</span>
            {currentMode === 'play' && (
              <span className="text-[11px] px-1.5 py-0.2 bg-slate-950/30 rounded-full font-mono">
                {openedTilesCount}/{totalTilesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleModeChange('setup')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
              currentMode === 'setup'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 scale-102'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-4 h-4 animate-spin-slow" />
            <span>Cài Đặt (Setup)</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sample Pack Dropdown */}
          <div className="relative group hidden lg:block">
            <button
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-300 hover:text-amber-300 transition-colors"
              title="Chọn bộ đề mẫu"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Đề Mẫu</span>
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2">
              <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Chọn Bộ Đề Có Sẵn
              </div>
              {SAMPLE_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => handleSelectSample(pack.id)}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-amber-500/20 hover:text-amber-300 text-slate-200 transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{pack.title}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {pack.gridConfig.rows}x{pack.gridConfig.cols}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Import JSON */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={handleImportClick}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-cyan-400 rounded-xl transition-all shadow-sm"
            title="Nhập file JSON đề bài"
          >
            <Upload className="w-4 h-4" />
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExport}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-emerald-400 rounded-xl transition-all shadow-sm"
            title="Xuất đề bài ra file JSON"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2.5 border rounded-xl transition-all shadow-sm ${
              isMuted
                ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-amber-400'
            }`}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset Board */}
          {currentMode === 'play' && (
            <button
              onClick={() => {
                playClick();
                if (confirm('Bạn có chắc chắn muốn đóng lại toàn bộ các mảnh ghép để bắt đầu lại?')) {
                  onResetBoard();
                }
              }}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-amber-400 rounded-xl transition-all shadow-sm"
              title="Khởi động lại vòng chơi"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white rounded-xl transition-all shadow-sm hidden sm:flex"
            title="Toàn màn hình"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
