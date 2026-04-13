/**
 * 十六天问 · 性格测定问卷
 *
 * 分四篇，每篇四问，每问阴阳二选。
 * 每篇取多数决，得 1 bit，共 4 bit，合八字 2 bit，成六爻定卦。
 *
 * 心性篇（初爻·根基） → bit2
 * 处世篇（二爻·心性） → bit3
 * 行事篇（三爻·行事） → bit4
 * 志向篇（四爻·格局） → bit5
 */

import type { YaoValue } from './types';

export interface Quiz16Question {
  /** 题号 1-16 */
  id: number;
  /** 篇名 */
  section: '心性篇' | '处世篇' | '行事篇' | '志向篇';
  /** 对应爻位 */
  yaoPosition: '初爻' | '二爻' | '三爻' | '四爻';
  /** 题目 */
  question: string;
  /** 甲选（阳爻） */
  optionA: { text: string; sub: string };
  /** 乙选（阴爻） */
  optionB: { text: string; sub: string };
}

export const QUIZ_16: Quiz16Question[] = [
  // ═══════════════════════════════════════
  // 心性篇（初爻·根基）Q1-Q4
  // ═══════════════════════════════════════
  {
    id: 1, section: '心性篇', yaoPosition: '初爻',
    question: '面对未知，你更像是——',
    optionA: { text: '开路先锋', sub: '勇于踏入荒野，在未知中开疆辟土' },
    optionB: { text: '守夜之人', sub: '静观暗流涌动，洞察局势再谋定后动' },
  },
  {
    id: 2, section: '心性篇', yaoPosition: '初爻',
    question: '关于自己的不足，你更认同——',
    optionA: { text: '知不足而后勇', sub: '缺什么补什么，百炼方能成钢' },
    optionB: { text: '万物有裂痕', sub: '那是光照进来的地方，接纳即为圆满' },
  },
  {
    id: 3, section: '心性篇', yaoPosition: '初爻',
    question: '深夜独处，思绪更常飞向——',
    optionA: { text: '明日战场', sub: '运筹帷幄，思索下一步该如何落子' },
    optionB: { text: '今日所历', sub: '反求诸己，在回忆中沉淀与领悟' },
  },
  {
    id: 4, section: '心性篇', yaoPosition: '初爻',
    question: '你更信奉——',
    optionA: { text: '天赋决定上限', sub: '找准自己的天命所在，方能一飞冲天' },
    optionB: { text: '勤能补拙', sub: '水滴石穿，日拱一卒方能功不唐捐' },
  },

  // ═══════════════════════════════════════
  // 处世篇（二爻·心性）Q5-Q8
  // ═══════════════════════════════════════
  {
    id: 5, section: '处世篇', yaoPosition: '二爻',
    question: '人海之中，你的生存之道是——',
    optionA: { text: '广结善缘', sub: '四海之内皆兄弟，人脉即资源' },
    optionB: { text: '知音难觅', sub: '得一知己足矣，重质不重量' },
  },
  {
    id: 6, section: '处世篇', yaoPosition: '二爻',
    question: '面对冲突，你更倾向于——',
    optionA: { text: '理直气壮', sub: '寸步不让，是非曲直必须分明' },
    optionB: { text: '以和为贵', sub: '退一步海阔天空，留得青山在' },
  },
  {
    id: 7, section: '处世篇', yaoPosition: '二爻',
    question: '你更珍视的关系是——',
    optionA: { text: '并肩之谊', sub: '相互成就的战友，共赴远方' },
    optionB: { text: '莫逆之交', sub: '心意相通的知己，无需多言' },
  },
  {
    id: 8, section: '处世篇', yaoPosition: '二爻',
    question: '你更在意别人如何评价你——',
    optionA: { text: '此人有大才', sub: '能力和成就是最好的名片' },
    optionB: { text: '此人靠得住', sub: '品格与信义才是立身之本' },
  },

  // ═══════════════════════════════════════
  // 行事篇（三爻·行事）Q9-Q12
  // ═══════════════════════════════════════
  {
    id: 9, section: '行事篇', yaoPosition: '三爻',
    question: '做重大抉择，你更信赖——',
    optionA: { text: '胆识与直觉', sub: '当机立断，富贵险中求' },
    optionB: { text: '理性与谋略', sub: '三思而行，算无遗策' },
  },
  {
    id: 10, section: '行事篇', yaoPosition: '三爻',
    question: '你的理想节奏是——',
    optionA: { text: '雷厉风行', sub: '天下武功唯快不破，日新月异' },
    optionB: { text: '稳扎稳打', sub: '步步为营，慢即是快' },
  },
  {
    id: 11, section: '行事篇', yaoPosition: '三爻',
    question: '遇到阻碍，你更可能——',
    optionA: { text: '迎难而上', sub: '正面强攻，不信有攻不破的坚壁' },
    optionB: { text: '声东击西', sub: '迂回化解，善战者不在于久战' },
  },
  {
    id: 12, section: '行事篇', yaoPosition: '三爻',
    question: '你更习惯——',
    optionA: { text: '边走边看', sub: '在行动中找到方向，想太多不如做起来' },
    optionB: { text: '谋定后动', sub: '不打无准备之仗，凡事预则立' },
  },

  // ═══════════════════════════════════════
  // 志向篇（四爻·格局）Q13-Q16
  // ═══════════════════════════════════════
  {
    id: 13, section: '志向篇', yaoPosition: '四爻',
    question: '你向往的人生是——',
    optionA: { text: '乘风破浪', sub: '纵横捭阖，名垂青史方不负此生' },
    optionB: { text: '采菊东篱', sub: '悠然见山，现世安稳即是最好' },
  },
  {
    id: 14, section: '志向篇', yaoPosition: '四爻',
    question: '此生你最看重——',
    optionA: { text: '建功立业', sub: '不负才华不负己，要在这世间留下痕迹' },
    optionB: { text: '内心富足', sub: '不负真情不负心，心安之处即是归途' },
  },
  {
    id: 15, section: '志向篇', yaoPosition: '四爻',
    question: '机会与风险并存时——',
    optionA: { text: '宁可冒险', sub: '不可错失良机，富贵险中求' },
    optionB: { text: '宁可错过', sub: '不可贸然涉险，留得青山在' },
  },
  {
    id: 16, section: '志向篇', yaoPosition: '四爻',
    question: '若此生有憾，最可能是——',
    optionA: { text: '怀才不遇', sub: '壮志未酬身先老，辜负一身好才华' },
    optionB: { text: '情深不寿', sub: '众叛亲离无人问，辜负一片赤诚心' },
  },
];

/** 四篇名称与卦理维度 */
export const SECTIONS = [
  { name: '心性篇', yao: '初爻', dimension: '根基·天赋禀性', ids: [1, 2, 3, 4] },
  { name: '处世篇', yao: '二爻', dimension: '心性·刚柔取向', ids: [5, 6, 7, 8] },
  { name: '行事篇', yao: '三爻', dimension: '行事·动静之别', ids: [9, 10, 11, 12] },
  { name: '志向篇', yao: '四爻', dimension: '格局·显隐之道', ids: [13, 14, 15, 16] },
];

/**
 * 将 16 道题的答案合并为 4 个 bit（每篇取多数决）
 * 返回 [bit2, bit3, bit4, bit5]（对应初爻到四爻）
 */
export function aggregateQuizBits(choices: ('A' | 'B')[]): [YaoValue, YaoValue, YaoValue, YaoValue] {
  const result: YaoValue[] = [];

  for (const section of SECTIONS) {
    const sectionChoices = section.ids.map(id => choices[id - 1]);
    const yangCount = sectionChoices.filter(c => c === 'A').length;
    result.push(yangCount >= 2 ? 1 : 0);
  }

  return result as [YaoValue, YaoValue, YaoValue, YaoValue];
}
