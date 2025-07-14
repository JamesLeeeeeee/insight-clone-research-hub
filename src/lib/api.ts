const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const researchAPI = {
  setupResearch: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/research/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      // 서버에서 받은 에러 메시지를 포함하여 throw
      const errorData = await response.json().catch(() => ({ message: '서버 응답을 파싱할 수 없습니다.' }));
      throw new Error(errorData.message || '연구 설정에 실패했습니다.');
    }
    return response.json();
  }
};

export const insightsAPI = {
  /**
   * 연구 ID를 기반으로 GPT 분석을 요청하고 결과를 반환합니다.
   */
  analyze: async (researchId: string | number) => {
    const response = await fetch(`${API_BASE_URL}/api/insights/analyze/${researchId}`, {
      method: 'GET',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '서버 응답을 파싱할 수 없습니다.' }));
      throw new Error(errorData.message || '인사이트 분석에 실패했습니다.');
    }
    return response.json();
  },

  /**
   * 분석 결과를 파일로 다운로드합니다.
   */
  download: async (researchId: string | number, format: 'pdf' | 'json') => {
    const response = await fetch(`${API_BASE_URL}/api/insights/download/${researchId}?format=${format}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('파일 다운로드에 실패했습니다.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `research-results-${researchId}.${format}`;
    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length === 2)
            filename = filenameMatch[1];
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export const questionsAPI = {
  /**
   * 백엔드로부터 추천 질문 목록을 가져옵니다.
   */
  getRecommendations: async () => {
    const response = await fetch(`${API_BASE_URL}/api/questions/recommendations`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('추천 질문을 불러오는 데 실패했습니다.');
    }
    return response.json();
  },

  /**
   * 작성된 질문들을 백엔드로 제출하여 AI 응답 생성을 시작합니다.
   */
  submitQuestions: async (researchId: string, questions: { text: string }[]) => {
    const response = await fetch(`${API_BASE_URL}/api/questions/${researchId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 백엔드 API는 'questions' 키를 기대합니다.
      body: JSON.stringify({ questions: questions.map(q => q.text) }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '서버 응답을 파싱할 수 없습니다.' }));
      throw new Error(errorData.message || '질문 제출에 실패했습니다.');
    }
    return response.json();
  }
};