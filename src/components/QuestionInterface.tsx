import React, { useState, useEffect } from 'react';
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
  researchId: string; // 👈 researchId를 props로 받습니다.
  onComplete: () => void; // 👈 onComplete는 이제 인자를 받지 않습니다.
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
  const [isSubmitting, setIsSubmitting] = useState(false); // 👈 제출 중 상태 추가

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
      // researchId와 질문 목록을 백엔드로 전송합니다.
      await questionsAPI.submitQuestions(researchId, validQuestions);
      onComplete(); // 성공 시 다음 단계로 이동
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
      </div>
    </div>
  );
};

export default QuestionInterface;