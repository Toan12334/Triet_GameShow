// Default sample game configurations and JSON helper utilities

export const SAMPLE_PACKS = [
  {
    id: 'triet_hoc_mac_lenin',
    title: 'Triết học Mác - Lênin & Tư Tưởng Lớn',
    secretAnswer: 'Karl Marx & Friedrich Engels - Những người sáng lập Chủ nghĩa Xã hội Khoa học',
    description: 'Chủ đề về các nguyên lý cơ bản của Triết học Mác - Lênin, phép biện chứng duy vật và các nhà tư tưởng vĩ đại.',
    gridConfig: { rows: 3, cols: 3 },
    mainImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80', // Library of grand thoughts / statue
    bgImageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80', // Deep starry night / game show stage
    bgAudioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Epic suspense gameshow track (auto-loops)
    questions: [

      {
        id: 'q1',
        tileIndex: 0,
        questionText: 'Vấn đề cơ bản của triết học là mối quan hệ giữa yếu tố nào?',
        options: [
          'Tư duy và Tồn tại (Ý thức và Vật chất)',
          'Tự nhiên và Xã hội',
          'Lý luận và Thực tiễn',
          'Văn hóa và Kinh tế'
        ],
        correctOptionIndex: 0,
        explanation: 'Theo Ăng-ghen, vấn đề cơ bản lớn của mọi triết học, đặc biệt là triết học hiện đại, là vấn đề quan hệ giữa tư duy và tồn tại.'
      },
      {
        id: 'q2',
        tileIndex: 1,
        questionText: 'Thuộc tính phổ biến và quan trọng nhất của vật chất theo định nghĩa của V.I.Lênin là gì?',
        options: [
          'Khối lượng và trọng lượng',
          'Thực tại khách quan',
          'Khả năng tự vận động',
          'Hình khối không gian'
        ],
        correctOptionIndex: 1,
        explanation: 'Vật chất là một phạm trù triết học dùng để chỉ thực tại khách quan được đem lại cho con người trong cảm giác.'
      },
      {
        id: 'q3',
        tileIndex: 2,
        questionText: 'Hình thức vận động nào được coi là hình thức vận động cao nhất của vật chất?',
        options: [
          'Vận động cơ học',
          'Vận động vật lý',
          'Vận động sinh học',
          'Vận động xã hội'
        ],
        correctOptionIndex: 3,
        explanation: 'Vận động xã hội là hình thức vận động cao nhất và phức tạp nhất của thế giới vật chất.'
      },
      {
        id: 'q4',
        tileIndex: 3,
        questionText: 'Nguồn gốc sâu xa và động lực trực tiếp của sự phát triển theo Phép biện chứng duy vật là gì?',
        options: [
          'Sự đấu tranh giữa các mặt đối lập (Mâu thuẫn)',
          'Ý muốn chủ quan của con người',
          'Sự thúc đẩy từ lực lượng siêu nhiên',
          'Sự tích tụ ngẫu nhiên của các yếu tố'
        ],
        correctOptionIndex: 0,
        explanation: 'Quy luật thống nhất và đấu tranh của các mặt đối lập vạch ra nguồn gốc và động lực bên trong của sự phát triển.'
      },
      {
        id: 'q5',
        tileIndex: 4,
        questionText: 'Quy luật nào của phép biện chứng chỉ ra "Cách thức" của sự phát triển?',
        options: [
          'Quy luật mâu thuẫn',
          'Quy luật chuyển hóa từ những thay đổi về lượng dẫn đến những thay đổi về chất',
          'Quy luật phủ định của phủ định',
          'Quy luật bảo toàn năng lượng'
        ],
        correctOptionIndex: 1,
        explanation: 'Quy luật lượng - chất chỉ ra cách thức vận động và phát triển: tích lũy dần dần về lượng dẫn đến sự thay đổi nhảy vọt về chất.'
      },
      {
        id: 'q6',
        tileIndex: 5,
        questionText: 'Thực tiễn đóng vai trò gì đối với nhận thức của con người?',
        options: [
          'Chỉ là công cụ kiểm tra phụ trợ',
          'Cơ sở, động lực, mục đích và tiêu chuẩn của chân lý',
          'Một giai đoạn tạm thời trước lý luận',
          'Không có quan hệ mật thiết với nhận thức'
        ],
        correctOptionIndex: 1,
        explanation: 'Thực tiễn là cơ sở, động lực, mục đích của nhận thức và là tiêu chuẩn duy nhất để kiểm tra chân lý.'
      },
      {
        id: 'q7',
        tileIndex: 6,
        questionText: 'Quy luật nào chỉ ra "Khuynh hướng" phát triển theo đường xoáy ốc của sự vật, hiện tượng?',
        options: [
          'Quy luật lượng - chất',
          'Quy luật phủ định của phủ định',
          'Quy luật nhân quả',
          'Quy luật tất nhiên và ngẫu nhiên'
        ],
        correctOptionIndex: 1,
        explanation: 'Quy luật phủ định của phủ định chỉ ra khuynh hướng tiến lên của sự phát triển theo hình xoắn ốc (kế thừa và phát triển cao hơn).'
      },
      {
        id: 'q8',
        tileIndex: 7,
        questionText: 'Hai bộ phận hợp thành cấu trúc của hình thái kinh tế - xã hội là gì?',
        options: [
          'Cơ sở hạ tầng và Kiến trúc thượng tầng',
          'Kinh tế và Quân sự',
          'Chính trị và Tôn giáo',
          'Văn hóa và Pháp luật'
        ],
        correctOptionIndex: 0,
        explanation: 'Lực lượng sản xuất - Quan hệ sản xuất (Cơ sở hạ tầng) và Kiến trúc thượng tầng là các yếu tố cốt lõi của hình thái kinh tế - xã hội.'
      },
      {
        id: 'q9',
        tileIndex: 8,
        questionText: 'Ai là người sáng lập ra trường phái Triết học Cổ điển Đức với thuyết Nhận thức luận?',
        options: [
          'Immanuel Kant',
          'G.W.F. Hegel',
          'Ludwig Feuerbach',
          'Rene Descartes'
        ],
        correctOptionIndex: 0,
        explanation: 'Immanuel Kant là người mở đầu cho nền Triết học cổ điển Đức với các tác phẩm phê phán lý tính nổi tiếng.'
      }
    ]
  },
  {
    id: 'ky_quan_the_gioi',
    title: 'Kỳ Quan Thiên Nhiên & Thế Giới (4x4 = 16 Mảnh)',
    secretAnswer: 'Vịnh Hạ Long - Kỳ quan Thiên nhiên Thế giới UNESCO',
    description: 'Chủ đề khám phá các địa danh và bí ẩn nổi tiếng trên toàn cầu với lưới 16 mảnh ghép.',
    gridConfig: { rows: 4, cols: 4 },
    mainImageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80', // Halong Bay landscape
    bgImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    questions: Array.from({ length: 16 }, (_, i) => ({
      id: `kq_${i + 1}`,
      tileIndex: i,
      questionText: `Câu hỏi số ${i + 1}: Kỳ quan thế giới hay địa danh nổi tiếng nào gắn liền với mảnh ghép này?`,
      options: [
        `Đáp án A cho mảnh ghép ${i + 1}`,
        `Đáp án B chính xác cho mảnh ghép ${i + 1}`,
        `Đáp án C cho mảnh ghép ${i + 1}`,
        `Đáp án D cho mảnh ghép ${i + 1}`
      ],
      correctOptionIndex: 1,
      explanation: `Giải thích chi tiết cho câu hỏi kỳ quan số ${i + 1}.`
    }))
  }
];

// Helper to generate empty question structure when grid size changes
export function generateQuestionsForGrid(rows, cols, existingQuestions = []) {
  const total = rows * cols;
  const questions = [];

  for (let i = 0; i < total; i++) {
    const existing = existingQuestions.find((q) => q.tileIndex === i) || existingQuestions[i];
    if (existing) {
      questions.push({
        id: existing.id || `q_${i + 1}`,
        tileIndex: i,
        questionText: existing.questionText || `Câu hỏi cho mảnh ghép số ${i + 1}`,
        options: existing.options && existing.options.length === 4
          ? existing.options
          : [`Lựa chọn A`, `Lựa chọn B`, `Lựa chọn C`, `Lựa chọn D`],
        correctOptionIndex: typeof existing.correctOptionIndex === 'number' ? existing.correctOptionIndex : 0,
        explanation: existing.explanation || ''
      });
    } else {
      questions.push({
        id: `q_${Date.now()}_${i + 1}`,
        tileIndex: i,
        questionText: `Câu hỏi cho mảnh ghép số ${i + 1} (Hàng ${Math.floor(i / cols) + 1}, Cột ${(i % cols) + 1})`,
        options: [
          `Đáp án A`,
          `Đáp án B`,
          `Đáp án C`,
          `Đáp án D`
        ],
        correctOptionIndex: 0,
        explanation: ''
      });
    }
  }

  return questions;
}

// Download JSON game data
export function exportGameAsJson(gameData, filename = 'gameshow-manh-ghep.json') {
  const exportPayload = {
    title: gameData.title || 'Mảnh Ghép Bí Ẩn',
    secretAnswer: gameData.secretAnswer || '',
    description: gameData.description || '',
    gridConfig: {
      rows: Number(gameData.gridConfig?.rows || 3),
      cols: Number(gameData.gridConfig?.cols || 3)
    },
    mainImageUrl: gameData.mainImageUrl || '',
    bgImageUrl: gameData.bgImageUrl || '',
    bgAudioUrl: gameData.bgAudioUrl || '',
    questions: gameData.questions || []
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Validate and parse imported JSON
export function parseAndValidateGameJson(jsonString) {
  try {
    const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    
    if (!data.gridConfig || typeof data.gridConfig.rows !== 'number' || typeof data.gridConfig.cols !== 'number') {
      throw new Error('Thiếu hoặc sai định dạng `gridConfig: { rows, cols }`');
    }

    const rows = Number(data.gridConfig.rows);
    const cols = Number(data.gridConfig.cols);
    const expectedCount = rows * cols;

    if (!Array.isArray(data.questions)) {
      throw new Error('Thuộc tính `questions` phải là một mảng.');
    }

    // Auto fix or validate questions
    const formattedQuestions = [];
    for (let i = 0; i < expectedCount; i++) {
      const q = data.questions.find((item) => item.tileIndex === i) || data.questions[i];
      if (q) {
        formattedQuestions.push({
          id: q.id || `q_${i + 1}`,
          tileIndex: i,
          questionText: q.questionText || `Câu hỏi số ${i + 1}`,
          options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['A', 'B', 'C', 'D'],
          correctOptionIndex: typeof q.correctOptionIndex === 'number' && q.correctOptionIndex >= 0 && q.correctOptionIndex <= 3 ? q.correctOptionIndex : 0,
          explanation: q.explanation || ''
        });
      } else {
        formattedQuestions.push({
          id: `q_${i + 1}`,
          tileIndex: i,
          questionText: `Câu hỏi số ${i + 1}`,
          options: ['A', 'B', 'C', 'D'],
          correctOptionIndex: 0,
          explanation: ''
        });
      }
    }

    return {
      success: true,
      data: {
        title: data.title || 'Mảnh Ghép Bí Ẩn',
        secretAnswer: data.secretAnswer || '',
        description: data.description || '',
        gridConfig: { rows, cols },
        mainImageUrl: data.mainImageUrl || '',
        bgImageUrl: data.bgImageUrl || '',
        bgAudioUrl: data.bgAudioUrl || '',
        questions: formattedQuestions
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

