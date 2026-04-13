import { NextResponse } from 'next/server';
import BaziEngine from '@/lib/divination/bazi/baziEngine';

export async function GET() {
  const cases = [
    {
      name: '毛泽东',
      input: { birth_date: '1893-12-26', birth_time: '07:30', gender: 'male' as const },
      expected: { year: '癸巳', month: '甲子', day: '丁酉', hour: '甲辰' }
    },
    {
      name: '邓小平',
      input: { birth_date: '1904-08-22', birth_time: '12:00', gender: 'male' as const },
      expected: { year: '甲辰', month: '壬申', day: '戊子' }
    },
    {
      name: '马云',
      input: { birth_date: '1964-09-10', birth_time: '12:00', gender: 'male' as const },
      expected: { year: '甲辰', month: '癸酉', day: '壬戌' }
    }
  ];

  const results = cases.map(c => {
    const chart = BaziEngine.calculate(c.input);
    const actual = {
      year: chart.year_pillar.stem + chart.year_pillar.branch,
      month: chart.month_pillar.stem + chart.month_pillar.branch,
      day: chart.day_pillar.stem + chart.day_pillar.branch,
      hour: chart.hour_pillar?.stem + chart.hour_pillar?.branch
    };
    const mismatch: string[] = [];
    Object.entries(c.expected).forEach(([k, v]) => {
      if (actual[k as keyof typeof actual] !== v)
        mismatch.push(`${k}柱：预期${v}，实际${actual[k as keyof typeof actual]}`);
    });
    return { name: c.name, expected: c.expected, actual, passed: mismatch.length === 0, mismatch };
  });

  return NextResponse.json({ results, summary: `${results.filter(r=>r.passed).length}/${results.length} 通过` });
}
