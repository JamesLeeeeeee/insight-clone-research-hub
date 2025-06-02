
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from 'lucide-react';
import { ResearchData, CloneProfile, Question } from '@/types/research';

interface QuestionInterfaceProps {
  researchData: ResearchData;
  selectedClones: CloneProfile[];
  onComplete: (responses: any[]) => void;
}

const QuestionInterface: React.FC<QuestionInterfaceProps> = ({ 
  researchData, 
  selectedClones, 
  onComplete 
}) => {
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', type: 'open' }
  ]);

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

  const handleSubmit = () => {
    const validQuestions = questions.filter(q => q.text.trim() !== '');
    if (validQuestions.length === 0) {
      alert('최소 하나의 질문을 입력해주세요.');
      return;
    }
    
    // In real implementation, this would send questions to AI clones via Dify API
    onComplete(validQuestions);
  };

  const suggestionQuestions = [
    `${researchData.product}를 사용할 때 가장 불편한 점은 무엇인가요?`,
    `${researchData.product}에서 가장 자주 사용하는 기능은 무엇인가요?`,
    `${researchData.product}를 개선한다면 어떤 부분을 바꾸고 싶나요?`,
    `${researchData.product} 사용 시 가장 중요하게 생각하는 요소는 무엇인가요?`,
    `${researchData.product}의 대안 제품을 사용해본 경험이 있나요?`
  ];

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
              />
            </div>
          ))}
          
          <Button 
            onClick={addQuestion} 
            variant="outline" 
            className="w-full"
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
          <div className="space-y-2">
            {suggestionQuestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
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
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center">
        <Button onClick={handleSubmit} size="lg" className="px-8">
          AI 클론들에게 질문하기 🚀
        </Button>
      </div>
    </div>
  );
};

export default QuestionInterface;
