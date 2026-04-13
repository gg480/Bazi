'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  MING_GE_64,
  getMingGeById,
  getRarityColor,
  getRarityBg,
  getWuxingColor,
  QUIZ_16,
  SECTIONS,
  extractBaziBits,
  aggregateQuizBits,
} from '@/lib/mingge';
import type { MingGeType, BaziForMingGe } from '@/lib/mingge';

type Phase = 'intro' | 'input' | 'loading' | 'quiz' | 'result';

// 十二时辰
const SHI_CHEN = [
  { label: '子时', range: '23:00-01:00', value: '00:00' },
  { label: '丑时', range: '01:00-03:00', value: '02:00' },
  { label: '寅时', range: '03:00-05:00', value: '04:00' },
  { label: '卯时', range: '05:00-07:00', value: '06:00' },
  { label: '辰时', range: '07:00-09:00', value: '08:00' },
  { label: '巳时', range: '09:00-11:00', value: '10:00' },
  { label: '午时', range: '11:00-13:00', value: '12:00' },
  { label: '未时', range: '13:00-15:00', value: '14:00' },
  { label: '申时', range: '15:00-17:00', value: '16:00' },
  { label: '酉时', range: '17:00-19:00', value: '18:00' },
  { label: '戌时', range: '19:00-21:00', value: '20:00' },
  { label: '亥时', range: '21:00-23:00', value: '22:00' },
];

export default function MingGePage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [shiChenIdx, setShiChenIdx] = useState(6); // 默认午时
  const [choices, setChoices] = useState<('A' | 'B')[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [baziInfo, setBaziInfo] = useState<BaziForMingGe | null>(null);
  const [result, setResult] = useState<MingGeType | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // ===== 八字计算 =====
  const calculateBazi = useCallback(async () => {
    if (!birthDate) { setErrorMsg('请输入出生日期'); return; }
    setPhase('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/divination/bazi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birth_date: birthDate,
          birth_time: SHI_CHEN[shiChenIdx].value,
          gender,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const info = extractBaziBits(data.data);
        setBaziInfo(info);
        setPhase('quiz');
      } else {
        setErrorMsg(data.error || '排盘失败');
        setPhase('input');
      }
    } catch {
      setErrorMsg('网络错误，请重试');
      setPhase('input');
    }
  }, [birthDate, gender, shiChenIdx]);

  // ===== 答题逻辑 =====
  const handleChoice = useCallback((choice: 'A' | 'B') => {
    const newChoices = [...choices, choice];
    setChoices(newChoices);
    if (currentQ < QUIZ_16.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQ(prev => prev + 1);
        setIsTransitioning(false);
      }, 250);
    } else {
      // 完成：计算命格
      const quizBits = aggregateQuizBits(newChoices);
      let id = 0;
      // bit0 = 日主阴阳, bit1 = 身强身弱
      if (baziInfo) { id |= baziInfo.yinYangBit; id |= baziInfo.strengthBit << 1; }
      // bit2-5 = 四篇
      quizBits.forEach((b, i) => { if (b) id |= (1 << (i + 2)); });
      const mg = getMingGeById(id);
      setResult(mg || null);
      setTimeout(() => setPhase('result'), 400);
    }
  }, [choices, currentQ, baziInfo]);

  // ===== 分享 =====
  const handleShare = useCallback(async () => {
    if (!result || !baziInfo) return;
    const p = baziInfo.pillars;
    const text = `【${result.name}】${result.verdict}\n\n八字：${p.year.stem}${p.year.branch} ${p.month.stem}${p.month.branch} ${p.day.stem}${p.day.branch} ${p.hour.stem}${p.hour.branch}\n日主${baziInfo.dayMaster}${baziInfo.dayMasterElement} · ${baziInfo.strengthBit ? '身强' : '身弱'}\n\n${result.motto}\n\n来测你的东方命格 →`;
    try {
      if (navigator.share) await navigator.share({ title: `我的命格：${result.name}`, text });
      else { await navigator.clipboard.writeText(text); alert('已复制到剪贴板'); }
    } catch { /* cancelled */ }
  }, [result, baziInfo]);

  const restart = useCallback(() => {
    setPhase('intro'); setChoices([]); setCurrentQ(0); setBaziInfo(null); setResult(null); setErrorMsg('');
  }, []);

  // ===================== 开场页 =====================
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Badge variant="outline" className="text-amber-700 dark:text-amber-300 border-amber-300 px-4 py-1 mb-6">
              八字天命 · 十六天问
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-700 via-amber-600 to-red-700 bg-clip-text text-transparent">
              六十四命格
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              以《周易》六十四卦为体，合八字天命与心性测定
            </p>
            <p className="text-sm text-gray-500 mb-10">
              输入生辰 → 八字排盘 → 十六道天问 → 推演专属命格
            </p>
            <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-900/20 dark:to-red-900/20 mb-8">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="text-6xl mb-4">☰</div>
                <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4">天命不可改，人事在己为</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4">
                  八字定天命（日主阴阳·身强身弱），十六天问测人事（心性·处世·行事·志向）。
                  六爻成卦，自然映射周易六十四卦，推演出你的专属命格。
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
                  {[
                    { icon: '命', label: '八字天命', desc: '排盘定根基' },
                    { icon: '问', label: '十六天问', desc: '四篇测心性' },
                    { icon: '卦', label: '六十四命格', desc: '文言四字名' },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="text-3xl font-bold text-amber-700 dark:text-amber-300 mb-1">{item.icon}</div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  ))}
                </div>
                <Button size="lg" className="text-xl px-12 py-7 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 shadow-lg" onClick={() => setPhase('input')}>
                  开始测定
                </Button>
                <p className="text-xs text-gray-500 mt-3">需 5 分钟 · 生辰 + 16 题 · 纯属娱乐</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // ===================== 生辰输入页 =====================
  if (phase === 'input' || phase === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center text-amber-900 dark:text-amber-100 mb-2">输入生辰</h2>
            <p className="text-sm text-center text-gray-500 mb-8">八字排盘需要准确的出生时间</p>

            <Card className="border-2 border-amber-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="pt-6 pb-6 px-6 space-y-6">
                {/* 出生日期 */}
                <div>
                  <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">出生日期（公历）</label>
                  <Input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="text-lg" />
                </div>

                {/* 性别 */}
                <div>
                  <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">性别</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['male', 'female'] as const).map(g => (
                      <button key={g} onClick={() => setGender(g)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${gender === g ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                        <span className="text-lg">{g === 'male' ? '男' : '女'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 出生时辰 */}
                <div>
                  <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">出生时辰</label>
                  <div className="grid grid-cols-4 gap-2">
                    {SHI_CHEN.map((sc, i) => (
                      <button key={i} onClick={() => setShiChenIdx(i)}
                        className={`p-2 rounded-lg border text-center text-sm transition-all ${shiChenIdx === i ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 font-bold text-amber-900 dark:text-amber-100' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
                        <div>{sc.label}</div>
                        <div className="text-xs opacity-60">{sc.range.slice(0, 5)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

                <Button size="lg" className="w-full text-lg bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700" onClick={calculateBazi} disabled={phase === 'loading'}>
                  {phase === 'loading' ? '排盘中...' : '排盘并开始测试'}
                </Button>

                <button onClick={() => setPhase('intro')} className="w-full text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-center">
                  返回首页
                </button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // ===================== 答题页 =====================
  if (phase === 'quiz' && baziInfo) {
    const q = QUIZ_16[currentQ];
    const currentSection = q.section;
    const sectionIdx = SECTIONS.findIndex(s => s.name === currentSection);
    const sectionStartIdx = SECTIONS[sectionIdx].ids[0] - 1;

    // 计算当前篇已完成几题
    const sectionDone = currentQ - sectionStartIdx + 1;

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-xl mx-auto">
            {/* 进度 + 八字摘要 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">第 {currentQ + 1} / 16 问</span>
                <Badge variant="outline" className="text-xs text-amber-700 dark:text-amber-300 border-amber-300">
                  {currentSection} · {q.yaoPosition}
                </Badge>
              </div>
              <Progress value={((currentQ) / 16) * 100} className="h-2 mb-3" />
              {/* 八字摘要条 */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <span>八字：{baziInfo.pillars.year.stem}{baziInfo.pillars.year.branch}</span>
                <span>·</span>
                <span>{baziInfo.pillars.month.stem}{baziInfo.pillars.month.branch}</span>
                <span>·</span>
                <span>{baziInfo.pillars.day.stem}{baziInfo.pillars.day.branch}</span>
                <span>·</span>
                <span>{baziInfo.pillars.hour.stem}{baziInfo.pillars.hour.branch}</span>
                <span className="ml-2 px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                  {baziInfo.dayMaster}{baziInfo.dayMasterElement}日主 · {baziInfo.strengthBit ? '身强' : '身弱'}
                </span>
              </div>
            </div>

            {/* 篇章进度指示器 */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {SECTIONS.map((sec, i) => {
                const isActive = i === sectionIdx;
                const isDone = i < sectionIdx || (i === sectionIdx && sectionDone >= 4);
                return (
                  <div key={i} className={`text-center py-2 rounded-lg transition-all ${isActive ? 'bg-amber-100 dark:bg-amber-900/30 border border-amber-300' : isDone ? 'bg-green-50 dark:bg-green-900/20 border border-green-200' : 'bg-gray-50 dark:bg-gray-800 border border-gray-200'}`}>
                    <div className={`text-xs font-medium ${isActive ? 'text-amber-700 dark:text-amber-300' : isDone ? 'text-green-600' : 'text-gray-400'}`}>{sec.name}</div>
                    <div className="text-xs text-gray-400">{sec.yao}</div>
                  </div>
                );
              })}
            </div>

            {/* 问题区 */}
            <div className={`transition-all duration-250 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <Card className="border-2 border-amber-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-5">
                <CardContent className="pt-6 pb-6 px-5">
                  <div className="text-center">
                    <div className="text-xs text-amber-600 dark:text-amber-400 mb-2">
                      {currentSection} · 第 {sectionDone} / 4 问
                    </div>
                    <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">{q.question}</h3>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <button onClick={() => handleChoice('A')}
                  className="w-full text-left p-5 rounded-xl border-2 border-amber-200 bg-white/80 hover:border-amber-500 hover:bg-amber-50 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                      <span className="text-amber-700 font-bold text-sm">阳</span>
                    </div>
                    <div>
                      <div className="text-base font-medium text-amber-900 dark:text-amber-100">{q.optionA.text}</div>
                      <div className="text-sm text-gray-500 mt-1">{q.optionA.sub}</div>
                    </div>
                  </div>
                </button>
                <button onClick={() => handleChoice('B')}
                  className="w-full text-left p-5 rounded-xl border-2 border-gray-200 bg-white/80 hover:border-gray-400 hover:bg-gray-50 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                      <span className="text-gray-600 font-bold text-sm">阴</span>
                    </div>
                    <div>
                      <div className="text-base font-medium text-gray-800 dark:text-gray-200">{q.optionB.text}</div>
                      <div className="text-sm text-gray-500 mt-1">{q.optionB.sub}</div>
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

  // ===================== 结果页 =====================
  if (phase === 'result' && result && baziInfo) {
    const p = baziInfo.pillars;
    const yangCount = (baziInfo.yinYangBit ? 1 : 0) + (baziInfo.strengthBit ? 1 : 0) +
      choices.slice(0, 4).filter(c => c === 'A').length >= 2 ? 1 : 0 +
      choices.slice(4, 8).filter(c => c === 'A').length >= 2 ? 1 : 0 +
      choices.slice(8, 12).filter(c => c === 'A').length >= 2 ? 1 : 0 +
      choices.slice(12, 16).filter(c => c === 'A').length >= 2 ? 1 : 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">

            {/* 命格标题 */}
            <div className="text-center mb-6">
              <Badge variant="outline" className="text-amber-700 dark:text-amber-300 border-amber-300 mb-3">测定完成</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-red-700 via-amber-600 to-red-700 bg-clip-text text-transparent">
                {result.name}
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <Badge className={getRarityBg(result.rarity)}><span className={getRarityColor(result.rarity)}>{result.rarity}</span></Badge>
                <Badge variant="outline" className="border-amber-300 text-amber-700">{result.hexagram}</Badge>
                <Badge variant="outline" className="border-amber-300 text-amber-700">五行属{result.wuxing}</Badge>
              </div>
            </div>

            {/* 八字四柱 */}
            <Card className={`border-2 ${getRarityBg(result.rarity)} backdrop-blur-sm mb-4`}>
              <CardContent className="pt-5 pb-5 px-4">
                <div className="text-center text-xs text-gray-500 mb-3">八字排盘 · 天命</div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { label: '年柱', gan: p.year.stem, zhi: p.year.branch },
                    { label: '月柱', gan: p.month.stem, zhi: p.month.branch },
                    { label: '日柱', gan: p.day.stem, zhi: p.day.branch },
                    { label: '时柱', gan: p.hour.stem, zhi: p.hour.branch },
                  ].map((pil, i) => (
                    <div key={i} className="text-center p-2 rounded-lg bg-white/60 dark:bg-gray-800/60">
                      <div className="text-xs text-gray-400">{pil.label}</div>
                      <div className="text-xl font-bold text-amber-900 dark:text-amber-100">{pil.gan}</div>
                      <div className="text-lg font-bold text-amber-700 dark:text-amber-300">{pil.zhi}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                  <span>日主 <b className="text-amber-700">{baziInfo.dayMaster}{baziInfo.dayMasterElement}</b></span>
                  <span>·</span>
                  <span className={baziInfo.strengthBit ? 'text-red-600' : 'text-blue-600'}>
                    {baziInfo.strengthBit ? '身强' : '身弱'}
                  </span>
                  <span>·</span>
                  <span>{baziInfo.yinYangBit ? '阳干' : '阴干'}</span>
                </div>
              </CardContent>
            </Card>

            {/* 六爻展示 */}
            <Card className="border border-amber-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-4">
              <CardContent className="pt-4 pb-4 px-4">
                <div className="text-center text-xs text-gray-500 mb-2">六爻 · 天命二爻 + 人事四爻</div>
                <div className="flex items-center justify-between">
                  <div className="text-center text-xs text-gray-400 space-y-1">
                    <div>上爻</div><div>五爻</div><div>四爻</div><div>三爻</div><div>二爻</div><div>初爻</div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    {[5, 4, 3, 2, 1, 0].map(bit => {
                      let val = 0;
                      if (bit === 0) val = baziInfo.yinYangBit;
                      else if (bit === 1) val = baziInfo.strengthBit;
                      else {
                        const sectionIdx = bit - 2;
                        const startIdx = sectionIdx * 4;
                        const endIdx = startIdx + 4;
                        const sectionChoices = choices.slice(startIdx, endIdx);
                        val = sectionChoices.filter(c => c === 'A').length >= 2 ? 1 : 0;
                      }
                      return (
                        <div key={bit} className={`font-mono text-lg tracking-widest ${val ? 'text-amber-900 dark:text-amber-100' : 'text-gray-300 dark:text-gray-500'}`}>
                          {val ? '━━━━━━' : '━━  ━━'}
                        </div>
                      );
                    })}
                    <div className="text-xs text-gray-400 mt-1">阳 {yangCount} · 阴 {6 - yangCount}</div>
                  </div>
                  <div className="text-center text-xs text-gray-400 space-y-1">
                    <div>志向</div><div>行事</div><div>处世</div><div>心性</div><div>强弱</div><div>阴阳</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 文言判词 */}
            <Card className="border border-amber-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-4">
              <CardContent className="pt-5 pb-5 px-5 text-center">
                <div className="text-xs text-gray-500 mb-2">判词</div>
                <p className="text-lg font-serif text-amber-900 dark:text-amber-100 leading-relaxed">{result.verdict}</p>
              </CardContent>
            </Card>

            {/* 性格解读 */}
            <Card className="border border-amber-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-4">
              <CardContent className="pt-5 pb-5 px-5">
                <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-3">性格解读</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{result.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {result.traits.map((t, i) => (
                    <Badge key={i} variant="outline" className="border-amber-300 text-amber-700 text-xs">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 八字解读 */}
            <Card className="border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-sm mb-4">
              <CardContent className="pt-5 pb-5 px-5">
                <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2">八字批断</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{baziInfo.strengthDesc}</p>
                {baziInfo.lunarInfo && (
                  <div className="text-xs text-gray-500 mt-2">
                    农历 {baziInfo.lunarInfo.lunarDate} · 生肖{baziInfo.lunarInfo.zodiac}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 人生箴言 */}
            <Card className="border border-amber-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-4">
              <CardContent className="pt-5 pb-5 px-5 text-center">
                <div className="text-xs text-gray-500 mb-2">人生箴言</div>
                <p className="text-xl font-serif text-amber-900 dark:text-amber-100">{result.motto}</p>
                <div className="text-xs text-gray-400 mt-2">—— {result.source}</div>
              </CardContent>
            </Card>

            {/* 出处与人物 */}
            <Card className="border border-amber-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-6">
              <CardContent className="pt-5 pb-5 px-5">
                <div className="grid grid-cols-2 gap-4">
                  <div><div className="text-xs text-gray-500 mb-1">典故出处</div><div className="text-sm font-medium text-amber-900">{result.source}</div></div>
                  <div><div className="text-xs text-gray-500 mb-1">代表人物</div><div className="text-sm font-medium text-amber-900">{result.example}</div></div>
                </div>
              </CardContent>
            </Card>

            {/* 按钮 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-amber-600 to-red-600" onClick={handleShare}>分享命格</Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-amber-300" onClick={restart}>重新测定</Button>
            </div>
            <div className="text-center text-xs text-gray-500 mb-4">
              本测试基于周易六十四卦体系 + 八字命理，仅供娱乐参考，不构成人生建议。
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
