import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';
import { ResearchData, CloneProfile } from '@/types/research';
import { researchAPI } from '@/lib/api';

interface ResearchSetupProps {
  onComplete: (data: ResearchData, clones: CloneProfile[], researchId: string) => void;
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
  const [isLoading, setIsLoading] = useState(false);
  const [researchId, setResearchId] = useState<string | null>(null);

  const clonesRef = useRef<HTMLDivElement>(null);

  // 스크롤 다운 효과
  useEffect(() => {
    if (showClones && clonesRef.current) {
      clonesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showClones]);


  const handleInputChange = (field: keyof ResearchData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateClones = async () => {
    if (!formData.product || !formData.targetAudience) {
      alert('제품명과 대상자는 필수 입력 항목입니다.');
      return;
    }

    setIsLoading(true);
    try {
      const apiData = {
        product_name: formData.product,
        target_audience: formData.targetAudience,
        age_group: formData.ageRange,
        gender: formData.gender === 'all' ? null : formData.gender.toUpperCase(),
        job_field: formData.occupation,
        additional_context: formData.additionalContext
      };

      const response = await researchAPI.setupResearch(apiData);
      
      if (response.status === 'success' && response.recommended_clones) {
        const clones = response.recommended_clones.map((clone: any) => ({
          id: clone.clone_id,
          name: clone.name,
          age: clone.age,
          gender: clone.gender,
          occupation: clone.occupation,
          personality: clone.personality,
          avatar: getAvatarForClone(clone), 
          background: clone.background
        }));
        
        setGeneratedClones(clones);
        setResearchId(response.research_id);
        setShowClones(true);
      } else {
        alert(`클론 생성 실패: ${response.message || '알 수 없는 오류'}`);
        setShowClones(false);
      }
    } catch (error) {
      console.error('API 호출 실패:', error);
      alert('서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setShowClones(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvatarForClone = (clone: any) => {
    const jobTitle = (clone.occupation || '').toLowerCase();
    const isMale = clone.gender === 'male';

    if (jobTitle.includes('디자이너')) return isMale ? '👨‍🎨' : '👩‍🎨';
    if (jobTitle.includes('개발자') || jobTitle.includes('엔지니어')) return isMale ? '👨‍💻' : '👩‍💻';
    if (jobTitle.includes('매니저') || jobTitle.includes('기획자')) return isMale ? '👨‍💼' : '👩‍💼';
    if (jobTitle.includes('마케터')) return '📈';
    if (jobTitle.includes('학생')) return isMale ? '👨‍🎓' : '👩‍🎓';
    if (jobTitle.includes('선생님') || jobTitle.includes('교사')) return isMale ? '👨‍🏫' : '👩‍🏫';
    
    // 기본값
    return isMale ? '👨' : '👩';
  };

  const handleSubmit = () => {
    if (!researchId) {
      alert('클론 생성을 먼저 완료해주세요.');
      return;
    }
    onComplete(formData, generatedClones, researchId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 연구 설정
          </CardTitle>
          <CardDescription>
            테스트하고자 하는 서비스와 대상자 정보를 입력해주세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product">서비스명 *</Label>
              <Input
                id="product"
                placeholder="예: 서비스 도메인(예 : 컨텐츠 플랫폼)"
                value={formData.product}
                onChange={(e) => handleInputChange('product', e.target.value)}
                
              />
            </div>
            <div>
              <Label htmlFor="targetAudience">대상자 *</Label>
              <Input
                id="targetAudience"
                placeholder="예: 컨텐츠 사용자, 학생, 직장인"
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
                  <SelectItem value="10대">10대</SelectItem>
                  <SelectItem value="20대">20대</SelectItem>
                  <SelectItem value="30대">30대</SelectItem>
                  <SelectItem value="40대">40대</SelectItem>
                  <SelectItem value="50대 이상">50대 이상</SelectItem>
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
                  <SelectItem value="MALE">남성</SelectItem>
                  <SelectItem value="FEMALE">여성</SelectItem>
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
            <Button onClick={generateClones} variant="outline" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  AI 클론 생성 중...
                </>
              ) : (
                "🤖 AI 클론 생성"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showClones && (
        <Card ref={clonesRef}>
          <CardHeader>
            <CardTitle>추천된 AI 클론</CardTitle>
            <CardDescription>
              입력하신 조건에 가장 적합한 AI 클론들입니다.
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
                      <span className="text-sm text-gray-500">{clone.age}세</span>
                      <span className="text-sm text-gray-500">{clone.gender === 'male' ? '남성' : '여성'}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>직업:</strong> {clone.occupation}</p>
                    <p><strong>성격:</strong> {clone.personality}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button onClick={handleSubmit} size="lg" className="px-8" disabled={isLoading}>
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