/**
 * 백엔드 /api/insights/analyze/{id} API의 응답 타입
 */
export interface Insight {
  summary: string;
  key_themes: string[];
  insights: Array<{
    title: string;
    description: string;
    // supporting_evidence가 문자열 또는 객체를 포함할 수 있도록 수정
    supporting_evidence: Array<string | { clone_name: string; evidence: string }>;
  }>;
  recommendations: Array<{
    action: string;
    rationale: string;
  }>;
  // 상세 응답 데이터 구조 수정
  detailed_responses: Array<{
      question_text: string;
      // responses가 문자열 또는 객체를 포함할 수 있도록 수정
      responses: Array<string | {
          clone_name: string;
          response: string;
          text?: string;
          name?: string;
          evidence?: string;
      }>
  }>;
  saved_insights: any[]; // 필요시 더 구체적인 타입으로 변경
  insights_count: number;
  answers?: any; // Optional field for QA
}