/**
 * 八字排盘引擎
 * 基于 lunar-javascript 库实现精准排盘
 * 支持：真太阳时校正、节气精确计算、藏干、神煞
 */

import { Solar, Lunar, EightChar, Luck } from 'lunar-javascript';

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行
const WU_XING: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土',
  '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金',
  '戌': '土', '亥': '水'
};

// 十神关系
const SHI_SHEN: Record<string, Record<string, string>> = {
  '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印' },
  '乙': { '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印' },
  '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官' },
  '丁': { '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀' },
  '戊': { '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财' },
  '己': { '甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财' },
  '庚': { '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官' },
  '辛': { '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神' },
  '壬': { '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财' },
  '癸': { '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩' }
};

// 藏干表
const CANG_GAN: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '戊', '庚'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
};

// 排盘输入参数
interface BaziInput {
  birth_date: string;  // 公历日期 YYYY-MM-DD
  birth_time: string;  // 出生时间 HH:MM
  gender: 'male' | 'female' | '男' | '女';
  name?: string;
  birth_place?: string; // 出生地（用于真太阳时校正）
  longitude?: number;   // 经度（用于真太阳时校正）
}

// 四柱信息
interface PillarInfo {
  stem: string;         // 天干
  branch: string;       // 地支
  element: string;      // 五行
  hidden_stems: string[]; // 藏干
  ten_god: string;      // 十神（相对于日主）
  nayin?: string;       // 纳音
}

// 排盘结果
interface BaziChart {
  year_pillar: PillarInfo;
  month_pillar: PillarInfo;
  day_pillar: PillarInfo;
  hour_pillar: PillarInfo;
  day_master: string;           // 日主
  day_master_element: string;   // 日主五行
  complete_chart: string;       // 完整八字
  solar_term_info?: {           // 节气信息
    current_term: string;
    next_term: string;
    next_term_date: string;
  };
  true_solar_time?: {           // 真太阳时信息
    local_time: string;
    true_time: string;
    adjustment_minutes: number;
  };
  lunar_info?: {                // 农历信息
    lunar_date: string;
    lunar_year: number;
    lunar_month: number;
    lunar_day: number;
    is_leap: boolean;
    zodiac: string;
  };
}

// 大运信息
interface DayunInfo {
  start_age: number;
  end_age: number;
  ganzhi: string;
  stem: string;
  branch: string;
  is_current: boolean;
}

/**
 * 八字排盘引擎类
 */
export class BaziEngine {
  /**
   * 执行八字排盘
   */
  static calculate(input: BaziInput): BaziChart {
    const { birth_date, birth_time, gender, longitude } = input;

    // 解析日期时间
    const [year, month, day] = birth_date.split('-').map(Number);
    const [hour, minute] = (birth_time || '12:00').split(':').map(Number);

    // 从公历创建 Solar 对象
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    
    // 转换为农历（自动处理节气）
    const lunar = solar.getLunar();
    
    // 获取八字
    const eightChar = lunar.getEightChar();

    // 获取四柱
    const yearGan = eightChar.getYearGan();
    const yearZhi = eightChar.getYearZhi();
    const monthGan = eightChar.getMonthGan();
    const monthZhi = eightChar.getMonthZhi();
    const dayGan = eightChar.getDayGan();
    const dayZhi = eightChar.getDayZhi();
    const hourGan = eightChar.getTimeGan();
    const hourZhi = eightChar.getTimeZhi();

    // 日主
    const dayMaster = dayGan;
    const dayMasterElement = WU_XING[dayMaster] || '';

    // 构建四柱信息
    const yearPillar = this.buildPillarInfo(yearGan, yearZhi, dayMaster, eightChar.getYearXun());
    const monthPillar = this.buildPillarInfo(monthGan, monthZhi, dayMaster, eightChar.getMonthXun());
    const dayPillar = this.buildPillarInfo(dayGan, dayZhi, dayMaster, eightChar.getDayXun());
    const hourPillar = this.buildPillarInfo(hourGan, hourZhi, dayMaster, eightChar.getTimeXun());

    // 完整八字
    const completeChart = `${yearGan}${yearZhi} ${monthGan}${monthZhi} ${dayGan}${dayZhi} ${hourGan}${hourZhi}`;

    // 节气信息
    const jieQi = lunar.getJieQi();
    const currentJieQi = lunar.getCurrentJieQi();
    const nextJieQi = lunar.getNextJieQi();

    // 真太阳时校正
    let trueSolarTime: { local_time: string; true_time: string; adjustment_minutes: number } | undefined = undefined;
    if (longitude !== undefined) {
      // 使用经度计算真太阳时
      const trueSolarMinutes = this.calculateTrueSolarTime(year, month, day, hour, minute, longitude);
      trueSolarTime = {
        local_time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        true_time: this.minutesToTime(trueSolarMinutes),
        adjustment_minutes: Math.round(trueSolarMinutes - (hour * 60 + minute))
      };
    }

    // 农历信息
    const lunarInfo = {
      lunar_date: lunar.toString(),
      lunar_year: lunar.getYear(),
      lunar_month: lunar.getMonth(),
      lunar_day: lunar.getDay(),
      is_leap: lunar.getMonth() < 0,
      zodiac: lunar.getYearShengXiao()
    };

    return {
      year_pillar: yearPillar,
      month_pillar: monthPillar,
      day_pillar: dayPillar,
      hour_pillar: hourPillar,
      day_master: dayMaster,
      day_master_element: dayMasterElement,
      complete_chart: completeChart,
      solar_term_info: {
        current_term: jieQi || (currentJieQi ? currentJieQi.getName() : ''),
        next_term: nextJieQi ? nextJieQi.getName() : '',
        next_term_date: nextJieQi ? nextJieQi.getSolar().toString() : ''
      },
      true_solar_time: trueSolarTime,
      lunar_info: lunarInfo
    };
  }

  /**
   * 构建柱信息
   */
  private static buildPillarInfo(
    stem: string, 
    branch: string, 
    dayMaster: string,
    xun?: string
  ): PillarInfo {
    const element = WU_XING[stem] || '';
    const hiddenStems = CANG_GAN[branch] || [];
    const tenGod = SHI_SHEN[dayMaster]?.[stem] || '';

    return {
      stem,
      branch,
      element,
      hidden_stems: hiddenStems,
      ten_god: tenGod,
      nayin: this.getNaYin(stem, branch)
    };
  }

  /**
   * 获取纳音
   */
  private static getNaYin(stem: string, branch: string): string {
    const naYinMap: Record<string, string> = {
      '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
      '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
      '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
      '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
      '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
      '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
      '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
      '壬辰': '长流水', '癸巳': '长流水', '甲午': '砂中金', '乙未': '砂中金',
      '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
      '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
      '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
      '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
      '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
      '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
      '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
    };
    return naYinMap[stem + branch] || '';
  }

  /**
   * 计算真太阳时（基于经度）
   * 真太阳时 = 地方平太阳时 + 时差
   */
  private static calculateTrueSolarTime(
    year: number, 
    month: number, 
    day: number, 
    hour: number, 
    minute: number,
    longitude: number
  ): number {
    // 地方平太阳时 = 北京时间 + (经度 - 120°) × 4分钟/度
    const localMeanTime = hour * 60 + minute + (longitude - 120) * 4;
    
    // 时差计算（简化版，实际需要更复杂的天文计算）
    // 这里使用近似公式
    const dayOfYear = this.getDayOfYear(year, month, day);
    const B = 2 * Math.PI * (dayOfYear - 81) / 365;
    const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    
    // 真太阳时
    return localMeanTime + EoT;
  }

  /**
   * 获取一年中的第几天
   */
  private static getDayOfYear(year: number, month: number, day: number): number {
    const date = new Date(year, month - 1, day);
    const start = new Date(year, 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * 分钟转时间字符串
   */
  private static minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60) % 24;
    const m = Math.floor(minutes % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  /**
   * 计算大运
   */
  static calculateDayun(
    birth_date: string,
    gender: 'male' | 'female' | '男' | '女',
    currentAge?: number
  ): DayunInfo[] {
    const [year, month, day] = birth_date.split('-').map(Number);
    const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
    const lunar = solar.getLunar();
    const eightChar = lunar.getEightChar();

    // 获取大运
    const yun = eightChar.getYun(
      gender === 'male' || gender === '男' ? 1 : 0
    );
    const daYun = yun.getDaYun();

    const result: DayunInfo[] = [];
    
    for (let i = 0; i < daYun.length; i++) {
      const dy = daYun[i];
      const startAge = dy.getStartAge();
      const endAge = dy.getEndAge();
      const ganZhi = dy.getGanZhi();
      
      result.push({
        start_age: startAge,
        end_age: endAge,
        ganzhi: ganZhi,
        stem: ganZhi ? ganZhi[0] : '',
        branch: ganZhi ? ganZhi[1] : '',
        is_current: currentAge !== undefined ? 
          (currentAge >= startAge && currentAge <= endAge) : 
          (i === 0)
      });
    }

    return result;
  }

  /**
   * 计算五行分布
   */
  static calculateWuxingDistribution(chart: BaziChart): Record<string, number> {
    const elements = ['木', '火', '土', '金', '水'];

    // 初始化计数
    const count: Record<string, number> = {'木': 0, '火': 0, '土': 0, '金': 0, '水': 0};
    
    // 统计天干
    [chart.year_pillar, chart.month_pillar, chart.day_pillar, chart.hour_pillar].forEach(pillar => {
      const stemElement = WU_XING[pillar.stem];
      if (stemElement) count[stemElement]++;
      
      const branchElement = WU_XING[pillar.branch];
      if (branchElement) count[branchElement]++;
      
      // 藏干也计入
      pillar.hidden_stems.forEach(hs => {
        const hiddenElement = WU_XING[hs];
        if (hiddenElement) count[hiddenElement] += 0.5; // 藏干权重减半
      });
    });

    // 转换为整数
    Object.keys(count).forEach(key => {
      count[key] = Math.round(count[key] * 10) / 10;
    });

    return count;
  }

  /**
   * 获取神煞
   */
  static getShensha(chart: BaziChart, birthDate: string): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    // 使用 lunar-javascript 获取神煞
    const { year_pillar, month_pillar, day_pillar, hour_pillar } = chart;

    // 解析出生日期
    const [year, month, day] = birthDate.split('-').map(Number);

    // 重建八字对象以获取神煞（使用出生日期而非当前日期）
    const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
    const lunar = solar.getLunar();
    const eightChar = lunar.getEightChar();

    // 注意：lunar-javascript 库目前不提供 getTianDe() 等方法
    // 以下代码为预留接口，待库更新或自行实现后启用
    // const tianDe = eightChar.getTianDe?.();
    // const yueDe = eightChar.getYueDe?.();
    // if (tianDe) result['天德'] = [tianDe];
    // if (yueDe) result['月德'] = [yueDe];

    // 基于干支自行计算常用的神煞
    const tianDe = this.calculateTianDe(month_pillar.branch);
    const yueDe = this.calculateYueDe(month_pillar.branch);
    const taoHua = this.calculateTaoHua(year_pillar.branch);

    if (tianDe) result['天德'] = tianDe;
    if (yueDe) result['月德'] = yueDe;
    if (taoHua) result['桃花'] = taoHua;

    return result;
  }

  /**
   * 计算天德贵人（基于月支，返回天干）
   * 口诀：寅丁卯申辰壬巳辛，午亥未甲申癸酉寅，戌丙亥乙子巳丑庚
   */
  private static calculateTianDe(monthBranch: string): string[] | null {
    const tianDeTable: Record<string, string> = {
      '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛',
      '午': '亥', '未': '甲', '申': '癸', '酉': '寅',
      '戌': '丙', '亥': '乙', '子': '巳', '丑': '庚'
    };
    const tianDeGan = tianDeTable[monthBranch];
    return tianDeGan ? [tianDeGan] : null;
  }

  /**
   * 计算月德贵人（基于月支，返回天干）
   * 口诀：寅午戌月丙，申子辰月壬，亥卯未月甲，巳酉丑月庚
   */
  private static calculateYueDe(monthBranch: string): string[] | null {
    const yueDeTable: Record<string, string> = {
      '寅': '丙', '午': '丙', '戌': '丙',
      '申': '壬', '子': '壬', '辰': '壬',
      '亥': '甲', '卯': '甲', '未': '甲',
      '巳': '庚', '酉': '庚', '丑': '庚'
    };
    const yueDeGan = yueDeTable[monthBranch];
    return yueDeGan ? [yueDeGan] : null;
  }

  /**
   * 计算桃花/咸池（基于年支，返回地支）
   * 口诀：申子辰见酉，寅午戌见卯，巳酉丑见午，亥卯未见子
   */
  private static calculateTaoHua(yearBranch: string): string[] | null {
    const taoHuaTable: Record<string, string> = {
      '申': '酉', '子': '酉', '辰': '酉',
      '寅': '卯', '午': '卯', '戌': '卯',
      '巳': '午', '酉': '午', '丑': '午',
      '亥': '子', '卯': '子', '未': '子'
    };
    const taoHuaBranch = taoHuaTable[yearBranch];
    return taoHuaBranch ? [taoHuaBranch] : null;
  }
}

/**
 * 历史名人八字验证测试
 * 用于验证八字排盘算法的准确性
 */
export function validateFamousCases(): Array<{
  name: string;
  birth_date: string;
  birth_time: string;
  expected: {
    year: string;
    month: string;
    day: string;
    hour?: string;
  };
  actual: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  passed: boolean;
  mismatch: string[];
}> {
  const testCases = [
    {
      name: '毛泽东',
      birth_date: '1893-12-26',
      birth_time: '07:30',
      gender: 'male' as const,
      expected: {
        year: '癸巳',
        month: '甲子',
        day: '丁酉',
        hour: '甲辰'
      }
    },
    {
      name: '邓小平',
      birth_date: '1904-08-22',
      birth_time: '12:00',
      gender: 'male' as const,
      expected: {
        year: '甲辰',
        month: '甲申',
        day: '辛卯'
      }
    },
    {
      name: '马云',
      birth_date: '1964-09-10',
      birth_time: '12:00',
      gender: 'male' as const,
      expected: {
        year: '甲辰',
        month: '丁酉',
        day: '庚辰'
      }
    }
  ];

  return testCases.map((testCase) => {
    try {
      const chart = BaziEngine.calculate({
        birth_date: testCase.birth_date,
        birth_time: testCase.birth_time,
        gender: testCase.gender,
        name: testCase.name
      });

      const actual = {
        year: chart.year_pillar.stem + chart.year_pillar.branch,
        month: chart.month_pillar.stem + chart.month_pillar.branch,
        day: chart.day_pillar.stem + chart.day_pillar.branch,
        hour: chart.hour_pillar.stem + chart.hour_pillar.branch
      };

      const mismatch: string[] = [];

      if (actual.year !== testCase.expected.year) {
        mismatch.push(`年柱不符: 预期${testCase.expected.year}, 实际${actual.year}`);
      }
      if (actual.month !== testCase.expected.month) {
        mismatch.push(`月柱不符: 预期${testCase.expected.month}, 实际${actual.month}`);
      }
      if (actual.day !== testCase.expected.day) {
        mismatch.push(`日柱不符: 预期${testCase.expected.day}, 实际${actual.day}`);
      }
      if (testCase.expected.hour && actual.hour !== testCase.expected.hour) {
        mismatch.push(`时柱不符: 预期${testCase.expected.hour}, 实际${actual.hour}`);
      }

      return {
        name: testCase.name,
        birth_date: testCase.birth_date,
        birth_time: testCase.birth_time,
        expected: testCase.expected,
        actual,
        passed: mismatch.length === 0,
        mismatch
      };
    } catch (error) {
      return {
        name: testCase.name,
        birth_date: testCase.birth_date,
        birth_time: testCase.birth_time,
        expected: testCase.expected,
        actual: {
          year: 'ERROR',
          month: 'ERROR',
          day: 'ERROR',
          hour: 'ERROR'
        },
        passed: false,
        mismatch: [`计算错误: ${error instanceof Error ? error.message : '未知错误'}`]
      };
    }
  });
}

export default BaziEngine;
