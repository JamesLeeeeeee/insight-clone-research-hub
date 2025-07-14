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
    // 상세 응답 데이터도 필요하다면 여기에 추가
    detailed_responses: Array<{
        question_text: string;
        responses: Array<{
            clone_name: string;
            answer: string;
        }>
    }>;
    saved_insights: any[]; // 필요시 더 구체적인 타입으로 변경
    insights_count: number;
  }