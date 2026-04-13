import { NextRequest, NextResponse } from 'next/server';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, direction, method, bazi_data, ziwei_data, personal_info } = body;

    // 输入验证
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json({ error: '问题不能为空' }, { status: 400 });
    }

    if (question.length > 200) {
      return NextResponse.json({ error: '问题长度不能超过200个字符' }, { status: 400 });
    }

    // 动态加载易经分析器
    const YijingAnalyzer = require('@/lib/divination/yijing/yijingAnalyzer.cjs');
    const analyzer = new YijingAnalyzer();

    // 执行易经占卜，传递所有可用数据
    const result = await analyzer.performYijingAnalysis({
      question: question.trim(),
      direction: direction || '未指定',
      divination_method: method || 'plum_blossom',
      bazi_data: bazi_data || null,
      ziwei_data: ziwei_data || null,
      personal_info: personal_info || null
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('易经占卜错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '占卜失败，请稍后重试' },
      { status: 500 }
    );
  }
}
