'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AIReport {
  personality: string;
  career: string;
  relationship: string;
  health: string;
  wuxing_advice: string;
  dayun_summary: string;
  overall_score: number;
}

interface ProductRecommendation {
  primary_element: string;
  recommended_colors: string[];
  recommended: Array<{
    category: string;
    reason: string;
    priority: string;
  }>;
  avoid: Array<{
    category: string;
    reason: string;
  }>;
  styling_tip: string;
}

interface BaziResult {
  basic_info: {
    bazi_chart: {
      year_pillar: { stem: string; branch: string; element: string };
      month_pillar: { stem: string; branch: string; element: string };
      day_pillar: { stem: string; branch: string; element: string; is_day_master?: boolean };
      hour_pillar: { stem: string; branch: string; element: string };
      complete_chart: string;
      day_master: string;
      day_master_element: string;
    };
    lunar_info?: {
      lunar_date: string;
      zodiac: string;
    };
    personal_data?: {
      name: string;
    };
  };
  wuxing_analysis: {
    element_distribution: Record<string, number>;
    balance_analysis: string;
    personality_traits: string;
  };
  geju_analysis: {
    pattern_type: string;
    characteristics: string;
    career_path: string;
  };
  dayun_analysis: {
    current_age: number;
    current_dayun?: {
      ganzhi: string;
    };
    dayun_sequence: Array<{
      period: number;
      start_age: number;
      end_age: number;
      ganzhi: string;
      analysis: string;
    }>;
  };
  life_guidance: {
    overall_summary: string;
    career_development: string;
    wealth_management: string;
    marriage_relationships: string;
    health_wellness: string;
  };
}

interface PalaceData {
  position: string | { branch: string; description: string };
  main_stars: Array<string | { star: string; meaning?: string; name?: string }>;
  interpretation?: string;
}

interface ZiweiPalaceInfo {
  position: string;
  stars: string[];
  strength?: string;
  description?: string;
}

interface ZiweiStarChart {
  chart_type?: string;
  palace_distribution?: Record<string, ZiweiPalaceInfo>;
  star_summary?: {
    main_stars?: number;
    lucky_stars?: number;
    unlucky_stars?: number;
    total_stars?: number;
  };
}

interface EnhancedSiHua {
  year_stem?: string;
  hua_lu?: { star: string; meaning: string };
  hua_quan?: { star: string; meaning: string };
  hua_ke?: { star: string; meaning: string };
  hua_ji?: { star: string; meaning: string };
  enhanced_sihua?: Record<string, unknown>;
  multi_level_analysis?: Record<string, unknown>;
}

interface YijingRequestData {
  question: string;
  direction: string;
  method: string;
  bazi_data?: {
    bazi_chart?: {
      year_pillar?: { stem: string; branch: string };
      month_pillar?: { stem: string; branch: string };
      day_pillar?: { stem: string; branch: string };
      hour_pillar?: { stem: string; branch: string };
      complete_chart?: string;
    };
    wuxing_analysis?: {
      element_distribution: Record<string, number>;
      balance_analysis: string;
      personality_traits: string;
    };
    day_master?: string;
    lunar_info?: {
      lunar_date: string;
      zodiac: string;
    };
  };
  ziwei_data?: {
    ming_gong?: string;
    ming_gong_stars?: string[];
    wuxing_ju?: {
      type: string;
      nayin: string;
      number?: number;
      description?: string;
    };
  };
  personal_info?: {
    name: string;
    gender: string;
    birth_date: string;
    birth_time: string;
  };
}

interface ZiweiResult {
  basic_info?: {
    personal_data?: { name: string; birth_date: string; birth_time: string; gender: string };
    bazi_info?: { complete_chart: string; day_master: string };
    wuxing_ju?: { type: string; number: number; nayin: string; description: string; start_age: number };
    ming_gong_position?: { index: number; branch: string; description: string };
    lunar_info?: { lunar_date: string; zodiac: string };
  };
  ziwei_analysis?: {
    ming_gong: string;
    ming_gong_stars: string[];
    star_chart?: ZiweiStarChart;
    wuxing_ju_info?: { type: string; number: number; nayin: string; description: string; start_age: number };
    twelve_palaces?: Record<string, PalaceData>;
    si_hua?: {
      year_stem?: string;
      hua_lu?: { star: string; meaning: string } | string;
      hua_quan?: { star: string; meaning: string } | string;
      hua_ke?: { star: string; meaning: string } | string;
      hua_ji?: { star: string; meaning: string } | string;
      enhanced_sihua?: Record<string, unknown>;
      multi_level_analysis?: Record<string, unknown>;
    };
    major_periods?: Array<{ start_age: number; end_age: number; name: string; palace: string }>;
    personality_analysis?: { summary: string; description: string };
    career_analysis?: { summary: string; description: string };
    wealth_analysis?: { summary: string; description: string };
    relationship_analysis?: { summary: string; description: string };
    health_analysis?: { summary: string; description: string };
  }
  detailed_analysis?: string;
}

interface YijingResult {
  basic_info?: {
    divination_data?: { question: string; divination_time: string; method: string };
    hexagram_info?: { main_hexagram: string; main_hexagram_symbol: string; main_hexagram_number: number };
  };
  detailed_analysis?: {
    hexagram_analysis?: {
      primary_meaning: string;
      judgment: string;
      image: string;
      trigram_analysis: string;
      five_elements?: { upper_element: string; lower_element: string; relationship: string };
    };
    changing_lines_analysis?: {
      method: string;
      changing_lines_count: number;
      detailed_analysis?: Array<{
        line_position: string;
        line_text: string;
        practical_guidance: string;
      }>;
      overall_guidance: string;
    };
    changing_hexagram_analysis?: {
      name: string;
      meaning: string;
      transformation_insight: string;
      guidance: string;
    };
    numerology_trigram_analysis?: {
      upper_trigram_analysis?: { personalized_meaning: string };
      lower_trigram_analysis?: { personalized_meaning: string };
      combined_element?: { total_number: number; interpretation: string; harmony_analysis: { level: string } };
      overall_influence?: string;
    };
    overall_guidance?: string;
    practical_application?: {
      decision_making: string;
      timing_strategy?: string;
      success_factors?: string;
    };
  };
  divination_wisdom?: string | {
    key_message: string;
    action_advice: string;
    timing_guidance: string;
    philosophical_insight: string;
  };
}

export default function BaziPage() {
  // 安全获取星曜名称
  const getStarName = (star: unknown): string => {
    if (typeof star === 'string') return star;
    if (star && typeof star === 'object') {
      const obj = star as Record<string, unknown>;
      return String(obj.star || obj.name || obj.label || '');
    }
    return '';
  };

  const [view, setView] = useState<'input' | 'result'>('input');
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birth_date: '',
    birth_time: '',
    birth_place: ''
  });
  const [yijingFormData, setYijingFormData] = useState({
    question: '',
    direction: '',
    method: 'plum_blossom' as 'plum_blossom' | 'six_lines' | 'coin',
    use_bazi: true,
    use_ziwei: true
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [yijingLoading, setYijingLoading] = useState(false);
  const [result, setResult] = useState<BaziResult | null>(null);
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [recommendation, setRecommendation] = useState<ProductRecommendation | null>(null);
  const [ziweiResult, setZiweiResult] = useState<ZiweiResult | null>(null);
  const [yijingResult, setYijingResult] = useState<YijingResult | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'bazi' | 'ziwei' | 'ai' | 'products' | 'yijing'>('bazi');
  const [expandedPalace, setExpandedPalace] = useState<string | null>(null);

  const handleReset = () => {
    setView('input');
    setResult(null);
    setAiReport(null);
    setRecommendation(null);
    setZiweiResult(null);
    setYijingResult(null);
    setActiveTab('bazi');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setAiReport(null);
    setRecommendation(null);
    setZiweiResult(null);
    setYijingResult(null);

    try {
      // 获取八字命理数据
      const response = await fetch('/api/divination/bazi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '分析失败');

      setResult(data.data);
      setView('result');
      window.scrollTo(0, 0);
      
      // 并行获取其他分析
      generateAIReport(data.data, ziweiResult);
      generateProductRecommendation(data.data);
      generateZiweiAnalysis(formData);
      generateYijingDivination();
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const generateAIReport = async (baziData: BaziResult, ziweiData?: ZiweiResult | null) => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baziData, ziweiData }),
      });

      const data = await response.json();
      if (response.ok) {
        setAiReport(data.data);
      }
    } catch (err) {
      console.error('AI 报告生成失败:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const generateProductRecommendation = async (baziData: BaziResult) => {
    try {
      const response = await fetch('/api/products/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yongShen: [baziData.basic_info?.bazi_chart?.day_master_element || '木'],
          dayMasterElement: baziData.basic_info?.bazi_chart?.day_master_element || '木'
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setRecommendation(data.data);
      }
    } catch (err) {
      console.error('产品推荐生成失败:', err);
    }
  };

  const generateZiweiAnalysis = async (formData: Record<string, string>) => {
    try {
      const response = await fetch('/api/divination/ziwei', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setZiweiResult(data.data);
      }
    } catch (err) {
      console.error('紫微斗数分析失败:', err);
    }
  };

  const generateYijingDivination = async () => {
    if (!yijingFormData.question.trim()) {
      setError('请输入占卜问题');
      return;
    }

    setYijingLoading(true);
    setError('');

    try {
      // 准备请求数据，包含用户输入和八字/紫微数据
      const requestData: YijingRequestData = {
        question: yijingFormData.question.trim(),
        direction: yijingFormData.direction || '未指定',
        method: yijingFormData.method
      };

      // 如果用户选择使用八字数据，则传递八字信息
      if (yijingFormData.use_bazi && result) {
        requestData.bazi_data = {
          bazi_chart: result.basic_info?.bazi_chart,
          wuxing_analysis: result.wuxing_analysis,
          day_master: result.basic_info?.bazi_chart?.day_pillar?.stem,
          lunar_info: result.basic_info?.lunar_info
        };
      }

      // 如果用户选择使用紫微数据，则传递紫微信息
      if (yijingFormData.use_ziwei && ziweiResult) {
        requestData.ziwei_data = {
          ming_gong: ziweiResult.ziwei_analysis?.ming_gong,
          ming_gong_stars: ziweiResult.ziwei_analysis?.ming_gong_stars,
          wuxing_ju: ziweiResult.basic_info?.wuxing_ju
        };
      }

      // 传递个人基本信息
      if (result?.basic_info) {
        requestData.personal_info = {
          name: formData.name,
          gender: formData.gender,
          birth_date: formData.birth_date,
          birth_time: formData.birth_time
        };
      }

      const response = await fetch('/api/divination/yijing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (response.ok) {
        setYijingResult(data.data);
      } else {
        setError(data.error || '易经占卜失败');
      }
    } catch (err) {
      console.error('易经占卜失败:', err);
      setError('易经占卜失败，请稍后重试');
    } finally {
      setYijingLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'first': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      case 'second': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      case 'third': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'first': return '首选';
      case 'second': return '次选';
      case 'third': return '备选';
      default: return '推荐';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>
      
      <main className="container mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-700 to-red-700 bg-clip-text text-transparent">
            命理分析
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            八字命理 · 紫微斗数 · AI解读 · 命理选品 · 易经占卜
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* 输入态 */}
          {view === 'input' && (
            <Card className="mb-8 border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-amber-900 dark:text-amber-100">输入出生信息</CardTitle>
                <CardDescription>请填写准确的出生信息，以获得精准的分析结果</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input
                      id="name"
                      placeholder="请输入姓名"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">性别 *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择性别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">男</SelectItem>
                        <SelectItem value="female">女</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birth_date">出生日期 *</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birth_time">出生时间</Label>
                    <Input
                      id="birth_time"
                      type="time"
                      value={formData.birth_time}
                      onChange={(e) => setFormData({ ...formData, birth_time: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">如不清楚具体时间，可留空</p>
                  </div>

                  <div className="md:col-span-2">
                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm mb-4">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-semibold py-6"
                      disabled={loading}
                    >
                      {loading ? '排盘中...' : '开始分析'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* 结果态 */}
          {view === 'result' && result && (
            <>
              {/* 精简信息条 */}
              <Card className="mb-6 border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
                      <span className="font-semibold text-amber-900 dark:text-amber-100">
                        {formData.name || '求测者'}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">·</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {formData.gender === 'male' ? '男' : '女'}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">·</span>
                      <span className="text-gray-600 dark:text-gray-400">{formData.birth_date}</span>
                      <span className="text-gray-600 dark:text-gray-400">·</span>
                      <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-300 font-semibold">
                        {result.basic_info?.bazi_chart?.complete_chart}
                      </Badge>
                    </div>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="border-amber-600 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-300 dark:hover:bg-amber-900/20"
                    >
                      🔄 重新测算
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 结果展示 */}
              <div className="space-y-6">
                {/* 标签切换 */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={activeTab === 'bazi' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('bazi')}
                    className={activeTab === 'bazi' ? 'bg-gradient-to-r from-amber-600 to-red-600' : ''}
                  >
                    🎯 八字命理
                  </Button>
                  <Button
                    variant={activeTab === 'ziwei' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('ziwei')}
                    className={activeTab === 'ziwei' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                  >
                    🌟 紫微斗数
                  </Button>
                  <Button
                    variant={activeTab === 'ai' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('ai')}
                    className={activeTab === 'ai' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : ''}
                  >
                    🤖 AI 解读
                  </Button>
                  <Button
                    variant={activeTab === 'products' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('products')}
                    className={activeTab === 'products' ? 'bg-gradient-to-r from-green-600 to-teal-600' : ''}
                  >
                    💎 命理选品
                  </Button>
                  <Button
                    variant={activeTab === 'yijing' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('yijing')}
                    className={activeTab === 'yijing' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
                  >
                    🔮 易经占卜
                  </Button>
                </div>

                {/* 命盘分析 */}
                {activeTab === 'bazi' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* 四柱 */}
                    <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-amber-900 dark:text-amber-100">八字四柱</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-4 gap-2">
                          {['年柱', '月柱', '日柱', '时柱'].map((label, idx) => {
                            const pillars = [
                              result.basic_info?.bazi_chart?.year_pillar,
                              result.basic_info?.bazi_chart?.month_pillar,
                              result.basic_info?.bazi_chart?.day_pillar,
                              result.basic_info?.bazi_chart?.hour_pillar
                            ];
                            const pillar = pillars[idx];
                            return (
                              <div key={idx} className="text-center">
                                <div className="text-sm text-gray-500 mb-2">{label}</div>
                                <div className="bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 rounded-lg p-3">
                                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                                    {pillar?.stem || '-'}
                                  </div>
                                  <div className="text-xl font-bold text-amber-700 dark:text-amber-300 mt-1">
                                    {pillar?.branch || '-'}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <Separator className="my-4" />

                        <div>
                          <h4 className="font-semibold mb-2">格局分析</h4>
                          <Badge variant="outline" className="text-base py-1 px-3">
                            {result.geju_analysis?.pattern_type || '未知'}
                          </Badge>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {result.geju_analysis?.characteristics || ''}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 五行分布 */}
                    <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-amber-900 dark:text-amber-100">五行分布</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(result.wuxing_analysis.element_distribution).map(([element, count]) => {
                            const colors: Record<string, string> = {
                              '木': 'from-green-400 to-green-600',
                              '火': 'from-red-400 to-red-600',
                              '土': 'from-yellow-400 to-yellow-600',
                              '金': 'from-gray-300 to-gray-500',
                              '水': 'from-blue-400 to-blue-600'
                            };
                            return (
                              <div key={element} className="flex items-center gap-3">
                                <div className="w-8 text-center font-semibold">{element}</div>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                  <div
                                    className={`bg-gradient-to-r ${colors[element]} h-3 rounded-full transition-all`}
                                    style={{ width: `${Math.min((count as number) * 15, 100)}%` }}
                                  ></div>
                                </div>
                                <div className="w-8 text-center text-sm">{count as number}</div>
                              </div>
                            );
                          })}
                        </div>

                        <Separator className="my-4" />

                        <div>
                          <h4 className="font-semibold mb-2">性格特质</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {result.wuxing_analysis?.personality_traits || ''}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 大运流年 */}
                    <Card className="md:col-span-2 border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-amber-900 dark:text-amber-100">
                          大运流年（当前 {result.dayun_analysis?.current_age || 0} 岁）
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-4 gap-2">
                          {(result.dayun_analysis?.dayun_sequence || []).map((period, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border ${
                                result.dayun_analysis?.current_dayun?.ganzhi === period.ganzhi
                                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                              }`}
                            >
                              <div className="text-sm text-gray-500">{period.start_age}-{period.end_age}岁</div>
                              <div className="text-lg font-bold text-amber-700 dark:text-amber-300">{period.ganzhi}</div>
                              {result.dayun_analysis?.current_dayun?.ganzhi === period.ganzhi && (
                                <Badge className="mt-1 bg-amber-600 text-white text-xs">当前大运</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* AI 深度解读 */}
                {activeTab === 'ai' && (
                  <div className="space-y-4">
                    {aiLoading ? (
                      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <CardContent className="py-12 text-center">
                          <div className="animate-pulse">
                            <div className="text-4xl mb-4">🤖</div>
                            <p className="text-gray-600 dark:text-gray-400">AI 正在生成深度解读报告...</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : aiReport ? (
                      <>
                        {/* 综合评分 */}
                        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm">
                          <CardContent className="py-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-gray-500 mb-1">综合运势评分</div>
                                <div className="text-4xl font-bold text-purple-700 dark:text-purple-300">
                                  {aiReport.overall_score}
                                </div>
                              </div>
                              <Progress value={aiReport.overall_score} className="w-48 h-3" />
                            </div>
                          </CardContent>
                        </Card>

                        {/* 详细报告 */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                            <CardHeader>
                              <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                <span>👤</span> 性格特质
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {typeof aiReport.personality === 'string' 
                                  ? aiReport.personality 
                                  : JSON.stringify(aiReport.personality)}
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="border-2 border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                            <CardHeader>
                              <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
                                <span>💼</span> 事业财运
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {typeof aiReport.career === 'string' 
                                  ? aiReport.career 
                                  : JSON.stringify(aiReport.career)}
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="border-2 border-pink-200 dark:border-pink-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                            <CardHeader>
                              <CardTitle className="text-pink-900 dark:text-pink-100 flex items-center gap-2">
                                <span>💑</span> 感情婚姻
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {typeof aiReport.relationship === 'string' 
                                  ? aiReport.relationship 
                                  : JSON.stringify(aiReport.relationship)}
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="border-2 border-red-200 dark:border-red-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                            <CardHeader>
                              <CardTitle className="text-red-900 dark:text-red-100 flex items-center gap-2">
                                <span>🏥</span> 健康提示
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {typeof aiReport.health === 'string' 
                                  ? aiReport.health 
                                  : JSON.stringify(aiReport.health)}
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                            <CardHeader>
                              <CardTitle className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
                                <span>⚖️</span> 五行调候
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {typeof aiReport.wuxing_advice === 'string' 
                                  ? aiReport.wuxing_advice 
                                  : JSON.stringify(aiReport.wuxing_advice)}
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                            <CardHeader>
                              <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
                                <span>📈</span> 当前大运
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {typeof aiReport.dayun_summary === 'string' 
                                  ? aiReport.dayun_summary 
                                  : JSON.stringify(aiReport.dayun_summary)}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    ) : (
                      <Card className="border-2 border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <CardContent className="py-12 text-center text-gray-500">
                          AI 报告生成中，请稍候...
                        </CardContent>
                      </Card>
                    )}

                  </div>
                )}

                {/* 命理选品 */}
                {activeTab === 'products' && recommendation && (
                  <div className="space-y-4">
                    {/* 推荐颜色 */}
                    <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 backdrop-blur-sm">
                      <CardContent className="py-6">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">💎</div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">推荐色系</div>
                            <div className="flex gap-2">
                              {recommendation.recommended_colors.map((color, idx) => (
                                <Badge key={idx} variant="outline" className="text-base px-4 py-1">
                                  {color}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="ml-auto">
                            <Badge className="bg-amber-600 text-white text-base px-4 py-1">
                              五行：{recommendation.primary_element}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 推荐商品 */}
                    <Card className="border-2 border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-green-900 dark:text-green-100">推荐饰品</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-3">
                          {recommendation.recommended.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="font-semibold text-green-900 dark:text-green-100">
                                  {item.category}
                                </div>
                                <Badge className={getPriorityColor(item.priority) + ' text-xs'}>
                                  {getPriorityLabel(item.priority)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.reason}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 避免物品 */}
                    <Card className="border-2 border-red-200 dark:border-red-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-red-900 dark:text-red-100">避免物品</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-3">
                          {recommendation.avoid.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                            >
                              <div className="font-semibold text-red-900 dark:text-red-100 mb-2">
                                {item.category}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.reason}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 佩戴建议 */}
                    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-sm">
                      <CardContent className="py-6">
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">💡</div>
                          <div>
                            <div className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                              佩戴建议
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {recommendation.styling_tip}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* 紫微斗数 */}
                {activeTab === 'ziwei' && ziweiResult && (
                  <div className="space-y-6">
                    {/* 命格核心结论卡片 */}
                    <Card className="border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
                          <span className="text-2xl">✨</span>
                          命格核心结论
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* 核心格局 */}
                          <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-purple-600 text-white">命宫格局</Badge>
                              {ziweiResult.ziwei_analysis?.ming_gong_stars && ziweiResult.ziwei_analysis.ming_gong_stars.length > 0 && (
                                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                  主星：{ziweiResult.ziwei_analysis.ming_gong_stars.join('、')}
                                </span>
                              )}
                            </div>
                            {ziweiResult.basic_info?.ming_gong_position && (
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                命宫在{ziweiResult.basic_info.ming_gong_position.branch}位，{ziweiResult.basic_info.ming_gong_position.description}
                              </p>
                            )}
                          </div>

                          {/* 五行局 */}
                          {ziweiResult.basic_info?.wuxing_ju && (
                            <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-amber-600 text-white">五行局</Badge>
                                <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                                  {ziweiResult.basic_info.wuxing_ju.type}（{ziweiResult.basic_info.wuxing_ju.nayin}）
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {ziweiResult.basic_info.wuxing_ju.description}
                              </p>
                            </div>
                          )}

                          {/* 综合评价 */}
                          {ziweiResult.ziwei_analysis?.personality_analysis?.summary && (
                            <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {ziweiResult.ziwei_analysis.personality_analysis.summary}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 四化飞星 */}
                    {ziweiResult.ziwei_analysis?.si_hua && (
                      <Card className="border-2 border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-purple-900 dark:text-purple-100">四化飞星</CardTitle>
                          <CardDescription className="text-purple-700 dark:text-purple-300">
                            四化是根据生年天干产生的星曜能量变化，影响命运走向
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {/* 化禄 */}
                            {ziweiResult.ziwei_analysis.si_hua.hua_lu && (() => {
                              const huaLu = ziweiResult.ziwei_analysis.si_hua.hua_lu as {star?: string; meaning?: string} | string;
                              const starName = typeof huaLu === 'string' ? huaLu : huaLu?.star || '';
                              const meaning = typeof huaLu === 'string' ? '' : huaLu?.meaning || '';
                              return starName ? (
                                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="font-bold text-green-700 dark:text-green-300">化禄</span>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">禄者，财禄、福禄也</p>
                                  <p className="text-sm font-medium text-green-800 dark:text-green-200">主星：{starName}</p>
                                  {meaning && <p className="text-xs text-green-600 dark:text-green-400 mt-1">{meaning}</p>}
                                </div>
                              ) : null;
                            })()}
                            {/* 化权 */}
                            {ziweiResult.ziwei_analysis.si_hua.hua_quan && (() => {
                              const huaQuan = ziweiResult.ziwei_analysis.si_hua.hua_quan as {star?: string; meaning?: string} | string;
                              const starName = typeof huaQuan === 'string' ? huaQuan : huaQuan?.star || '';
                              const meaning = typeof huaQuan === 'string' ? '' : huaQuan?.meaning || '';
                              return starName ? (
                                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="font-bold text-blue-700 dark:text-blue-300">化权</span>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">权者，权力、权威也</p>
                                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">主星：{starName}</p>
                                  {meaning && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{meaning}</p>}
                                </div>
                              ) : null;
                            })()}
                            {/* 化科 */}
                            {ziweiResult.ziwei_analysis.si_hua.hua_ke && (() => {
                              const huaKe = ziweiResult.ziwei_analysis.si_hua.hua_ke as {star?: string; meaning?: string} | string;
                              const starName = typeof huaKe === 'string' ? huaKe : huaKe?.star || '';
                              const meaning = typeof huaKe === 'string' ? '' : huaKe?.meaning || '';
                              return starName ? (
                                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <span className="font-bold text-yellow-700 dark:text-yellow-300">化科</span>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">科者，名声、学问也</p>
                                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">主星：{starName}</p>
                                  {meaning && <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">{meaning}</p>}
                                </div>
                              ) : null;
                            })()}
                            {/* 化忌 */}
                            {ziweiResult.ziwei_analysis.si_hua.hua_ji && (() => {
                              const huaJi = ziweiResult.ziwei_analysis.si_hua.hua_ji as {star?: string; meaning?: string} | string;
                              const starName = typeof huaJi === 'string' ? huaJi : huaJi?.star || '';
                              const meaning = typeof huaJi === 'string' ? '' : huaJi?.meaning || '';
                              return starName ? (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span className="font-bold text-red-700 dark:text-red-300">化忌</span>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">忌者，阻碍、变动也</p>
                                  <p className="text-sm font-medium text-red-800 dark:text-red-200">主星：{starName}</p>
                                  {meaning && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{meaning}</p>}
                                </div>
                              ) : null;
                            })()}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* 十二宫位 - 3×4网格 */}
                    {(ziweiResult.ziwei_analysis?.star_chart?.palace_distribution || ziweiResult.ziwei_analysis?.twelve_palaces) && (
                      <Card className="border-2 border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-purple-900 dark:text-purple-100">十二宫位</CardTitle>
                          {ziweiResult.ziwei_analysis?.star_chart?.star_summary && (
                            <CardDescription className="text-purple-700 dark:text-purple-300">
                              共 {ziweiResult.ziwei_analysis.star_chart.star_summary.total_stars || 0} 颗星曜 · 主星 {ziweiResult.ziwei_analysis.star_chart.star_summary.main_stars || 0} 颗
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          {/* 3×4网格 */}
                          <div className="grid grid-cols-3 gap-3">
                            {(() => {
                              const palaceNames = ['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '交友宫', '事业宫', '田宅宫', '福德宫', '父母宫'];
                              const palaceDescriptions = ['自我、本质', '手足、朋友', '婚姻、配偶', '子孙、桃花', '财富、理财', '健康、疾病', '外出、际遇', '人脉、社交', '事业、工作', '房产、家业', '福气、享乐', '父母、长辈'];
                              
                              return palaceNames.map((palaceName, idx) => {
                                const palaceInfo = ziweiResult.ziwei_analysis?.star_chart?.palace_distribution?.[palaceName] || ziweiResult.ziwei_analysis?.twelve_palaces?.[palaceName];
                                const isExpanded = expandedPalace === palaceName;
                                
                                if (!palaceInfo) return null;
                                
                                const strengthColors: Record<string, string> = {
                                  '旺': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
                                  '得地': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                                  '不得地': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
                                  '平': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                };
                                
                                // 判断是哪种类型
                                const isZiweiPalaceInfo = 'stars' in palaceInfo;
                                const mainStars = isZiweiPalaceInfo ? palaceInfo.stars : palaceInfo.main_stars;
                                const stars = Array.isArray(mainStars) ? mainStars : [];
                                const starNames = stars.map((s: unknown) => getStarName(s)).filter(Boolean);
                                const position = typeof palaceInfo.position === 'string' ? palaceInfo.position : (palaceInfo.position?.branch || '');
                                const strength = isZiweiPalaceInfo ? palaceInfo.strength : undefined;
                                const description = isZiweiPalaceInfo ? palaceInfo.description : undefined;
                                const interpretation = !isZiweiPalaceInfo ? palaceInfo.interpretation : undefined;
                                
                                return (
                                  <div
                                    key={palaceName}
                                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                      isExpanded 
                                        ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/40' 
                                        : 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 hover:border-purple-400'
                                    }`}
                                    onClick={() => setExpandedPalace(isExpanded ? null : palaceName)}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-bold text-purple-900 dark:text-purple-100 text-sm">{palaceName}</span>
                                      {isExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{palaceDescriptions[idx]}</p>
                                    
                                    {/* 简略信息 */}
                                    {!isExpanded && (
                                      <div className="space-y-1">
                                        <Badge variant="outline" className="text-xs border-purple-400">
                                          {position}
                                        </Badge>
                                        {strength && (
                                          <Badge className={`text-xs ${strengthColors[strength] || 'bg-gray-100 text-gray-600'}`}>
                                            {strength}
                                          </Badge>
                                        )}
                                        {starNames.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {starNames.slice(0, 2).map((star: string, sIdx: number) => (
                                              <Badge key={sIdx} className="bg-purple-600 text-white text-xs">
                                                {star}
                                              </Badge>
                                            ))}
                                            {starNames.length > 2 && (
                                              <span className="text-xs text-purple-600 dark:text-purple-400">+{starNames.length - 2}</span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    
                                    {/* 展开详情 */}
                                    {isExpanded && (
                                      <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700 space-y-2">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-gray-600 dark:text-gray-400">方位：</span>
                                          <Badge variant="outline" className="text-xs border-purple-400">
                                            {position}
                                          </Badge>
                                        </div>
                                        {strength && (
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-600 dark:text-gray-400">旺衰：</span>
                                            <Badge className={`text-xs ${strengthColors[strength] || 'bg-gray-100 text-gray-600'}`}>
                                              {strength}
                                            </Badge>
                                          </div>
                                        )}
                                        {starNames.length > 0 && (
                                          <div>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">星曜：</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                              {starNames.map((star: string, sIdx: number) => (
                                                <Badge key={sIdx} className="bg-purple-600 text-white text-xs">
                                                  {star}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        {(description || interpretation) && (
                                          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {description || interpretation}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* 人生维度解读 */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* 性格维度 */}
                      {ziweiResult.ziwei_analysis?.personality_analysis && (
                        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                          <CardHeader>
                            <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
                              <span className="text-xl">🧠</span>
                              性格维度
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {ziweiResult.ziwei_analysis.personality_analysis.description || ziweiResult.ziwei_analysis.personality_analysis.summary || ''}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* 事业维度 */}
                      {ziweiResult.ziwei_analysis?.career_analysis && (
                        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                          <CardHeader>
                            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                              <span className="text-xl">💼</span>
                              事业维度
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {ziweiResult.ziwei_analysis.career_analysis.description || ziweiResult.ziwei_analysis.career_analysis.summary || ''}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* 财富维度 */}
                      {ziweiResult.ziwei_analysis?.wealth_analysis && (
                        <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                          <CardHeader>
                            <CardTitle className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
                              <span className="text-xl">💰</span>
                              财富维度
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {ziweiResult.ziwei_analysis.wealth_analysis.description || ziweiResult.ziwei_analysis.wealth_analysis.summary || ''}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* 感情维度 */}
                      {ziweiResult.ziwei_analysis?.relationship_analysis && (
                        <Card className="border-2 border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
                          <CardHeader>
                            <CardTitle className="text-pink-900 dark:text-pink-100 flex items-center gap-2">
                              <span className="text-xl">💕</span>
                              感情维度
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {ziweiResult.ziwei_analysis.relationship_analysis.description || ziweiResult.ziwei_analysis.relationship_analysis.summary || ''}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                )}

                {/* 易经占卜 */}
                {activeTab === 'yijing' && (
                  <div className="space-y-6">
                    {!yijingResult ? (
                      /* 易经占卜输入表单 */
                      <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-amber-900 dark:text-amber-100">易经占卜</CardTitle>
                          <CardDescription>请填写占卜信息，系统将结合您的八字和紫微数据进行综合解读</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* 占卜问题 */}
                            <div className="space-y-2">
                              <Label htmlFor="yijing-question">占卜问题 *</Label>
                              <Textarea
                                id="yijing-question"
                                placeholder="请输入您想占卜的问题（如：近期事业发展如何？感情运势如何？）"
                                value={yijingFormData.question}
                                onChange={(e) => setYijingFormData({ ...yijingFormData, question: e.target.value })}
                                rows={3}
                              />
                            </div>

                            {/* 方位 */}
                            <div className="space-y-2">
                              <Label htmlFor="yijing-direction">起卦方位</Label>
                              <Select
                                value={yijingFormData.direction || 'unspecified'}
                                onValueChange={(value) => setYijingFormData({ ...yijingFormData, direction: value === 'unspecified' ? '' : value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="请选择起卦方位（可选）" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="unspecified">不指定方位</SelectItem>
                                  <SelectItem value="东">东（东方）</SelectItem>
                                  <SelectItem value="南">南（南方）</SelectItem>
                                  <SelectItem value="西">西（西方）</SelectItem>
                                  <SelectItem value="北">北（北方）</SelectItem>
                                  <SelectItem value="东南">东南</SelectItem>
                                  <SelectItem value="西南">西南</SelectItem>
                                  <SelectItem value="东北">东北</SelectItem>
                                  <SelectItem value="西北">西北</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* 起卦方式 */}
                            <div className="space-y-2">
                              <Label htmlFor="yijing-method">起卦方式</Label>
                              <Select
                                value={yijingFormData.method}
                                onValueChange={(value: 'plum_blossom' | 'six_lines' | 'coin') => setYijingFormData({ ...yijingFormData, method: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="请选择起卦方式" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="plum_blossom">梅花易数（基于时间起卦）</SelectItem>
                                  <SelectItem value="six_lines">六爻占卜（基于金钱起卦）</SelectItem>
                                  <SelectItem value="coin">铜钱起卦（传统方法）</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* 数据选项 */}
                            <div className="space-y-3">
                              <Label>命理数据整合</Label>
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <div className="font-medium">结合八字命盘</div>
                                  <div className="text-sm text-gray-500">将您的八字五行等信息融入卦象解读</div>
                                </div>
                                <Checkbox
                                  id="use-bazi"
                                  checked={yijingFormData.use_bazi}
                                  onCheckedChange={(checked) =>
                                    setYijingFormData({ ...yijingFormData, use_bazi: !!checked })
                                  }
                                />
                              </div>
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <div className="font-medium">结合紫微斗数</div>
                                  <div className="text-sm text-gray-500">将您的紫微星曜信息融入卦象解读</div>
                                </div>
                                <Checkbox
                                  id="use-ziwei"
                                  checked={yijingFormData.use_ziwei}
                                  onCheckedChange={(checked) =>
                                    setYijingFormData({ ...yijingFormData, use_ziwei: !!checked })
                                  }
                                />
                              </div>
                            </div>

                            {/* 提交按钮 */}
                            <Button
                              onClick={generateYijingDivination}
                              disabled={yijingLoading || !yijingFormData.question.trim()}
                              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                            >
                              {yijingLoading ? '起卦中...' : '开始占卜'}
                            </Button>

                            {error && (
                              <div className="text-red-500 text-sm">{error}</div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      /* 占卜结果 */
                      <>
                        {/* 卦象信息 */}
                    <Card className="border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-amber-900 dark:text-amber-100 text-center">
                          卦象：{yijingResult.basic_info?.hexagram_info?.main_hexagram || '未知'}卦
                        </CardTitle>
                        <CardDescription className="text-center">
                          {yijingResult.basic_info?.divination_data?.method} · {yijingResult.basic_info?.divination_data?.question}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-6xl mb-4">{yijingResult.basic_info?.hexagram_info?.main_hexagram_symbol || '☯️'}</div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            第{yijingResult.basic_info?.hexagram_info?.main_hexagram_number || '?'}卦
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 综合指引（最重要，放在显眼位置） */}
                    {yijingResult.detailed_analysis?.overall_guidance && (
                      <Card className="border-4 border-amber-400 dark:border-amber-600 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 backdrop-blur-sm shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
                            <span className="text-2xl">🌟</span>
                            综合指引
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-base font-medium text-amber-900 dark:text-amber-100 leading-relaxed">
                            {yijingResult.detailed_analysis.overall_guidance}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* 卦象解读 */}
                    {yijingResult.detailed_analysis?.hexagram_analysis && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="md:col-span-2 border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                          <CardHeader>
                            <CardTitle className="text-amber-900 dark:text-amber-100">卦象含义</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-3">
                              {yijingResult.detailed_analysis.hexagram_analysis.primary_meaning}
                            </h3>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                          <CardHeader>
                            <CardTitle className="text-amber-900 dark:text-amber-100">彖辞</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
                              {yijingResult.detailed_analysis.hexagram_analysis.judgment}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                          <CardHeader>
                            <CardTitle className="text-amber-900 dark:text-amber-100">象辞</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
                              {yijingResult.detailed_analysis.hexagram_analysis.image}
                            </p>
                          </CardContent>
                        </Card>

                        {yijingResult.detailed_analysis.hexagram_analysis.five_elements && (
                          <Card className="md:col-span-2 border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                            <CardHeader>
                              <CardTitle className="text-amber-900 dark:text-amber-100">五行关系</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span>上卦：{yijingResult.detailed_analysis.hexagram_analysis.five_elements.upper_element}</span>
                                <span>·</span>
                                <span>下卦：{yijingResult.detailed_analysis.hexagram_analysis.five_elements.lower_element}</span>
                                <span>·</span>
                                <span>关系：{yijingResult.detailed_analysis.hexagram_analysis.five_elements.relationship}</span>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}

                    {/* 变爻 */}
                    {yijingResult.detailed_analysis?.changing_lines_analysis?.detailed_analysis && (
                      <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-amber-900 dark:text-amber-100">变爻解读</CardTitle>
                          <CardDescription>
                            {yijingResult.detailed_analysis.changing_lines_analysis.method}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {yijingResult.detailed_analysis.changing_lines_analysis.detailed_analysis.map((line, idx) => (
                              <div key={idx} className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                <div className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                                  {line.line_position}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 italic">
                                  {line.line_text}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {line.practical_guidance}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* 变卦分析 */}
                    {yijingResult.detailed_analysis?.changing_hexagram_analysis && (
                      <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-amber-900 dark:text-amber-100">变卦分析</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <span className="font-semibold text-amber-900 dark:text-amber-100">变卦：</span>
                              <span className="text-gray-700 dark:text-gray-300">{yijingResult.detailed_analysis.changing_hexagram_analysis.name}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-amber-900 dark:text-amber-100">含义：</span>
                              <span className="text-gray-700 dark:text-gray-300">{yijingResult.detailed_analysis.changing_hexagram_analysis.meaning}</span>
                            </div>
                            <div className="pt-2">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {yijingResult.detailed_analysis.changing_hexagram_analysis.guidance}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* 数理分析 */}
                    {yijingResult.detailed_analysis?.numerology_trigram_analysis && (
                      <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-amber-900 dark:text-amber-100">数理分析</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {yijingResult.detailed_analysis.numerology_trigram_analysis.upper_trigram_analysis && (
                              <div>
                                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">上卦</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {yijingResult.detailed_analysis.numerology_trigram_analysis.upper_trigram_analysis.personalized_meaning}
                                </p>
                              </div>
                            )}
                            {yijingResult.detailed_analysis.numerology_trigram_analysis.lower_trigram_analysis && (
                              <div>
                                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">下卦</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {yijingResult.detailed_analysis.numerology_trigram_analysis.lower_trigram_analysis.personalized_meaning}
                                </p>
                              </div>
                            )}
                            {yijingResult.detailed_analysis.numerology_trigram_analysis.combined_element && (
                              <div className="pt-2">
                                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">综合能量</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {yijingResult.detailed_analysis.numerology_trigram_analysis.combined_element.interpretation}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* 实用建议 */}
                    {yijingResult.detailed_analysis?.practical_application && (
                      <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-amber-900 dark:text-amber-100">实用建议</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {yijingResult.detailed_analysis.practical_application.decision_making && (
                              <li className="flex gap-2">
                                <span className="font-semibold text-amber-900 dark:text-amber-100">决策：</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{yijingResult.detailed_analysis.practical_application.decision_making}</span>
                              </li>
                            )}
                            {yijingResult.detailed_analysis.practical_application.timing_strategy && (
                              <li className="flex gap-2">
                                <span className="font-semibold text-amber-900 dark:text-amber-100">时机：</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{yijingResult.detailed_analysis.practical_application.timing_strategy}</span>
                              </li>
                            )}
                            {yijingResult.detailed_analysis.practical_application.success_factors && (
                              <li className="flex gap-2">
                                <span className="font-semibold text-amber-900 dark:text-amber-100">成功要素：</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{yijingResult.detailed_analysis.practical_application.success_factors}</span>
                              </li>
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* 占卜智慧 */}
                    {yijingResult.divination_wisdom && (
                      <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 backdrop-blur-sm">
                        <CardContent className="py-4">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">💡</div>
                            <div className="flex-1">
                              <div className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                                人生指引
                              </div>
                              {typeof yijingResult.divination_wisdom === 'string' ? (
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {yijingResult.divination_wisdom}
                                </p>
                              ) : (
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {yijingResult.divination_wisdom.key_message && (
                                    <div>
                                      <span className="font-semibold text-amber-900 dark:text-amber-100">核心信息：</span>
                                      {yijingResult.divination_wisdom.key_message}
                                    </div>
                                  )}
                                  {yijingResult.divination_wisdom.action_advice && (
                                    <div>
                                      <span className="font-semibold text-amber-900 dark:text-amber-100">行动建议：</span>
                                      {yijingResult.divination_wisdom.action_advice}
                                    </div>
                                  )}
                                  {yijingResult.divination_wisdom.timing_guidance && (
                                    <div>
                                      <span className="font-semibold text-amber-900 dark:text-amber-100">时机指引：</span>
                                      {yijingResult.divination_wisdom.timing_guidance}
                                    </div>
                                  )}
                                  {yijingResult.divination_wisdom.philosophical_insight && (
                                    <div>
                                      <span className="font-semibold text-amber-900 dark:text-amber-100">哲学启示：</span>
                                      {yijingResult.divination_wisdom.philosophical_insight}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {/* 重新占卜按钮 */}
                    <Button
                      onClick={() => setYijingResult(null)}
                      variant="outline"
                      className="w-full border-amber-400 text-amber-700 hover:bg-amber-50"
                    >
                      重新占卜
                    </Button>
                  </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
