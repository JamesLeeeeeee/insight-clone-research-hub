
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [responses, setResponses] = useState<any[]>([]);

  const progress = (currentStep / 4) * 100;

  const handleResearchSetup = (data: ResearchData, clones: CloneProfile[]) => {
    setResearchData(data);
    setSelectedClones(clones);
    setCurrentStep(2);
  };

  const handleQuestionsComplete = (questionResponses: any[]) => {
    setResponses(questionResponses);
    setCurrentStep(3);
  };

  const resetResearch = () => {
    setCurrentStep(1);
    setResearchData(null);
    setSelectedClones([]);
    setResponses([]);
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

        {currentStep === 2 && researchData && (
          <QuestionInterface 
            researchData={researchData}
            selectedClones={selectedClones}
            onComplete={handleQuestionsComplete}
          />
        )}

        {currentStep === 3 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">AI 클론들이 응답 중입니다...</h3>
            <p className="text-gray-600">잠시만 기다려주세요</p>
            <Button 
              onClick={() => setCurrentStep(4)} 
              className="mt-4"
              variant="outline"
            >
              결과 보기 (임시)
            </Button>
          </div>
        )}

        {currentStep === 4 && (
          <InsightSummary 
            researchData={researchData}
            responses={responses}
            onReset={resetResearch}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
