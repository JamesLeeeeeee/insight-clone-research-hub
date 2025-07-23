import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, RefreshCw, AlertTriangle, BrainCircuit } from 'lucide-react';
import { ResearchData, CloneProfile } from '@/types/research';
import { insightsAPI } from '@/lib/api';
import { Insight } from '@/types/insights';

interface InsightSummaryProps {
  researchData: ResearchData | null;
  researchId: string | null;
  selectedClones: CloneProfile[];
  onReset: () => void;
}

const InsightSummary: React.FC<InsightSummaryProps> = ({ 
  researchData, 
  researchId,
  selectedClones,
  onReset 
}) => {
  const [insights, setInsights] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // researchData.id 대신 researchId를 사용합니다.
    if (researchId) {
      const fetchInsights = async () => {
        try {
          setLoading(true);
          setError(null);
          // researchData.id 대신 researchId를 사용합니다. (숫자로 변환)
          const analysisResult = await insightsAPI.analyze(Number(researchId));
          setInsights(analysisResult);
        } catch (err) {
          setError('인사이트를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchInsights();
    } else {
      // researchId가 없는 경우 로딩을 멈추고 에러 메시지를 표시합니다.
      setLoading(false);
      setError("연구 ID가 없어 분석을 시작할 수 없습니다.");
    }
  }, [researchId]); // 의존성 배열에도 researchId를 사용합니다.

  const handleDownload = (format: 'pdf' | 'json') => {
    // researchData.id 대신 researchId를 사용합니다.
    if (researchId) {
      insightsAPI.download(Number(researchId), format).catch(err => {
        console.error('다운로드 실패:', err);
        alert(`${format.toUpperCase()} 파일 다운로드에 실패했습니다.`);
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <BrainCircuit className="h-12 w-12 mb-4 animate-pulse text-blue-500" />
        <p className="text-lg font-semibold">📊 AI가 인사이트를 분석하고 있습니다...</p>
        <p className="text-sm text-gray-500">잠시만 기다려주세요. 클론들의 답변을 종합하여 핵심을 도출하고 있습니다.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center text-red-600">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p className="text-lg font-semibold">{error}</p>
        <Button onClick={onReset} className="mt-4">
          연구 다시 시작하기
        </Button>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-center p-10">
        <p>분석된 인사이트가 없습니다.</p>
        <Button onClick={onReset} className="mt-4">
          연구 다시 시작하기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 연구 결과 및 인사이트
          </CardTitle>
          <CardDescription>
            {insights.summary || "AI 클론들의 응답을 바탕으로 생성된 종합적인 인사이트입니다."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 키 테마 섹션 추가 */}
      <Card>
        <CardHeader>
          <CardTitle>🔑 주요 테마</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(insights.key_themes || []).map((theme, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-1">
                {theme}
              </Badge>
            ))}
            {(!insights.key_themes || insights.key_themes.length === 0) && (
              <p className="text-gray-500">추출된 주요 테마가 없습니다.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 주요 인사이트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 방어적 프로그래밍: insights.insights가 없으면 빈 배열 사용 */}
            {(insights.insights || []).map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold text-base mb-2">{insight.title}</h4>
                <p className="text-gray-700 text-sm mb-3">{insight.description}</p>
                <div className="text-xs text-gray-500">
                  <strong>관련 응답:</strong> {(insight.supporting_evidence || []).join(', ')}
                </div>
              </div>
            ))}
            {/* insights.insights가 없거나 빈 배열인 경우 메시지 표시 */}
            {(!insights.insights || insights.insights.length === 0) && (
              <div className="p-4 border rounded-lg bg-gray-50 text-center">
                <p className="text-gray-700">분석된 인사이트가 없습니다.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 질문과 클론 답변 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>💬 질문 및 클론 응답</CardTitle>
          <CardDescription>
            각 질문에 대한 AI 클론들의 자세한 응답
          </CardDescription>
        </CardHeader>
        <CardContent>
          {insights.detailed_responses && insights.detailed_responses.length > 0 ? (
            <div className="space-y-6">
              {insights.detailed_responses.map((item, qIndex) => (
                <div key={qIndex} className="border rounded-lg overflow-hidden">
                  <div className="bg-blue-50 p-4 border-b">
                    <h4 className="font-medium text-blue-800">질문 {qIndex + 1}: {item.question_text}</h4>
                  </div>
                  <div className="divide-y">
                    {item.responses.map((response, rIndex) => (
                      <div key={rIndex} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-800">
                            {response.clone_name?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <p className="font-medium">{response.clone_name || `클론 ${rIndex + 1}`}</p>
                          </div>
                        </div>
                        <div className="pl-10">
                          <p className="text-gray-700 whitespace-pre-wrap">{response.response}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-gray-500">
              자세한 응답 데이터가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 다음 스텝  */}
      <Card>
        <CardHeader>
          <CardTitle>🛼 다음 스텝</CardTitle>
          <CardDescription>
            연구 결과를 바탕으로 권장되는 다음 액션 아이템
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.recommendations && insights.recommendations.length > 0 ? (
              <div className="space-y-3">
                {insights.recommendations.map((rec, index) => (
                  <div key={index} className="p-3 border-l-4 border-blue-400 bg-blue-50">
                    <h4 className="font-medium mb-1">{rec.action}</h4>
                    <p className="text-sm text-gray-600">{rec.rationale}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border rounded-lg bg-gray-50 text-center">
                <p className="text-gray-700">권장 액션 아이템이 없습니다.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>


      {/* 통계 정보 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{insights.insights?.length || 0}</p>
              <p className="text-sm text-gray-500">인사이트 수</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{insights.key_themes?.length || 0}</p>
              <p className="text-sm text-gray-500">주요 테마</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{insights.recommendations?.length || 0}</p>
              <p className="text-sm text-gray-500">권장 사항</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Research Summary */}
      <Card>
        <CardHeader>
          <CardTitle>📋 연구 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium mb-1 text-gray-500">연구 대상</h5>
              <p className="text-gray-800">{researchData?.product}</p>
            </div>
            <div>
              <h5 className="font-medium mb-1 text-gray-500">타겟 사용자</h5>
              <p className="text-gray-800">{researchData?.targetAudience}</p>
            </div>
            <div>
              <h5 className="font-medium mb-1 text-gray-500">연령대</h5>
              <p className="text-gray-800">{researchData?.ageRange || '전체'}</p>
            </div>
            <div>
              <h5 className="font-medium mb-1 text-gray-500">응답자 수</h5>
              <p className="text-gray-800">
                {selectedClones.length}명의 AI 클론
              </p>            
              </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <Button onClick={() => handleDownload('json')} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          JSON 다운로드
        </Button>
        <Button onClick={() => handleDownload('pdf')} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          PDF 다운로드
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