
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, RefreshCw } from 'lucide-react';
import { ResearchData } from '@/types/research';

interface InsightSummaryProps {
  researchData: ResearchData | null;
  responses: any[];
  onReset: () => void;
}

const InsightSummary: React.FC<InsightSummaryProps> = ({ 
  researchData, 
  responses, 
  onReset 
}) => {
  // Mock data for demonstration
  const mockResponses = [
    {
      question: "YouTube를 사용할 때 가장 불편한 점은 무엇인가요?",
      responses: [
        { clone: "김민지", answer: "광고가 너무 많아서 집중력이 떨어져요. 특히 중간에 나오는 광고들이 영상 몰입을 방해합니다." },
        { clone: "박준호", answer: "모바일에서 백그라운드 재생이 안 되는 점이 아쉽습니다. 음악을 들으면서 다른 앱을 사용하고 싶어요." },
        { clone: "이수진", answer: "추천 알고리즘이 때로는 너무 편향적이에요. 같은 종류의 콘텐츠만 계속 추천해주는 경우가 많습니다." }
      ]
    },
    {
      question: "YouTube를 개선한다면 어떤 부분을 바꾸고 싶나요?",
      responses: [
        { clone: "김민지", answer: "UI/UX 측면에서 더 직관적인 탐색 기능이 있었으면 좋겠어요. 카테고리별로 더 쉽게 찾을 수 있도록요." },
        { clone: "박준호", answer: "개발자 입장에서 API 연동이나 임베드 기능을 더 개선했으면 합니다. 더 유연한 커스터마이징이 가능했으면요." },
        { clone: "이수진", answer: "사용자 행동 분석을 통해 더 개인화된 콘텐츠 큐레이션 기능이 있었으면 좋겠습니다." }
      ]
    }
  ];

  const insights = [
    {
      title: "주요 불편사항",
      content: "광고 과다, 백그라운드 재생 제한, 편향적 추천 알고리즘이 주요 문제점으로 지적됨",
      type: "problem"
    },
    {
      title: "개선 요구사항",
      content: "UI/UX 개선, 개발자 친화적 기능, 개인화 강화에 대한 니즈가 높음",
      type: "opportunity"
    },
    {
      title: "사용자 페르소나별 차이점",
      content: "디자이너는 UI/UX, 개발자는 기술적 기능, PM은 데이터 분석에 더 관심을 보임",
      type: "insight"
    }
  ];

  const exportData = () => {
    const exportContent = {
      researchData,
      responses: mockResponses,
      insights,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 연구 결과 및 인사이트
          </CardTitle>
          <CardDescription>
            AI 클론들의 응답을 바탕으로 생성된 인사이트입니다
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 주요 인사이트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={
                    insight.type === 'problem' ? 'destructive' : 
                    insight.type === 'opportunity' ? 'default' : 'secondary'
                  }>
                    {insight.type === 'problem' ? '문제점' : 
                     insight.type === 'opportunity' ? '기회요소' : '인사이트'}
                  </Badge>
                  <h4 className="font-semibold">{insight.title}</h4>
                </div>
                <p className="text-gray-700">{insight.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Responses */}
      <Card>
        <CardHeader>
          <CardTitle>💬 상세 응답 내용</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockResponses.map((item, qIndex) => (
              <div key={qIndex}>
                <h4 className="font-semibold text-lg mb-3 text-blue-700">
                  Q{qIndex + 1}. {item.question}
                </h4>
                <div className="space-y-3">
                  {item.responses.map((response, rIndex) => (
                    <div key={rIndex} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{response.clone}</Badge>
                      </div>
                      <p className="text-gray-700">{response.answer}</p>
                    </div>
                  ))}
                </div>
                {qIndex < mockResponses.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Research Summary */}
      <Card>
        <CardHeader>
          <CardTitle>📋 연구 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">연구 대상</h5>
              <p className="text-gray-600">{researchData?.product}</p>
            </div>
            <div>
              <h5 className="font-medium mb-2">타겟 사용자</h5>
              <p className="text-gray-600">{researchData?.targetAudience}</p>
            </div>
            <div>
              <h5 className="font-medium mb-2">연령대</h5>
              <p className="text-gray-600">{researchData?.ageRange || '전체'}</p>
            </div>
            <div>
              <h5 className="font-medium mb-2">응답자 수</h5>
              <p className="text-gray-600">3명의 AI 클론</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          결과 다운로드
        </Button>
        <Button onClick={onReset} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          새로운 연구 시작
        </Button>
      </div>
    </div>
  );
};

export default InsightSummary;
