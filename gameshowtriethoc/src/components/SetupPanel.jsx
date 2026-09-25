import React, { useState } from 'react';
import { 
  Grid, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  Save, 
  Upload, 
  Download, 
  Plus, 
  Trash2, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  RefreshCw,
  Eye,
  Sliders,
  Play
} from 'lucide-react';
import { generateQuestionsForGrid, exportGameAsJson } from '../utils/sampleData';
import { playClick } from '../utils/audio';

const IMAGE_PRESETS = [
  {
    name: 'Triết Học Mác - Lênin',
    main: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    bg: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80',
    secret: 'Karl Marx & Các Nhà Khai Sáng Tư Tưởng'
  },
  {
    name: 'Vịnh Hạ Long - Kỳ Quan',
    main: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    bg: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    secret: 'Vịnh Hạ Long (Quảng Ninh, Việt Nam)'
  },
  {
    name: 'Kim Tự Tháp Giza',
    main: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    bg: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80',
    secret: 'Đại Kim Tự Tháp Giza (Ai Cập)'
  },
  {
    name: 'Vũ Trụ & Thiên Văn',
    main: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    bg: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    secret: 'Trái Đất Nhìn Từ Trạm Vũ Trụ Quốc Tế'
  }
];

export default function SetupPanel({
  gameData,
  setGameData,
  onStartPlay
}) {
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'images' | 'questions' | 'json'
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [copiedJson, setCopiedJson] = useState(false);

  const { rows, cols } = gameData.gridConfig;
  const totalQuestions = rows * cols;

  // Handle grid size change
  const handleSizeChange = (newRows, newCols) => {
    playClick();
    const validRows = Math.max(1, Math.min(10, parseInt(newRows) || 1));
    const validCols = Math.max(1, Math.min(10, parseInt(newCols) || 1));

    const updatedQuestions = generateQuestionsForGrid(validRows, validCols, gameData.questions);

    setGameData({
      ...gameData,
      gridConfig: { rows: validRows, cols: validCols },
      questions: updatedQuestions
    });

    if (selectedQuestionIndex >= validRows * validCols) {
      setSelectedQuestionIndex(0);
    }
  };

  // Handle question updates
  const handleUpdateQuestion = (field, value) => {
    const updated = [...gameData.questions];
    updated[selectedQuestionIndex] = {
      ...updated[selectedQuestionIndex],
      [field]: value
    };
    setGameData({
      ...gameData,
      questions: updated
    });
  };

  const handleUpdateOption = (optIndex, value) => {
    const updated = [...gameData.questions];
    const curOptions = [...(updated[selectedQuestionIndex].options || ['', '', '', ''])];
    curOptions[optIndex] = value;
    updated[selectedQuestionIndex] = {
      ...updated[selectedQuestionIndex],
      options: curOptions
    };
    setGameData({
      ...gameData,
      questions: updated
    });
  };

  // Image file upload handler
  const handleLocalImageUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setGameData({
        ...gameData,
        [field]: event.target?.result
      });
    };
    reader.readAsDataURL(file);
  };

  // Auto fill sample questions
  const handleAutoFillQuestions = () => {
    playClick();
    const updated = gameData.questions.map((q, idx) => ({
      ...q,
      questionText: q.questionText || `Câu hỏi thử thách số ${idx + 1}: Nội dung câu hỏi trắc nghiệm kiến thức?`,
      options: [
        q.options?.[0] || `Lựa chọn A`,
        q.options?.[1] || `Lựa chọn B (Chính xác)`,
        q.options?.[2] || `Lựa chọn C`,
        q.options?.[3] || `Lựa chọn D`
      ],
      correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 1,
      explanation: q.explanation || `Giải thích ngắn gọn cho câu hỏi số ${idx + 1}.`
    }));

    setGameData({
      ...gameData,
      questions: updated
    });
  };

  const currentQ = gameData.questions[selectedQuestionIndex] || {
    questionText: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    explanation: ''
  };

  const handleCopyJson = () => {
    playClick();
    navigator.clipboard.writeText(JSON.stringify(gameData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Sliders className="w-4 h-4" />
            <span>Trung Tâm Quản Trị & Biên Soạn Đề</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Cài Đặt Game Show Mảnh Ghép
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Tùy biến kích thước lưới NxN, hình ảnh bí ẩn sau mảnh ghép, ảnh nền và toàn bộ bộ câu hỏi trắc nghiệm tương ứng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClick();
              exportGameAsJson(gameData);
            }}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Xuất File JSON</span>
          </button>

          <button
            onClick={() => {
              playClick();
              onStartPlay();
            }}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl font-orbitron text-xs sm:text-sm tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-105 transition-all"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>VÀO CHƠI NGAY</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
        <button
          onClick={() => { playClick(); setActiveTab('grid'); }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all shrink-0 ${
            activeTab === 'grid'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>1. Kích Thước Lưới ({rows}x{cols} = {totalQuestions} ô)</span>
        </button>

        <button
          onClick={() => { playClick(); setActiveTab('images'); }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all shrink-0 ${
            activeTab === 'images'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>2. Hình Ảnh Bí Ẩn & Sân Khấu</span>
        </button>

        <button
          onClick={() => { playClick(); setActiveTab('questions'); }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all shrink-0 ${
            activeTab === 'questions'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Soạn Bộ Câu Hỏi ({totalQuestions} câu)</span>
        </button>

        <button
          onClick={() => { playClick(); setActiveTab('json'); }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all shrink-0 ${
            activeTab === 'json'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>4. Trình Xem & Xuất JSON</span>
        </button>
      </div>

      {/* TAB 1: GRID CONFIGURATION */}
      {activeTab === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Grid className="w-5 h-5 text-cyan-400" />
                <span>Chọn Kích Thước Lưới Mảnh Ghép</span>
              </h3>

              {/* Quick Presets */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Kích thước nhanh phổ biến:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { r: 2, c: 2, label: '2 x 2 (4 mảnh)' },
                    { r: 3, c: 3, label: '3 x 3 (9 mảnh - Chuẩn)' },
                    { r: 4, c: 4, label: '4 x 4 (16 mảnh)' },
                    { r: 5, c: 5, label: '5 x 5 (25 mảnh)' },
                  ].map((preset) => (
                    <button
                      key={`${preset.r}x${preset.c}`}
                      onClick={() => handleSizeChange(preset.r, preset.c)}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        rows === preset.r && cols === preset.c
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-2 ring-cyan-500/30 font-bold'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-orbitron font-bold text-base block">{preset.r} x {preset.c}</span>
                      <span className="text-xs text-slate-400">{preset.r * preset.c} mảnh ghép</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Rows x Cols */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Tùy chỉnh số hàng & số cột tùy ý (1 - 10):
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Số Hàng (Rows):</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={rows}
                      onChange={(e) => handleSizeChange(e.target.value, cols)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-orbitron font-bold focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Số Cột (Columns):</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={cols}
                      onChange={(e) => handleSizeChange(rows, e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-orbitron font-bold focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="mt-6 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 text-xs flex items-start gap-3">
                <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                  Khi thay đổi kích thước, hệ thống sẽ tự động cập nhật và sinh ra chính xác <strong>{totalQuestions} ô câu hỏi</strong> tương ứng với các mảnh ghép. Dữ liệu các câu hỏi hiện có sẽ được tự động bảo lưu.
                </p>
              </div>
            </div>
          </div>

          {/* Grid Preview Layout Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 self-start">
              Mô phỏng vị trí các mảnh ghép:
            </h4>
            <div
              className="w-full max-w-[320px] aspect-square p-2 bg-slate-950 rounded-2xl border border-slate-800 grid gap-1.5 shadow-inner"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-900 border border-slate-700/80 rounded-lg flex items-center justify-center font-orbitron font-bold text-xs text-amber-400 shadow-sm"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IMAGES CONFIGURATION */}
      {activeTab === 'images' && (
        <div className="space-y-8">
          {/* Preset Theme Selector */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Kho Ảnh Mẫu Có Sẵn Nhanh</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Nhấp để áp dụng ngay bộ hình ảnh và chủ đề mẫu chất lượng cao:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {IMAGE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playClick();
                    setGameData({
                      ...gameData,
                      mainImageUrl: p.main,
                      bgImageUrl: p.bg,
                      secretAnswer: p.secret
                    });
                  }}
                  className="group relative rounded-2xl overflow-hidden border border-slate-700 hover:border-amber-400 transition-all text-left p-3 bg-slate-950"
                >
                  <img src={p.main} alt={p.name} className="w-full h-24 object-cover rounded-xl mb-2 group-hover:scale-105 transition-transform" />
                  <span className="font-bold text-xs text-slate-200 block truncate group-hover:text-amber-300">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Mystery Image & Background Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mystery Image Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <span>1. Bức Ảnh Chính Bí Ẩn (Main Image)</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    URL Hình Ảnh Chính (Sau các mảnh ghép):
                  </label>
                  <input
                    type="url"
                    value={gameData.mainImageUrl}
                    onChange={(e) => setGameData({ ...gameData, mainImageUrl: e.target.value })}
                    placeholder="https://example.com/mystery-photo.jpg"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Hoặc tải ảnh từ máy tính (Tự lưu offline):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLocalImageUpload(e, 'mainImageUrl')}
                    className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Tên đáp án bí ẩn (Secret Answer - dùng cho nút Đoán ảnh):
                  </label>
                  <input
                    type="text"
                    value={gameData.secretAnswer || ''}
                    onChange={(e) => setGameData({ ...gameData, secretAnswer: e.target.value })}
                    placeholder="Ví dụ: Karl Marx, Kim Tự Tháp, Vịnh Hạ Long..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Preview Box */}
                <div className="mt-4 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 h-48 flex items-center justify-center relative">
                  {gameData.mainImageUrl ? (
                    <img src={gameData.mainImageUrl} alt="Preview Main" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-500">Chưa có ảnh chính</span>
                  )}
                </div>
              </div>
            </div>

            {/* Background Stage Image Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
                <span>2. Ảnh Nền Sân Khấu Game Show (Background)</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    URL Ảnh Nền (Background Stage):
                  </label>
                  <input
                    type="url"
                    value={gameData.bgImageUrl}
                    onChange={(e) => setGameData({ ...gameData, bgImageUrl: e.target.value })}
                    placeholder="https://example.com/stage-background.jpg"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Hoặc tải ảnh nền từ máy tính:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLocalImageUpload(e, 'bgImageUrl')}
                    className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Tiêu đề vòng chơi:
                  </label>
                  <input
                    type="text"
                    value={gameData.title || ''}
                    onChange={(e) => setGameData({ ...gameData, title: e.target.value })}
                    placeholder="Ví dụ: Triết Học Mác - Lênin & Tư Tưởng Lớn"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Preview Box */}
                <div className="mt-4 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 h-48 flex items-center justify-center relative">
                  {gameData.bgImageUrl ? (
                    <img src={gameData.bgImageUrl} alt="Preview Background" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-500">Chưa có ảnh nền</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* BACKGROUND AUDIO / BGM CONFIGURATION SECTION */}
          <div className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>3. Cài Đặt Âm Thanh / Nhạc Nền Game Show (Tự Động Lặp Lại)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Nhạc nền sẽ phát liên tục trong suốt trận đấu và <strong className="text-amber-300 font-bold">tự động lặp lại từ đầu (Loop)</strong> khi hết bài.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs text-amber-300 font-bold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Chế độ: Tự Lặp Lại (Infinite Loop)</span>
              </div>
            </div>

            {/* BGM Presets */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Chọn mẫu nhạc nền Game Show có sẵn:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    name: '🎵 Game Show Kịch Tính & Hồi Hộp',
                    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
                    desc: 'Tiết tấu dồn dập, tạo cảm giác thi đấu truyền hình'
                  },
                  {
                    name: '⚡ Sôi Động & Hiện Đại',
                    url: 'https://assets.mixkit.co/music/preview/mixkit-game-level-music-689.mp3',
                    desc: 'Năng động, cuốn hút, kích thích tư duy'
                  },
                  {
                    name: '🏛️ Hùng Tráng & Trí Tuệ',
                    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3',
                    desc: 'Phong cách khám phá tri thức và lịch sử'
                  }
                ].map((track, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      playClick();
                      setGameData({ ...gameData, bgAudioUrl: track.url });
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      gameData.bgAudioUrl === track.url
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-500/30'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-xs sm:text-sm block text-amber-300">{track.name}</span>
                    <span className="text-[11px] text-slate-400 mt-1 block">{track.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* URL Input & Local Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Đường Dẫn URL File Âm Thanh (.mp3, .wav, .ogg):
                </label>
                <input
                  type="url"
                  value={gameData.bgAudioUrl || ''}
                  onChange={(e) => setGameData({ ...gameData, bgAudioUrl: e.target.value })}
                  placeholder="https://example.com/background-music.mp3"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Hoặc Tải File Âm Thanh Từ Máy Tính (Lưu Offline):
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setGameData({
                        ...gameData,
                        bgAudioUrl: ev.target?.result
                      });
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30"
                />
              </div>
            </div>

            {/* Audio Player Preview */}
            {gameData.bgAudioUrl && (
              <div className="mt-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                    🔊
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Nghe Thử Âm Thanh Nền Đã Chọn</span>
                    <span className="text-[11px] text-emerald-400">✓ Đã kích hoạt chế độ tự động lặp (Loop)</span>
                  </div>
                </div>

                <audio
                  src={gameData.bgAudioUrl}
                  controls
                  loop
                  className="w-full sm:w-80 h-9"
                />
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: QUESTIONS EDITOR */}
      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Quick Tile Selector Grid (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Danh Sách {totalQuestions} Mảnh
              </h3>
              <button
                onClick={handleAutoFillQuestions}
                className="text-[11px] px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg flex items-center gap-1 transition-colors"
                title="Tự động sinh nội dung mẫu cho các câu còn trống"
              >
                <Sparkles className="w-3 h-3" />
                <span>Điền Mẫu Nhanh</span>
              </button>
            </div>

            {/* Quick Tile Buttons Grid */}
            <div
              className="grid gap-2 mb-6 max-h-96 overflow-y-auto pr-1"
              style={{
                gridTemplateColumns: `repeat(${cols > 4 ? 4 : cols}, minmax(0, 1fr))`
              }}
            >
              {gameData.questions.map((q, idx) => {
                const isSelected = selectedQuestionIndex === idx;
                const hasText = !!q.questionText;

                return (
                  <button
                    key={idx}
                    onClick={() => { playClick(); setSelectedQuestionIndex(idx); }}
                    className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-500/30 font-bold'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-orbitron text-sm font-black">#{idx + 1}</span>
                    <span className="text-[9px] mt-0.5 opacity-70">
                      H{Math.floor(idx / cols) + 1}-C{(idx % cols) + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-300">
                <span>Tổng số câu hỏi:</span>
                <span className="text-amber-400 font-mono">{totalQuestions} câu</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Mỗi mảnh ghép tương ứng với đúng 1 câu hỏi khi người chơi nhấp vào ô đó.
              </p>
            </div>
          </div>

          {/* Right Column: Question Details Form Editor (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 font-orbitron font-black text-amber-400 text-lg flex items-center justify-center">
                  #{selectedQuestionIndex + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Biên Soạn Mảnh Ghép #{selectedQuestionIndex + 1}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Hàng {Math.floor(selectedQuestionIndex / cols) + 1}, Cột {(selectedQuestionIndex % cols) + 1}
                  </span>
                </div>
              </div>

              {/* Navigation prev/next */}
              <div className="flex items-center gap-2">
                <button
                  disabled={selectedQuestionIndex === 0}
                  onClick={() => { playClick(); setSelectedQuestionIndex((prev) => Math.max(0, prev - 1)); }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  ← Câu Trước
                </button>
                <button
                  disabled={selectedQuestionIndex === totalQuestions - 1}
                  onClick={() => { playClick(); setSelectedQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1)); }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Câu Tiếp →
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Nội Dung Câu Hỏi:
                </label>
                <textarea
                  rows="3"
                  value={currentQ.questionText || ''}
                  onChange={(e) => handleUpdateQuestion('questionText', e.target.value)}
                  placeholder="Nhập nội dung câu hỏi trắc nghiệm tại đây..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 4 Options with Radio/Checkmark */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  4 Phương Án Trả Lời & Chọn Đáp Án Đúng:
                </label>
                <div className="space-y-3">
                  {['A', 'B', 'C', 'D'].map((letter, optIdx) => {
                    const isCorrect = currentQ.correctOptionIndex === optIdx;
                    return (
                      <div
                        key={letter}
                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                          isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500/70 ring-1 ring-emerald-500/30'
                            : 'bg-slate-950/80 border-slate-800'
                        }`}
                      >
                        {/* Radio selector for correct answer */}
                        <button
                          type="button"
                          onClick={() => {
                            playClick();
                            handleUpdateQuestion('correctOptionIndex', optIdx);
                          }}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-orbitron font-bold text-sm shrink-0 transition-all ${
                            isCorrect
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 font-black'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                          }`}
                          title={`Đặt ${letter} làm đáp án ĐÚNG`}
                        >
                          {letter}
                        </button>

                        {/* Input text for option */}
                        <input
                          type="text"
                          value={currentQ.options?.[optIdx] || ''}
                          onChange={(e) => handleUpdateOption(optIdx, e.target.value)}
                          placeholder={`Nhập phương án ${letter}...`}
                          className="flex-1 px-3 py-2 bg-transparent text-sm text-slate-200 placeholder-slate-600 focus:outline-none"
                        />

                        {/* Visual check badge */}
                        <button
                          type="button"
                          onClick={() => {
                            playClick();
                            handleUpdateQuestion('correctOptionIndex', optIdx);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                            isCorrect
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>{isCorrect ? 'Đáp Án Đúng' : 'Chọn Đúng'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Giải Thích / Chú Thích Bổ Sung (Tùy chọn):
                </label>
                <input
                  type="text"
                  value={currentQ.explanation || ''}
                  onChange={(e) => handleUpdateQuestion('explanation', e.target.value)}
                  placeholder="Ví dụ: Theo tài liệu Giáo trình Triết học Mác - Lênin 2021..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: JSON RAW VIEWER & TOOLS */}
      {activeTab === 'json' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Trình Quản Lý Dữ Liệu JSON</span>
              </h3>
              <p className="text-xs text-slate-400">
                Toàn bộ cấu trúc game show được lưu trữ dưới dạng JSON chuẩn. Bạn có thể sao chép hoặc tải về file .json.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJson}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copiedJson ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedJson ? 'Đã Sao Chép!' : 'Sao Chép JSON'}</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  exportGameAsJson(gameData);
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Tải File .JSON</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[500px]">
            <pre>{JSON.stringify(gameData, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
