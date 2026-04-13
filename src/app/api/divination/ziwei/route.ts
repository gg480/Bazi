import { NextRequest, NextResponse } from 'next/server';
import { createRequire } from 'module';
import BaziEngine from '@/lib/divination/bazi/baziEngine';

const require = createRequire(import.meta.url);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birth_time, gender, name } = body;
    let { birth_date } = body;

    // 输入验证
    if (!birth_date) {
      return NextResponse.json({ error: '出生日期不能为空' }, { status: 400 });
    }

    if (!gender) {
      return NextResponse.json({ error: '性别不能为空' }, { status: 400 });
    }

    if (!birth_time) {
      return NextResponse.json({ error: '出生时间不能为空' }, { status: 400 });
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

    // 验证时间格式
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(birth_time)) {
      return NextResponse.json({ error: '出生时间格式必须为 HH:MM' }, { status: 400 });
    }

    // 使用 BaziEngine 获取准确的农历信息（基于 lunar-javascript 库）
    const baziChart = BaziEngine.calculate({
      birth_date,
      birth_time: birth_time || '12:00',
      gender: gender as 'male' | 'female',
      name: name || '求测者'
    });

    // 准确的农历信息
    const accurateLunarInfo = {
      lunar_date: baziChart.lunar_info?.lunar_date || '',
      lunar_year: baziChart.lunar_info?.lunar_year || 0,
      lunar_month: baziChart.lunar_info?.lunar_month || 0,
      lunar_day: baziChart.lunar_info?.lunar_day || 0,
      zodiac: baziChart.lunar_info?.zodiac || '',
      ganzhi_year: baziChart.year_pillar.stem + baziChart.year_pillar.branch
    };

    // 动态加载紫微斗数分析器
    const ZiweiAnalyzer = require('@/lib/divination/ziwei/ziweiAnalyzer.cjs');
    const analyzer = new ZiweiAnalyzer();

    // 执行紫微斗数分析，传入准确的农历信息
    const result = await analyzer.performRealZiweiAnalysis({
      birth_date,
      birth_time,
      gender,
      name: name || '求测者',
      accurate_lunar_info: accurateLunarInfo  // 传入准确的农历信息
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('紫微斗数分析错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '分析失败，请稍后重试' },
      { status: 500 }
    );
  }
}
