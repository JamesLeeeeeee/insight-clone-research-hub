/**
 * 백엔드 /api/insights/analyze/{id} API의 응답 타입
 */
export interface Insight {
  summary: string;
  key_themes: string[];
  insights: Array<{
    title: string;
    description: string;
    supporting_evidence: string[];
  }>;
  recommendations: Array<{
    action: string;
    rationale: string;
  }>;
  // 상세 응답 데이터 구조 수정
  detailed_responses: Array<{
      question_text: string;
      responses: Array<{
          clone_name: string;
          response: string;  // changed from 'answer' to 'response'
          // 추가 가능한 대체 필드들
          text?: string;
          name?: string;
      }>
  }>;
  saved_insights: any[]; // 필요시 더 구체적인 타입으로 변경
  insights_count: number;
  answers?: any; // Optional field for QA
}