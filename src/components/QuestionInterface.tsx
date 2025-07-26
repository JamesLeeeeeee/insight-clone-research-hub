import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { ResearchData, CloneProfile, Question } from '@/types/research';
import { questionsAPI } from '@/lib/api';

interface QuestionInterfaceProps {
  researchData: ResearchData;
  selectedClones: CloneProfile[];
  researchId: string; 
  onComplete: () => void;
}

const QuestionInterface: React.FC<QuestionInterfaceProps> = ({ 
  researchData, 
  selectedClones, 
  researchId,
  onComplete 
}) => {
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', type: 'open' }
  ]);
  
  const [suggestionQuestions, setSuggestionQuestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 프로그래스 상태 관리를 위한 state 추가
  const [progressStage, setProgressStage] = useState(1);
  const [progressPercent, setProgressPercent] = useState({
    stage1: 0,
    stage2: 0,
    stage3: 0
  });
  
  const loadingRef = useRef<HTMLDivElement>(null);


  
  useEffect(() => {
    if (isSubmitting) {
      let interval: NodeJS.Timeout;
      
      // 단계별 진행률 업데이트
      if (progressStage === 1) {
        // 1단계: 0%에서 100%로 부드럽게 증가
        let percent = 0;
        interval = setInterval(() => {
          percent += 4; // 빠르게 증가
          if (percent >= 100) {
            clearInterval(interval);
            percent = 100;
          }
          setProgressPercent(prev => ({ ...prev, stage1: percent }));
        }, 50);
      } 
      else if (progressStage === 2) {
        // 2단계: 0%에서 100%로 부드럽게 증가
        let percent = 0;
        interval = setInterval(() => {
          percent += 2; // 1단계보다 느리게
          if (percent >= 100) {
            clearInterval(interval);
            percent = 100;
          }
          setProgressPercent(prev => ({ ...prev, stage1: 100, stage2: percent }));
        }, 50);
      }
      else if (progressStage === 3) {
        // 3단계: 0%에서 95%까지만 증가 (API 응답 대기 상태 표현)
        let percent = 0;
        interval = setInterval(() => {
          percent += 1; // 가장 느리게
          if (percent >= 95) {
            clearInterval(interval);
            percent = 95;
          }
          setProgressPercent(prev => ({ 
            ...prev, 
            stage1: 100, 
            stage2: 100, 
            stage3: percent 
          }));
        }, 50);
      }
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isSubmitting, progressStage]);

  // 스크롤바 다우닝 효과
  useEffect(() => {
    if (isSubmitting && loadingRef.current) {
      // 로딩 UI가 표시된 후 약간의 지연을 두고 스크롤 실행
      setTimeout(() => {
        loadingRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, [isSubmitting]);
  

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setSuggestionsLoading(true);
        const data = await questionsAPI.getRecommendations();
        setSuggestionQuestions(data.recommendations);
      } catch (error) {
        console.error("추천 질문 로딩 실패:", error);
        setSuggestionQuestions([
          "새로운 서비스나 제품을 처음 사용할 때 가장 중요하게 생각하는 요소는 무엇인가요?",
          "현재 사용하는 서비스에서 가장 불편한 점은 무엇이며, 어떻게 개선되기를 원하시나요?",
          "친구나 동료에게 제품을 추천할 때 어떤 점을 가장 강조하시나요?",
        ]);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      type: 'open'
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (id: string, text: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, text } : q
    ));
  };

  // 👈 handleSubmit 로직을 백엔드 API 호출로 변경
  const handleSubmit = async () => {
    const validQuestions = questions
      .map(q => ({ text: q.text.trim() }))
      .filter(q => q.text !== '');
  
    if (validQuestions.length === 0) {
      alert('최소 하나의 질문을 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // API 호출을 먼저 진행하되 결과를 저장해둡니다
      const apiPromise = questionsAPI.submitQuestions(researchId, validQuestions);
      
      // 최소 애니메이션 시간을 보장하기 위한 타이머
      const animationPromise = new Promise(resolve => {
        setTimeout(() => {
          // 단계 1: 이미 시작됨
          setTimeout(() => {
            setProgressStage(2); // 단계 2로 진행
            
            setTimeout(() => {
              setProgressStage(3); // 단계 3으로 진행
              
              // 마지막 단계 진행 후 일정 시간 대기
              setTimeout(() => {
                resolve(true);
              }, 2000);
            }, 2000);
          }, 1000);
        }, 0);
      });
      
      // 두 작업이 모두 완료될 때까지 기다립니다
      await Promise.all([apiPromise, animationPromise]);
      
      // 다음 단계로 진행
      onComplete();
    } catch (error) {
      console.error("질문 제출 실패:", error);
      alert("질문 제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Clones Summary */}
      <Card>
        <CardHeader>
          <CardTitle>선택된 AI 클론들</CardTitle>
          <CardDescription>
            다음 AI 클론들이 질문에 응답할 예정입니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {selectedClones.map((clone) => (
              <div key={clone.id} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                <span className="text-lg">{clone.avatar}</span>
                <div>
                  <div className="font-medium text-sm">{clone.name}</div>
                  <div className="text-xs text-gray-600">{clone.occupation}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ❓ 질문 작성
          </CardTitle>
          <CardDescription>
            AI 클론들에게 물어볼 질문들을 작성해주세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`question-${question.id}`}>
                  질문 {index + 1}
                </Label>
                {questions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Textarea
                id={`question-${question.id}`}
                placeholder="예: YouTube를 사용할 때 가장 불편한 점은 무엇인가요?"
                value={question.text}
                onChange={(e) => updateQuestion(question.id, e.target.value)}
                rows={2}
                disabled={isSubmitting}
              />
            </div>
          ))}
          
          <Button 
            onClick={addQuestion} 
            variant="outline" 
            className="w-full"
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-2" />
            질문 추가
          </Button>
        </CardContent>
      </Card>

      {/* Suggestion Questions */}
      <Card>
        <CardHeader>
          <CardTitle>💡 추천 질문</CardTitle>
          <CardDescription>
            클릭하여 질문을 추가하거나 참고하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suggestionsLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <p className="ml-3 text-gray-500">추천 질문을 생성 중입니다...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {suggestionQuestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    if (isSubmitting) return;
                    const emptyQuestion = questions.find(q => q.text.trim() === '');
                    if (emptyQuestion) {
                      updateQuestion(emptyQuestion.id, suggestion);
                    } else {
                      const newQuestion: Question = {
                        id: Date.now().toString(),
                        text: suggestion,
                        type: 'open'
                      };
                      setQuestions([...questions, newQuestion]);
                    }
                  }}
                >
                  <p className="text-sm text-gray-700">{suggestion}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

  {/* Submit Button */}
  <div className="text-center">
    <Button onClick={handleSubmit} size="lg" className="px-8" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          제출 중...
        </>
      ) : (
        "AI 클론들에게 질문하기 🚀"
      )}
    </Button>
  
    {isSubmitting && (
      <div ref={loadingRef} className="mt-6 bg-blue-50 rounded-lg p-6 text-left">
        <div className="flex items-center mb-4">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-800">AI</span>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-blue-800">
              {progressStage === 1 ? "질문 전송 중..." : 
               progressStage === 2 ? "AI 클론들이 분석 중..." : 
               "답변 생성 중..."}
            </h3>
            <div className="mt-1 flex space-x-1">
              <span className="text-sm text-blue-600">
                {progressStage}/3 단계 진행 중
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-1/4 font-medium text-blue-800">단계 1/3</div>
            <div className="w-3/4">
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                  style={{width: `${progressPercent.stage1}%`}}
                ></div>
              </div>
              <p className="text-sm mt-1 text-blue-700">
                {progressPercent.stage1 === 100 ? 
                  "✓ 질문 전송 완료" : "질문 전송 중..."}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-1/4 font-medium text-blue-800">단계 2/3</div>
            <div className="w-3/4">
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    progressStage >= 2 ? "bg-blue-500" : "bg-blue-200"
                  }`} 
                  style={{
                    width: `${progressPercent.stage2}%`,
                    opacity: progressStage >= 2 ? 1 : 0.5
                  }}
                ></div>
              </div>
              <p className="text-sm mt-1" 
                style={{color: progressStage >= 2 ? "#1D4ED8" : "#94A3B8"}}>
                {progressStage < 2 ? "대기 중..." : 
                 progressPercent.stage2 === 100 ? "✓ 분석 완료" : 
                 "AI 클론들이 질문을 분석 중..."}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-1/4 font-medium text-blue-800">단계 3/3</div>
            <div className="w-3/4">
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    progressStage >= 3 ? "bg-blue-500" : "bg-blue-200"
                  }`}
                  style={{
                    width: `${progressPercent.stage3}%`,
                    opacity: progressStage >= 3 ? 1 : 0.5
                  }}
                ></div>
              </div>
              <p className="text-sm mt-1"
                style={{color: progressStage >= 3 ? "#1D4ED8" : "#94A3B8"}}>
                {progressStage < 3 ? "대기 중..." : "답변 생성 중..."}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-blue-600 bg-blue-100 p-3 rounded">
          <p className="font-medium">💡 AI 처리 시간은 질문 복잡도, 클론 수 그리고 질문 수에 따라 다를 수 있습니다.</p>
          <p className="mt-1">평균 처리 시간: 3-5분</p>
        </div>
      </div>
      )}
    </div>
  </div>
);
};

export default QuestionInterface;