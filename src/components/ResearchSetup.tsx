
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ResearchData, CloneProfile } from '@/types/research';
import { researchAPI } from '@/lib/api';
import { get } from 'http';

interface ResearchSetupProps {
  onComplete: (data: ResearchData, clones: CloneProfile[]) => void;
}

const ResearchSetup: React.FC<ResearchSetupProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<ResearchData>({
    product: '',
    targetAudience: '',
    ageRange: '',
    gender: '',
    occupation: '',
    additionalContext: ''
  });

  const [generatedClones, setGeneratedClones] = useState<CloneProfile[]>([]);
  const [showClones, setShowClones] = useState(false);

  const mockClones: CloneProfile[] = [
    {
      id: '1',
      name: '김민지',
      age: 25,
      gender: '여성',
      occupation: 'UI/UX 디자이너',
      personality: '창의적이고 디테일에 민감한 성격',
      avatar: '👩‍💻',
      background: '스타트업에서 3년차 디자이너로 근무'
    },
    {
      id: '2',
      name: '박준호',
      age: 28,
      gender: '남성',
      occupation: '프론트엔드 개발자',
      personality: '논리적이고 효율성을 중시하는 성격',
      avatar: '👨‍💻',
      background: '대기업에서 5년차 개발자로 근무'
    },
    {
      id: '3',
      name: '이수진',
      age: 32,
      gender: '여성',
      occupation: '프로덕트 매니저',
      personality: '사용자 중심적이고 분석적인 성격',
      avatar: '👩‍💼',
      background: '여러 테크 기업에서 PM 경험 보유'
    }
  ];

  const handleInputChange = (field: keyof ResearchData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateClones = async () => {
    if (!formData.product || !formData.targetAudience) {
      alert('제품명과 대상자는 필수 입력 항목입니다.');
      return;
    }

    try {
      const apiData = {
        product_name: formData.product,
        target_audience: formData.targetAudience,
        age_range: formData.ageRange,
        gender: formData.gender,
        occupation: formData.occupation,
        additional_context: formData.additionalContext
      };

      const response = await researchAPI.setupResearch(apiData);
      console.log("API 응답:", response);

      if (response.status === 'success' && response.recommended_clones) {
        const clones = response.recommended_clones.map((clone: any) => ({
          id: clone.clone_id,
          name: clone.name,
          age: clone.age,
          gender: clone.gender,
          occupation: clone.job_title || clone.occupation,
          personality: clone.personality,
          avatar: getAvatarForClone(clone),
          background: clone.background || `${clone.job_title || clone.occupation}로 활동 중`
        }));
        
        console.log("변환된 클론 데이터:", clones);
        setGeneratedClones(clones);
      } else {
        console.log("API 응답 실패, 목업 데이터 사용");
        setGeneratedClones(mockClones);
      }
    }  catch (error) {
      console.error('API 호출 실패, 더미 데이터 사용:', error);
      setGeneratedClones(mockClones);
    }
    
    setShowClones(true);
  };


    // 아바타 선택 함수 추가
  const getAvatarForClone = (clone: any) => {
    const jobTitle = ((clone.job_title || clone.occupation) || '').toLowerCase();
    
    if (jobTitle.includes('디자이너') || jobTitle.includes('디자인')) return '👩‍💻';
    if (jobTitle.includes('개발자') || jobTitle.includes('프로그래머') || jobTitle.includes('엔지니어')) return '👨‍💻';
    if (jobTitle.includes('선생님') || jobTitle.includes('교사') || jobTitle.includes('강사')) return '👩‍🏫';
    if (jobTitle.includes('학생') || jobTitle.includes('과정생')) return '👨‍🎓';
    if (jobTitle.includes('매니저') || jobTitle.includes('기획자')) return '👩‍💼';
    
    // 성별에 따른 기본 아바타
    return clone.gender.includes('여성') ? '👩' : '👨';
  };

  const handleSubmit = () => {
    if (!formData.product || !formData.targetAudience) {
      alert('제품명과 대상자는 필수 입력 항목입니다.');
      return;
    }
    onComplete(formData, generatedClones);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 연구 설정
          </CardTitle>
          <CardDescription>
            테스트하고자 하는 제품과 대상자 정보를 입력해주세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product">제품명 *</Label>
              <Input
                id="product"
                placeholder="예: YouTube, Instagram, Notion"
                value={formData.product}
                onChange={(e) => handleInputChange('product', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="targetAudience">대상자 *</Label>
              <Input
                id="targetAudience"
                placeholder="예: 소셜미디어 사용자, 학생, 직장인"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ageRange">연령대</Label>
              <Select onValueChange={(value) => handleInputChange('ageRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="연령대 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20-25">20-25세</SelectItem>
                  <SelectItem value="26-30">26-30세</SelectItem>
                  <SelectItem value="31-35">31-35세</SelectItem>
                  <SelectItem value="36-40">36-40세</SelectItem>
                  <SelectItem value="41+">41세 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gender">성별</Label>
              <Select onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="성별 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="occupation">직업/분야</Label>
              <Input
                id="occupation"
                placeholder="예: 개발자, 디자이너, 학생, 마케터"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="additionalContext">추가 컨텍스트</Label>
              <Textarea
                id="additionalContext"
                placeholder="연구 목적, 특별히 고려해야 할 사항 등을 자유롭게 작성해주세요"
                value={formData.additionalContext}
                onChange={(e) => handleInputChange('additionalContext', e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={generateClones} variant="outline" className="flex-1">
              🤖 AI 클론 생성
            </Button>
          </div>
        </CardContent>
      </Card>

      {showClones && (
        <Card>
          <CardHeader>
            <CardTitle>선택된 AI 클론들</CardTitle>
            <CardDescription>
              입력하신 조건에 맞는 AI 클론들이 생성되었습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generatedClones.map((clone) => (
                <div key={clone.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="text-center mb-3">
                    <div className="text-3xl mb-2">{clone.avatar}</div>
                    <h3 className="font-semibold text-lg">{clone.name}</h3>
                    <div className="flex justify-center gap-2 mt-2">
                      <Badge variant="secondary">{clone.age}세</Badge>
                      <Badge variant="secondary">{clone.gender}</Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>직업:</strong> {clone.occupation}</p>
                    <p><strong>성격:</strong> {clone.personality}</p>
                    <p><strong>배경:</strong> {clone.background}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button onClick={handleSubmit} size="lg" className="px-8">
                다음 단계로 진행 →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResearchSetup;
