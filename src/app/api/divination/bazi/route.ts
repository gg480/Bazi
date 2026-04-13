import { NextRequest, NextResponse } from 'next/server';
import BaziEngine from '@/lib/divination/bazi/baziEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birth_time, gender, name, birth_place, longitude } = body;
    let { birth_date } = body;

    // 输入验证
    if (!birth_date) {
      return NextResponse.json({ error: '出生日期不能为空' }, { status: 400 });
    }

    if (!gender) {
      return NextResponse.json({ error: '性别不能为空' }, { status: 400 });
    }

    // 规范化日期格式：支持 YYYYMMDD 和 YYYY-MM-DD
    birth_date = birth_date.trim();
    if (/^\d{8}$/.test(birth_date)) {
      birth_date = `${birth_date.slice(0, 4)}-${birth_date.slice(4, 6)}-${birth_date.slice(6, 8)}`;
    }

    // 验证日期格式
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birth_date)) {
      return NextResponse.json({ error: '出生日期格式必须为 YYYY-MM-DD 或 YYYYMMDD' }, { status: 400 });
    }

    // 验证时间格式（如果提供）
    if (birth_time) {
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(birth_time)) {
        return NextResponse.json({ error: '出生时间格式必须为 HH:MM' }, { status: 400 });
      }
    }

    // 使用新的排盘引擎
    const chart = BaziEngine.calculate({
      birth_date,
      birth_time: birth_time || '12:00',
      gender: gender as 'male' | 'female',
      name: name || '求测者',
      birth_place,
      longitude: longitude ? parseFloat(longitude) : undefined
    });

    // 计算大运
    const currentYear = new Date().getFullYear();
    const birthYear = parseInt(birth_date.split('-')[0]);
    const currentAge = currentYear - birthYear;
    const dayunSequence = BaziEngine.calculateDayun(birth_date, gender, currentAge);

    // 计算五行分布
    const wuxingDistribution = BaziEngine.calculateWuxingDistribution(chart);

    // 计算神煞
    const shensha = BaziEngine.getShensha(chart, birth_date);

    // 构建返回结果
    const result = {
      analysis_type: 'bazi',
      analysis_date: new Date().toISOString(),
      basic_info: {
        personal_data: {
          name: name || '求测者',
          birth_date,
          birth_time: birth_time || '12:00',
          gender: gender === 'male' || gender === '男' ? '男性' : '女性',
          birth_place: birth_place || '未提供'
        },
        bazi_chart: chart,
        lunar_info: chart.lunar_info ? {
          lunar_date: chart.lunar_info.lunar_date,
          zodiac: chart.lunar_info.zodiac
        } : null
      },
      wuxing_analysis: {
        element_distribution: wuxingDistribution,
        balance_analysis: analyzeWuxingBalance(wuxingDistribution),
        personality_traits: getPersonalityByDayMaster(chart.day_master, chart.day_master_element)
      },
      shensha_analysis: shensha,
      geju_analysis: {
        pattern_type: determinePattern(chart),
        characteristics: getPatternCharacteristics(chart),
        career_path: getCareerAdvice(chart.day_master_element)
      },
      dayun_analysis: {
        current_age: currentAge,
        start_luck_age: dayunSequence[0]?.start_age || 1,
        current_dayun: dayunSequence.find(d => d.is_current) || dayunSequence[0],
        dayun_sequence: dayunSequence.map(d => ({
          period: d.start_age,
          start_age: d.start_age,
          end_age: d.end_age,
          ganzhi: d.ganzhi,
          analysis: getDayunAnalysis(d)
        }))
      },
      solar_term_info: chart.solar_term_info,
      true_solar_time: chart.true_solar_time
    };

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('八字分析错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '分析失败，请稍后重试' },
      { status: 500 }
    );
  }
}

// 分析五行平衡
function analyzeWuxingBalance(distribution: Record<string, number>): string {
  const elements = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
  const [strongest, strongestCount] = elements[0];
  const [weakest, weakestCount] = elements[elements.length - 1];
  
  const ratio = strongestCount / (weakestCount || 0.5);
  
  if (ratio > 3) {
    return `五行${strongest}旺而${weakest}弱，建议加强${weakest}的能量。`;
  } else if (ratio > 2) {
    return `五行${strongest}偏旺，${weakest}稍弱，宜适当补充${weakest}。`;
  } else {
    return '五行相对平衡，格局调和。';
  }
}

// 根据日主判断性格
function getPersonalityByDayMaster(dayMaster: string, element: string): string {
  const personalities: Record<string, string> = {
    '甲': '正直刚毅，有领导才能，仁慈宽厚，富有进取心。',
    '乙': '温和柔顺，善于应变，富有艺术天赋，心思细腻。',
    '丙': '热情奔放，光明磊落，富有感染力，积极向上。',
    '丁': '温和内秀，心思缜密，富有奉献精神，注重细节。',
    '戊': '稳重厚实，诚实守信，胸怀宽广，脚踏实地。',
    '己': '温和谦逊，善于包容，做事细致，有耐心。',
    '庚': '刚毅果断，重义气，富有正义感，直言不讳。',
    '辛': '细腻精致，追求完美，富有艺术气质，外柔内刚。',
    '壬': '聪明睿智，善于变通，胸怀宽广，富有冒险精神。',
    '癸': '温和内敛，心思缜密，富有智慧，善于规划。'
  };
  return personalities[dayMaster] || `${element}性特质明显。`;
}

// 判断格局
function determinePattern(chart: { day_master: string; day_master_element: string; month_pillar: { branch: string } }): string {
  const monthBranch = chart.month_pillar.branch;
  const dayMasterElement = chart.day_master_element;
  
  // 简化的格局判断
  const monthElementMap: Record<string, string> = {
    '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水', '子': '水', '丑': '土'
  };
  
  const monthElement = monthElementMap[monthBranch];
  
  if (monthElement === dayMasterElement) {
    return '建禄格';
  }
  
  // 根据五行生克关系判断
  const elementOrder = ['木', '火', '土', '金', '水'];
  const dayIndex = elementOrder.indexOf(dayMasterElement);
  const monthIndex = elementOrder.indexOf(monthElement);
  
  if ((dayIndex + 1) % 5 === monthIndex) {
    return '伤官格';
  } else if ((monthIndex + 1) % 5 === dayIndex) {
    return '正印格';
  }
  
  return '正格';
}

// 获取格局特点
function getPatternCharacteristics(chart: { day_master: string; day_master_element: string }): string {
  const element = chart.day_master_element;
  const characteristics: Record<string, string> = {
    '木': '仁慈宽厚，有进取心，适合从事教育、医疗、文化等行业。',
    '火': '热情开朗，有领导力，适合从事销售、管理、传媒等行业。',
    '土': '稳重可靠，有包容力，适合从事房地产、建筑、金融等行业。',
    '金': '果断刚毅，有执行力，适合从事法律、金融、技术等行业。',
    '水': '聪慧灵活，有洞察力，适合从事科研、咨询、贸易等行业。'
  };
  return characteristics[element] || '命局独特，宜根据实际情况发展。';
}

// 获取事业建议
function getCareerAdvice(element: string): string {
  const careers: Record<string, string> = {
    '木': '适合从事教育、医疗、文化、艺术、环保等领域。',
    '火': '适合从事销售、管理、传媒、电子、能源等领域。',
    '土': '适合从事房地产、建筑、金融、农业、物流等领域。',
    '金': '适合从事法律、金融、技术、制造、机械等领域。',
    '水': '适合从事科研、咨询、贸易、航运、通信等领域。'
  };
  return careers[element] || '可根据个人兴趣和特长选择发展方向。';
}

// 获取大运分析
function getDayunAnalysis(dayun: { ganzhi: string; stem: string; branch: string }): string {
  return `${dayun.ganzhi}大运，天干${dayun.stem}主事，地支${dayun.branch}为根。`;
}
