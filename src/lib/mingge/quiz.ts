/**
 * 六爻测定·六道天问
 *
 * 每问设甲、乙二选，甲为阳爻，乙为阴爻。
 * 六问自下而上对应六爻，合而为卦，映射六十四命格。
 *
 * 问心 → 初爻（根基）
 * 问性 → 二爻（心性）
 * 问行 → 三爻（行事）
 * 问势 → 四爻（格局）
 * 问志 → 五爻（志向）
 * 问命 → 上爻（天命）
 */

import type { YaoValue } from './types';

export interface QuizQuestion {
  /** 题号 1-6 */
  id: number;
  /** 题目（文言简练） */
  question: string;
  /** 题目副标题（白话解释） */
  subtitle: string;
  /** 对应爻位名称 */
  yaoName: string;
  /** 对应卦理维度 */
  dimension: string;
  /** 甲选（阳爻） */
  optionA: {
    text: string;
    description: string;
  };
  /** 乙选（阴爻） */
  optionB: {
    text: string;
    description: string;
  };
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '问心：你天生是何等心性？',
    subtitle: '探寻你灵魂深处的底色',
    yaoName: '初爻',
    dimension: '根基·天赋禀性',
    optionA: {
      text: '生而为将，天命在我',
      description: '我天生就有领导他人的气魄，不甘居人下，相信事在人为，命由己造。'
    },
    optionB: {
      text: '厚德载物，甘为基石',
      description: '我更愿意做好本分，默默支撑团队，不求名利，但求无愧于心。'
    },
  },
  {
    id: 2,
    question: '问性：面对困局，你如何抉择？',
    subtitle: '直击你处世的性情底色',
    yaoName: '二爻',
    dimension: '心性·刚柔取向',
    optionA: {
      text: '以刚克之，宁折不弯',
      description: '困境当前，我选择正面突破，宁可碰得头破血流，也不愿退缩半步。'
    },
    optionB: {
      text: '以柔化之，借力打力',
      description: '困境当前，我选择迂回化解，相信柔软胜过刚硬，弯路有时更快。'
    },
  },
  {
    id: 3,
    question: '问行：你理想的人生节奏？',
    subtitle: '映射你的行动方式与节奏',
    yaoName: '三爻',
    dimension: '行事·动静之别',
    optionA: {
      text: '乘风破浪，敢为天下先',
      description: '我喜欢主动出击，开创新局面。宁可犯错，也不愿错过。'
    },
    optionB: {
      text: '谋定后动，水到渠成',
      description: '我习惯深思熟虑，等待最佳时机。宁可慢一步，也要稳一分。'
    },
  },
  {
    id: 4,
    question: '问势：置身人群之中，你如何自处？',
    subtitle: '揭示你在社交格局中的位置',
    yaoName: '四爻',
    dimension: '格局·显隐之道',
    optionA: {
      text: '高居明堂，引领群伦',
      description: '我习惯站到台前，凝聚人心，带领团队攻坚克难。'
    },
    optionB: {
      text: '幕布之后，运筹帷幄',
      description: '我更擅长在幕后策划，用智慧和策略影响事态走向。'
    },
  },
  {
    id: 5,
    question: '问志：此生所求，究竟为何？',
    subtitle: '照见你内心深处的执念',
    yaoName: '五爻',
    dimension: '志向·大小之辨',
    optionA: {
      text: '经世济民，青史留名',
      description: '我要改变世界，做一番惊天动地的大事业，让后世记住我的名字。'
    },
    optionB: {
      text: '独善其身，心安即是归处',
      description: '我更想经营好自己的一生，不求闻达于诸侯，但求无愧于天地。'
    },
  },
  {
    id: 6,
    question: '问命：你如何面对命运？',
    subtitle: '最终一问，叩问你的天命观',
    yaoName: '上爻',
    dimension: '天命·造化与抗争',
    optionA: {
      text: '天行健，我必逆天改命',
      description: '我不信命，更不信命定论。命运掌握在自己手中，我命由我不由天。'
    },
    optionB: {
      text: '知天命，顺其自然而不妄为',
      description: '我相信有些事是人力无法改变的。与其抗争，不如顺应天时，顺势而为。'
    },
  },
];

/** 将用户答案（A/B选择）转换为爻值数组 */
export function parseAnswers(choices: ('A' | 'B')[]): YaoValue[] {
  return choices.map(c => c === 'A' ? 1 : 0) as YaoValue[];
}

/** 获取六爻的卦象表示（用于结果展示） */
export function getHexagramDisplay(answers: YaoValue[]): {
  lines: { value: YaoValue; label: string }[];
  binary: string;
} {
  const lines = answers.map((v, i) => ({
    value: v,
    label: ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'][i],
  }));

  return {
    lines,
    binary: answers.map(v => v === 1 ? '━' : '━ ━').join(' '),
  };
}
