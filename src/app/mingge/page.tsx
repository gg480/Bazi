'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  QUIZ_QUESTIONS,
  parseAnswers,
  getHexagramDisplay,
  calculateMingGeId,
  getMingGeById,
  getRarityColor,
  getRarityBg,
  getWuxingColor,
} from '@/lib/mingge';
import type { YaoValue, MingGeType } from '@/lib/mingge';

type Phase = 'intro' | 'quiz' | 'result';

export default function MingGePage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [choices, setChoices] = useState<('A' | 'B')[]>([]);
  const [result, setResult] = useState<MingGeType | null>(null);
  const [hexagramDisplay, setHexagramDisplay] = useState<ReturnType<typeof getHexagramDisplay> | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const startQuiz = useCallback(() => {
    setPhase('quiz');
    setCurrentQ(0);
    setChoices([]);
  }, []);

  const handleChoice = useCallback(
    (choice: 'A' | 'B') => {
      const newChoices = [...choices, choice];
      setChoices(newChoices);

      if (currentQ < QUIZ_QUESTIONS.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentQ(prev => prev + 1);
          setIsTransitioning(false);
        }, 300);
      } else {
        // 测试完成
        const answers = parseAnswers(newChoices);
        const id = calculateMingGeId(answers);
        const mingGe = getMingGeById(id);
        const display = getHexagramDisplay(answers);
        setResult(mingGe || null);
        setHexagramDisplay(display);
        setTimeout(() => setPhase('result'), 500);
      }
    },
    [choices, currentQ],
  );

  const restartQuiz = useCallback(() => {
    setPhase('intro');
    setCurrentQ(0);
    setChoices([]);
    setResult(null);
    setHexagramDisplay(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleShare = useCallback(async () => {
    if (!result || !resultRef.current) return;

    try {
      const text = `【${result.name}】${result.verdict}\n\n我的命格是「${result.hexagram}」——${result.name}\n${result.motto}\n\n来测测你的东方命格 →`;
      if (navigator.share) {
        await navigator.share({ title: `我的命格：${result.name}`, text });
      } else {
        await navigator.clipboard.writeText(text);
        alert('已复制到剪贴板，快去分享吧！');
      }
    } catch {
      // 用户取消分享
    }
  }, [result]);

  // ===== 开场页 =====
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* 标题区 */}
            <div className="text-center mb-12">
              <Badge variant="outline" className="text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 px-4 py-1 mb-6">
                周易 · 六爻测定
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-700 via-amber-600 to-red-700 bg-clip-text text-transparent">
                六十四命格
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                东方版性格测试 · 以《周易》六十四卦为体
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                六道天问，每问阴阳二选，六爻成卦，自然映射六十四种命格
              </p>
            </div>

            {/* 核心卡片 */}
            <Card className="border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 backdrop-blur-sm mb-8">
              <CardContent className="pt-10 pb-10 px-8">
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4">
                    ☰
                  </div>
                  <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                    六道天问 · 测定你的命格
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    回答六道关于心性、行事、志向的天问，系统将根据你的六爻组合，
                    推演出专属命格——每一种命格对应周易六十四卦之一，
                    配以四字雅号、文言判词、人生箴言。
                  </p>

                  {/* 特点展示 */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    {[
                      { icon: '☰', label: '六十四卦', desc: '周易古法' },
                      { icon: '龙', label: '四字命格', desc: '文言雅号' },
                      { icon: '◈', label: '个性解析', desc: '深度解读' },
                    ].map((item, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <div className="font-medium text-sm text-amber-900 dark:text-amber-100">
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="lg"
                    className="text-xl px-12 py-7 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 shadow-lg mt-4"
                    onClick={startQuiz}
                  >
                    开始测定
                  </Button>
                  <p className="text-xs text-gray-500">
                    仅需 3 分钟 · 六道单选题 · 纯属娱乐
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 命格示例 */}
            <div className="mb-8">
              <h3 className="text-center text-sm text-muted-foreground mb-4">
                「 部分命格一览 」
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { name: '飞龙在天', rarity: '绝品' },
                  { name: '韬光养晦', rarity: '珍品' },
                  { name: '浴火重生', rarity: '绝品' },
                  { name: '深渊潜行', rarity: '极品' },
                  { name: '春风化雨', rarity: '良品' },
                  { name: '卧薪尝胆', rarity: '珍品' },
                  { name: '大器晚成', rarity: '极品' },
                  { name: '池中化龙', rarity: '珍品' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="text-center p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-amber-200/50 dark:border-amber-800/50"
                  >
                    <div className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      {item.name}
                    </div>
                    <div className={`text-xs mt-1 ${getRarityColor(item.rarity as MingGeType['rarity'])}`}>
                      {item.rarity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 免责声明 */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              本测试仅供娱乐参考，命格结果基于周易卦象体系，不构成任何人生决策建议。
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ===== 答题页 =====
  if (phase === 'quiz') {
    const q = QUIZ_QUESTIONS[currentQ];
    const progress = ((currentQ) / QUIZ_QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-xl mx-auto">
            {/* 进度条 */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  第 {currentQ + 1} / {QUIZ_QUESTIONS.length} 问
                </span>
                <Badge variant="outline" className="text-xs text-amber-700 dark:text-amber-300 border-amber-300">
                  {q.yaoName} · {q.dimension}
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* 问题区 */}
            <div
              className={`transition-all duration-300 ${
                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
            >
              <Card className="border-2 border-amber-300 dark:border-amber-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-6">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">
                      {['☶', '☵', '☲', '☳', '☴', '☰'][currentQ]}
                    </div>
                    <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                      {q.question}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {q.subtitle}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 选项 */}
              <div className="space-y-4">
                <button
                  onClick={() => handleChoice('A')}
                  className="w-full text-left p-6 rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/60 transition-colors">
                      <span className="text-amber-700 dark:text-amber-300 font-bold">阳</span>
                    </div>
                    <div>
                      <div className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-1">
                        {q.optionA.text}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {q.optionA.description}
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleChoice('B')}
                  className="w-full text-left p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                      <span className="text-gray-600 dark:text-gray-300 font-bold">阴</span>
                    </div>
                    <div>
                      <div className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
                        {q.optionB.text}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {q.optionB.description}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ===== 结果页 =====
  if (phase === 'result' && result && hexagramDisplay) {
    const yangCount = hexagramDisplay.lines.filter(l => l.value === 1).length;

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
        <main className="container mx-auto px-4 py-8" ref={resultRef}>
          <div className="max-w-2xl mx-auto">
            {/* 命格标题 */}
            <div className="text-center mb-8">
              <Badge variant="outline" className="text-amber-700 dark:text-amber-300 border-amber-300 mb-4">
                测定完成
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-red-700 via-amber-600 to-red-700 bg-clip-text text-transparent">
                {result.name}
              </h1>
              <div className="flex items-center justify-center gap-3 mt-3">
                <Badge className={getRarityBg(result.rarity)}>
                  <span className={getRarityColor(result.rarity)}>{result.rarity}</span>
                </Badge>
                <Badge variant="outline" className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300">
                  {result.hexagram}
                </Badge>
                <Badge variant="outline" className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300">
                  五行属{result.wuxing}
                </Badge>
              </div>
            </div>

            {/* 卦象展示 */}
            <Card className={`border-2 ${getRarityBg(result.rarity)} backdrop-blur-sm mb-6`}>
              <CardContent className="pt-8 pb-8 px-6">
                <div className="flex items-center justify-between">
                  {/* 上卦信息 */}
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">外卦</div>
                    <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                      {result.upperGua}
                    </div>
                  </div>

                  {/* 六爻展示 */}
                  <div className="flex flex-col items-center gap-1 px-6">
                    {hexagramDisplay.lines.map((line, i) => (
                      <div
                        key={i}
                        className={`font-mono text-lg tracking-widest ${
                          line.value === 1
                            ? 'text-amber-900 dark:text-amber-100'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {line.value === 1 ? '━━━━━━' : '━━  ━━'}
                      </div>
                    ))}
                    <div className="text-xs text-gray-400 mt-2">
                      阳爻 {yangCount} · 阴爻 {6 - yangCount}
                    </div>
                  </div>

                  {/* 下卦信息 */}
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">内卦</div>
                    <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                      {result.lowerGua}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 文言判词 */}
            <Card className="border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-6">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">判词</div>
                  <p className="text-lg font-serif text-amber-900 dark:text-amber-100 leading-relaxed">
                    {result.verdict}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 性格解读 */}
            <Card className="border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-6">
              <CardContent className="pt-6 pb-6 px-6">
                <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-3">
                  性格解读
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {result.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {result.traits.map((trait, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
                    >
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 人生箴言 */}
            <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-sm mb-6">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">人生箴言</div>
                  <p className="text-xl font-serif text-amber-900 dark:text-amber-100">
                    {result.motto}
                  </p>
                  <div className="text-xs text-gray-400 mt-2">
                    —— {result.source}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 典故与代表人物 */}
            <Card className="border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-6">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">典故出处</div>
                    <div className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      {result.source}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">代表人物</div>
                    <div className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      {result.example}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 五行属性行 */}
            <Card className="border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-8">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getWuxingColor(result.wuxing) }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    五行属
                    <span className="font-bold text-amber-900 dark:text-amber-100">
                      {result.wuxing}
                    </span>
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="text-lg px-8 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700"
                onClick={handleShare}
              >
                分享命格
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-amber-300 dark:border-amber-700"
                onClick={restartQuiz}
              >
                重新测定
              </Button>
            </div>

            {/* 免责声明 */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-4">
              本测试基于周易六十四卦体系，仅供娱乐参考，不构成任何人生决策建议。
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
