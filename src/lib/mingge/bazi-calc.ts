/**
 * 八字 → 命格 bit 转换工具
 *
 * 从八字排盘数据中提取两个关键 bit：
 * - bit0: 日主阴阳（阳干=1, 阴干=0）
 * - bit1: 身强身弱（身强=1, 身弱=0）
 *
 * 身强身弱判定逻辑（简化版）：
 * 1. 检查月令是否得令（月支五行生扶日主）
 * 2. 统计八字中帮扶力量（比劫+印星）vs 耗泄力量（食伤+财+官杀）
 * 3. 综合判定身强或身弱
 */

export interface BaziForMingGe {
  /** 日主天干 */
  dayMaster: string;
  /** 日主五行 */
  dayMasterElement: string;
  /** 日主阴阳 (1=阳, 0=阴) */
  yinYangBit: 0 | 1;
  /** 身强身弱 (1=身强, 0=身弱) */
  strengthBit: 0 | 1;
  /** 四柱 */
  pillars: {
    year: { stem: string; branch: string };
    month: { stem: string; branch: string };
    day: { stem: string; branch: string };
    hour: { stem: string; branch: string };
  };
  /** 五行分布 */
  wuxingDistribution: Record<string, number>;
  /** 身强/身弱描述 */
  strengthDesc: string;
  /** 农历信息 */
  lunarInfo?: { lunarDate: string; zodiac: string };
}

// 阳干
const YANG_GAN = ['甲', '丙', '戊', '庚', '壬'];
// 阴干
const YIN_GAN = ['乙', '丁', '己', '辛', '癸'];

// 五行生克：key 生 value
const SHENG_MAP: Record<string, string> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};

// 五行：key 被 value 克
const KE_MAP: Record<string, string> = {
  '木': '金', '火': '水', '土': '木', '金': '火', '水': '土',
};

// 天干→五行
const GAN_WUXING: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
};

// 地支→五行
const ZHI_WUXING: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土',
  '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金',
  '戌': '土', '亥': '水',
};

// 地支藏干
const CANG_GAN: Record<string, string[]> = {
  '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'],
  '卯': ['乙'], '辰': ['戊', '乙', '癸'], '巳': ['丙', '戊', '庚'],
  '午': ['丁', '己'], '未': ['己', '丁', '乙'], '申': ['庚', '壬', '戊'],
  '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲'],
};

/**
 * 从八字排盘 API 返回结果中提取命格所需的两个 bit
 */
export function extractBaziBits(apiResponse: {
  basic_info: {
    bazi_chart: {
      day_master: string;
      day_master_element: string;
      year_pillar: { stem: string; branch: string };
      month_pillar: { stem: string; branch: string };
      day_pillar: { stem: string; branch: string };
      hour_pillar: { stem: string; branch: string };
    };
    lunar_info?: { lunar_date: string; zodiac: string } | null;
  };
  wuxing_analysis: {
    element_distribution: Record<string, number>;
  };
}): BaziForMingGe {
  const chart = apiResponse.basic_info.bazi_chart;
  const dayMaster = chart.day_master;
  const dayMasterElement = chart.day_master_element;

  // bit0: 日主阴阳
  const yinYangBit: 0 | 1 = YANG_GAN.includes(dayMaster) ? 1 : 0;

  // bit1: 身强身弱
  const strengthBit = calculateStrength(
    dayMasterElement,
    chart.month_pillar.branch,
    chart,
    apiResponse.wuxing_analysis.element_distribution,
  );

  const strengthDesc = strengthBit === 1
    ? `${dayMaster}${dayMasterElement}日主身强，命局帮扶之力充沛，个性刚毅果决，行动力强。`
    : `${dayMaster}${dayMasterElement}日主身弱，命局泄耗之力较重，个性内敛谨慎，需借外力以成事。`;

  return {
    dayMaster,
    dayMasterElement,
    yinYangBit,
    strengthBit,
    pillars: {
      year: { stem: chart.year_pillar.stem, branch: chart.year_pillar.branch },
      month: { stem: chart.month_pillar.stem, branch: chart.month_pillar.branch },
      day: { stem: chart.day_pillar.stem, branch: chart.day_pillar.branch },
      hour: { stem: chart.hour_pillar.stem, branch: chart.hour_pillar.branch },
    },
    wuxingDistribution: apiResponse.wuxing_analysis.element_distribution,
    strengthDesc,
    lunarInfo: apiResponse.basic_info.lunar_info || undefined,
  };
}

/**
 * 判定身强身弱
 *
 * 综合考虑：
 * 1. 月令得令（权重最高）
 * 2. 八字整体帮扶力量 vs 耗泄力量
 */
function calculateStrength(
  dayMasterElement: string,
  monthBranch: string,
  chart: {
    year_pillar: { stem: string; branch: string };
    month_pillar: { stem: string; branch: string };
    day_pillar: { stem: string; branch: string };
    hour_pillar: { stem: string; branch: string };
  },
  wuxingDist: Record<string, number>,
): 0 | 1 {
  let score = 0;

  // === 1. 月令得令 (权重 ±2) ===
  const monthElement = ZHI_WUXING[monthBranch];
  if (monthElement === dayMasterElement) {
    // 比劫当令，身强
    score += 2;
  } else if (SHENG_MAP[monthElement] === dayMasterElement) {
    // 月支生日主，印星当令，身强
    score += 1.5;
  } else if (monthElement === SHENG_MAP[dayMasterElement]) {
    // 日主生月支，食伤当令，身弱
    score -= 1.5;
  } else if (monthElement === KE_MAP[dayMasterElement]) {
    // 月支克日主，官杀当令，身弱
    score -= 2;
  }

  // === 2. 天干力量 (每个 ±0.5) ===
  const allStems = [
    chart.year_pillar.stem,
    chart.month_pillar.stem,
    chart.day_pillar.stem,
    chart.hour_pillar.stem,
  ];
  allStems.forEach(stem => {
    const elem = GAN_WUXING[stem];
    if (elem === dayMasterElement) score += 0.5;         // 比劫
    else if (SHENG_MAP[elem] === dayMasterElement) score += 0.3;  // 印星
    else if (SHENG_MAP[dayMasterElement] === elem) score -= 0.3;  // 食伤
    else if (KE_MAP[dayMasterElement] === elem) score -= 0.5;     // 官杀
  });

  // === 3. 地支藏干力量 (权重 ×0.3) ===
  const allBranches = [
    chart.year_pillar.branch,
    chart.month_pillar.branch,
    chart.day_pillar.branch,
    chart.hour_pillar.branch,
  ];
  allBranches.forEach(branch => {
    const hidden = CANG_GAN[branch] || [];
    hidden.forEach(hs => {
      const elem = GAN_WUXING[hs];
      if (!elem) return;
      if (elem === dayMasterElement) score += 0.2;
      else if (SHENG_MAP[elem] === dayMasterElement) score += 0.15;
      else if (SHENG_MAP[dayMasterElement] === elem) score -= 0.15;
      else if (KE_MAP[dayMasterElement] === elem) score -= 0.2;
    });
  });

  return score >= 0 ? 1 : 0;
}
