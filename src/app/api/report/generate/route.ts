import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { baziData, ziweiData } = body;

    if (!baziData) {
      return NextResponse.json({ error: '缺少八字数据' }, { status: 400 });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 构建系统提示词 - 强调必须基于具体数据分析
    const systemPrompt = `你是一位精通子平真诠、滴天髓、穷通宝鉴以及紫微斗数的资深命理大师。你的职责是根据用户的具体八字命盘和紫微斗数命盘，进行精准的个性化分析。

## 核心要求（必须严格遵守）

1. **禁止模板化输出**：你的每一句话都必须与用户的具体八字和紫微命盘挂钩，不能输出通用的套话。
2. **必须引用数据**：在分析中必须明确引用用户八字中的具体天干、地支、五行、十神，以及紫微斗数中的星曜、宫位等元素。
3. **精准对应**：例如，如果用户日主是"丙火"，你必须分析"丙火"的特性，而不是泛泛地说"火"；如果用户命宫有"紫微天机"，你要分析这个组合的具体含义。
4. **具体到个人**：禁止出现"建议在生活中多接触水相关的事物"这类适用于所有人的模板话术。如果用户缺水，要说出为什么缺水、缺水对具体格局的影响、具体补救方法。

## 是否有紫微斗数数据
${ziweiData ? '**有紫微斗数数据 - 请结合分析**' : '**无紫微斗数数据 - 仅基于八字分析**'}

## 分析框架

### 1. 性格特质（200-300字）
必须结合：
- 日主的五行属性（如丙火的热情、壬水的灵动）
- 月令对日主的影响（如寅月木旺火相、申月金旺水相）
- 日支坐支的影响（如坐财、坐官、坐印的不同）
- 十神格局特点（如正官格的稳重、伤官格的才华）

### 2. 事业财运（200-300字）
必须结合：
- 格局类型与用神（如正官格用印、食神生财格）
- 财星的位置和强弱
- 官杀对事业的影响
- 当前大运对事业的作用

### 3. 感情婚姻（200-300字）
必须结合：
- 日支（夫妻宫）的五行和藏干
- 财星（男命）或官星（女命）的状态
- 与感情相关的十神配置

### 4. 健康提示（150-200字）
必须结合：
- 五行旺衰（如木旺克土需注意脾胃）
- 具体缺或旺的五行对应的脏腑

### 5. 五行调候（150-200字）
必须结合：
- 日主的喜用神
- 具体缺失或过旺的五行
- 针对性的颜色、方位、饰品建议（不能是模板化的）

### 6. 大运解读（150-200字）
必须结合：
- 当前大运的干支
- 大运与命局的作用关系
- 对人生各方面的具体影响

请严格按照以下JSON格式输出，不要输出其他任何内容：
{
  "personality": "性格特质分析（必须引用具体八字元素）",
  "career": "事业财运分析（必须引用具体格局和用神）",
  "relationship": "感情婚姻分析（必须引用具体夫妻宫和财官状态）",
  "health": "健康提示（必须结合具体五行旺衰）",
  "wuxing_advice": "五行调候建议（必须是针对个人八字的具体建议）",
  "dayun_summary": "当前大运解读（必须结合大运干支与命局关系）",
  "overall_score": 75
}`;

    // 提取八字关键信息
    const basicInfo = baziData.basic_info || {};
    const baziChart = basicInfo.bazi_chart || {};
    const wuxingAnalysis = baziData.wuxing_analysis || {};
    const gejuAnalysis = baziData.geju_analysis || {};
    const dayunAnalysis = baziData.dayun_analysis || {};
    const lifeGuidance = baziData.life_guidance || {};

    // 构建详细的八字信息
    const yearPillar = baziChart.year_pillar || {};
    const monthPillar = baziChart.month_pillar || {};
    const dayPillar = baziChart.day_pillar || {};
    const hourPillar = baziChart.hour_pillar || {};

    // 构建用户消息 - 包含完整的八字和紫微斗数信息
    let ziweiSection = '';
    if (ziweiData) {
      const ziweiAnalysis = ziweiData.ziwei_analysis || {};
      const starChart = ziweiAnalysis.star_chart || {};
      const palaceDist = starChart.palace_distribution || {};
      
      // 提取命宫信息
      const mingGong = palaceDist['命宫'] || {};
      const caiFuGong = palaceDist['财帛宫'] || {};
      const shiYeGong = palaceDist['事业宫'] || {};
      const fuDeGong = palaceDist['福德宫'] || {};
      
      ziweiSection = `

## 紫微斗数命盘（如有相关分析经验，可结合参考）

### 命宫信息
- 命宫主星：${ziweiAnalysis.ming_gong_stars?.join('、') || (mingGong.stars?.join('、')) || '待分析'}
- 命宫星曜：${mingGong.stars?.join('、') || '无'}
- 命宫强弱：${mingGong.strength || '待分析'}

### 主要宫位星曜
- 财帛宫：${caiFuGong.stars?.join('、') || '无'}（${caiFuGong.strength || ''}）
- 事业宫：${shiYeGong.stars?.join('、') || '无'}（${shiYeGong.strength || ''}）
- 福德宫：${fuDeGong.stars?.join('、') || '无'}（${fuDeGong.strength || ''}）

### 四化飞星
${ziweiAnalysis.si_hua?.hua_lu ? `- 化禄：${typeof ziweiAnalysis.si_hua.hua_lu === 'object' ? (ziweiAnalysis.si_hua.hua_lu as {star: string}).star : ziweiAnalysis.si_hua.hua_lu}` : ''}
${ziweiAnalysis.si_hua?.hua_quan ? `- 化权：${typeof ziweiAnalysis.si_hua.hua_quan === 'object' ? (ziweiAnalysis.si_hua.hua_quan as {star: string}).star : ziweiAnalysis.si_hua.hua_quan}` : ''}
${ziweiAnalysis.si_hua?.hua_ke ? `- 化科：${typeof ziweiAnalysis.si_hua.hua_ke === 'object' ? (ziweiAnalysis.si_hua.hua_ke as {star: string}).star : ziweiAnalysis.si_hua.hua_ke}` : ''}
${ziweiAnalysis.si_hua?.hua_ji ? `- 化忌：${typeof ziweiAnalysis.si_hua.hua_ji === 'object' ? (ziweiAnalysis.si_hua.hua_ji as {star: string}).star : ziweiAnalysis.si_hua.hua_ji}` : ''}

### 五行局
- 五行局类型：${ziweiData.basic_info?.wuxing_ju?.type || ziweiAnalysis.wuxing_ju_info?.type || '待分析'}
- 纳音五行：${ziweiData.basic_info?.wuxing_ju?.nayin || ziweiAnalysis.wuxing_ju_info?.nayin || '待分析'}

**紫微斗数分析要点**：
1. 命宫主星决定先天性格基调
2. 财帛宫主星影响理财观念和财运
3. 事业宫主星显示事业心和事业发展方向
4. 四化飞星影响星曜能量的发挥方向
`;
    } else {
      ziweiSection = `

## 紫微斗数
- 紫微斗数需要准确的出生时间（时分），您当前未提供精确时辰，暂无法进行紫微斗数分析。
`;
    }

    const userMessage = `请根据以下具体八字命盘进行精准分析：

## 基本信息
- 姓名：${basicInfo.personal_data?.name || '求测者'}
- 性别：${basicInfo.personal_data?.gender || '未知'}
- 出生日期：${basicInfo.personal_data?.birth_date || '未知'}
- 出生时间：${basicInfo.personal_data?.birth_time || '未知'}${ziweiData ? '（有精确时辰）' : '（时辰待定）'}

## 八字四柱
- 年柱：${yearPillar.stem || ''}${yearPillar.branch || ''}（${yearPillar.ten_god || ''}，藏干：${(yearPillar.hidden_stems || []).join('、') || '无'}）
- 月柱：${monthPillar.stem || ''}${monthPillar.branch || ''}（${monthPillar.ten_god || ''}，月令提纲，藏干：${(monthPillar.hidden_stems || []).join('、') || '无'}）
- 日柱：${dayPillar.stem || ''}${dayPillar.branch || ''}（日主，日支藏干：${(dayPillar.hidden_stems || []).join('、') || '无'}）
- 时柱：${hourPillar.stem || ''}${hourPillar.branch || ''}（${hourPillar.ten_god || ''}，藏干：${(hourPillar.hidden_stems || []).join('、') || '无'}）

## 日主信息
- 日主：${baziChart.day_master || ''}
- 日主五行：${baziChart.day_master_element || ''}
- 完整八字：${baziChart.complete_chart || ''}

## 五行分析
- 五行分布：${JSON.stringify(wuxingAnalysis.element_distribution || {})}
- 五行平衡：${wuxingAnalysis.balance_analysis || ''}
- 性格特质：${wuxingAnalysis.personality_traits || ''}

## 格局判定
- 格局类型：${gejuAnalysis.pattern_type || ''}
- 格局强度：${gejuAnalysis.pattern_strength || ''}
- 格局特点：${gejuAnalysis.characteristics || ''}
- 适宜职业：${gejuAnalysis.career_path || ''}

## 大运信息
- 当前年龄：${dayunAnalysis.current_age || 0}岁
- 起运年龄：${dayunAnalysis.start_luck_age || 0}岁
- 当前大运：${dayunAnalysis.current_dayun?.ganzhi || ''}
- 大运分析：${dayunAnalysis.dayun_influence || ''}

## 人生指导（供参考，但请用自己的语言重新分析）
- 事业发展：${lifeGuidance.career_development || ''}
- 财富管理：${lifeGuidance.wealth_management || ''}
- 婚姻感情：${lifeGuidance.marriage_relationships || ''}
- 健康养生：${lifeGuidance.health_wellness || ''}${ziweiSection}

**重要提醒**：
1. 请务必根据以上具体八字数据进行分析，每一句话都要有依据
2. 分析中要明确引用具体的天干地支、五行、十神
3. ${ziweiData ? '如果有紫微斗数数据，请适当结合分析' : '由于无紫微斗数数据，请专注于八字命理分析'}
4. 禁止输出通用模板，如"建议多接触水相关事物"这类套话
5. 必须给出针对此八字的个性化建议`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userMessage }
    ];

    // 使用流式输出
    const stream = client.stream(messages, {
      model: 'doubao-seed-2-0-lite-260215',
      temperature: 0.7
    });

    // 收集完整响应
    let fullContent = '';
    for await (const chunk of stream) {
      if (chunk.content) {
        fullContent += chunk.content.toString();
      }
    }

    // 尝试解析 JSON
    try {
      // 移除可能的 markdown 代码块标记
      let jsonStr = fullContent.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7);
      }
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
      }
      jsonStr = jsonStr.trim();

      const report = JSON.parse(jsonStr);
      return NextResponse.json({
        success: true,
        data: report
      });
    } catch (parseError) {
      console.error('JSON 解析错误:', parseError);
      // 如果解析失败，返回原始文本
      return NextResponse.json({
        success: true,
        data: {
          personality: 'AI 解析完成，但格式有误，请重新生成',
          career: fullContent.substring(0, 500),
          relationship: '',
          health: '',
          wuxing_advice: '',
          dayun_summary: '',
          overall_score: 70,
          raw_content: fullContent
        }
      });
    }

  } catch (error) {
    console.error('AI 报告生成错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI 报告生成失败' },
      { status: 500 }
    );
  }
}
