import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ResearchSetup from '@/components/ResearchSetup';
import QuestionInterface from '@/components/QuestionInterface';
import InsightSummary from '@/components/InsightSummary';
import { ResearchData, CloneProfile } from '@/types/research';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [selectedClones, setSelectedClones] = useState<CloneProfile[]>([]);
  const [researchId, setResearchId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const progress = (currentStep / 4) * 100;

  const handleResearchSetup = (data: ResearchData, clones: CloneProfile[], id: string) => {
    setResearchData(data);
    setSelectedClones(clones);
    setResearchId(id);
    setCurrentStep(2);
  };

  // 👈 질문 제출이 완료되면 3단계로 넘어갑니다.
  const handleQuestionsComplete = () => {
    setCurrentStep(3);
    // 5초 후에 자동으로 4단계로 넘어가도록 설정 (실제로는 상태 폴링 필요)
    setTimeout(() => {
      setIsAnalyzing(true);
      setCurrentStep(4);
    }, 5000);
  };

  const resetResearch = () => {
    setCurrentStep(1);
    setResearchData(null);
    setSelectedClones([]);
    setResearchId(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Clone Research Platform
          </h1>
          <p className="text-lg text-gray-600">
            UI/UX 리서처를 위한 AI 클론 테스트 도구
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">진행률</span>
              <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span className={currentStep >= 1 ? "text-blue-600 font-medium" : ""}>연구 설정</span>
              <span className={currentStep >= 2 ? "text-blue-600 font-medium" : ""}>질문 작성</span>
              <span className={currentStep >= 3 ? "text-blue-600 font-medium" : ""}>응답 수집</span>
              <span className={currentStep >= 4 ? "text-blue-600 font-medium" : ""}>인사이트 분석</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        {currentStep === 1 && (
          <ResearchSetup onComplete={handleResearchSetup} />
        )}

        {currentStep === 2 && researchData && researchId && (
          <QuestionInterface 
            researchData={researchData}
            selectedClones={selectedClones}
            researchId={researchId} // 👈 researchId를 전달합니다.
            onComplete={handleQuestionsComplete} // 👈 새로운 핸들러를 전달합니다.
          />
        )}

        {currentStep === 3 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">AI 클론들이 응답 중입니다...</h3>
            <p className="text-gray-600">잠시만 기다려주세요. 약 1~2분 소요될 수 있습니다.</p>
          </div>
        )}

        {currentStep === 4 && (
          <InsightSummary 
            researchData={researchData}
            researchId={researchId}
            selectedClones={selectedClones} 
            onReset={resetResearch}
          />
        )}
      </div>
    </div>
  );
};

export default Index;