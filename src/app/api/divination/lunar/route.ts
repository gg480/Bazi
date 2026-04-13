import { NextRequest, NextResponse } from 'next/server';
import { Solar } from 'lunar-javascript';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, month, day } = body;

    if (!year || !month || !day) {
      return NextResponse.json({ error: '缺少日期参数' }, { status: 400 });
    }
    
    const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
    const lunar = solar.getLunar();

    // 获取农历日期文本
    const lunarMonthNames = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
    const lunarDayNames = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                           '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                           '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

    const lunarMonth = Math.abs(lunar.getMonth());
    const lunarDay = lunar.getDay();
    const isLeap = lunar.getMonth() < 0;

    // 农历日期文本
    let lunarDateText = '';
    if (lunarDay === 1) {
      // 初一显示月份
      lunarDateText = (isLeap ? '闰' : '') + lunarMonthNames[lunarMonth - 1] + '月';
    } else {
      lunarDateText = lunarDayNames[lunarDay - 1];
    }

    // 获取节气
    const jieQi = lunar.getJieQi();
    const currentJieQi = lunar.getCurrentJieQi();

    // 节日判断
    const festivals = getFestivals(month, day, lunarMonth, lunarDay);

    return NextResponse.json({
      success: true,
      data: {
        solar_date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        lunar_year: lunar.getYear(),
        lunar_month: lunarMonth,
        lunar_day: lunarDay,
        is_leap: isLeap,
        lunar_date_text: lunarDateText,
        lunar_date_full: lunar.toString(),
        zodiac: lunar.getYearShengXiao(),
        solar_term: jieQi || (currentJieQi ? currentJieQi.getName() : ''),
        festival: festivals.solar,
        lunar_festival: festivals.lunar
      }
    });

  } catch (error) {
    console.error('农历转换错误:', error);
    return NextResponse.json(
      { error: '日期转换失败' },
      { status: 500 }
    );
  }
}

// 获取节日
function getFestivals(solarMonth: number, solarDay: number, lunarMonth: number, lunarDay: number): {
  solar: string;
  lunar: string;
} {
  // 公历节日
  const solarFestivals: Record<string, string> = {
    '1-1': '元旦',
    '2-14': '情人节',
    '3-8': '妇女节',
    '3-12': '植树节',
    '4-1': '愚人节',
    '5-1': '劳动节',
    '5-4': '青年节',
    '6-1': '儿童节',
    '7-1': '建党节',
    '8-1': '建军节',
    '9-10': '教师节',
    '10-1': '国庆节',
    '12-25': '圣诞节'
  };

  // 农历节日
  const lunarFestivals: Record<string, string> = {
    '1-1': '春节',
    '1-15': '元宵节',
    '2-2': '龙抬头',
    '5-5': '端午节',
    '7-7': '七夕',
    '7-15': '中元节',
    '8-15': '中秋节',
    '9-9': '重阳节',
    '12-8': '腊八节',
    '12-23': '小年',
    '12-30': '除夕'
  };

  const solarKey = `${solarMonth}-${solarDay}`;
  const lunarKey = `${lunarMonth}-${lunarDay}`;

  return {
    solar: solarFestivals[solarKey] || '',
    lunar: lunarFestivals[lunarKey] || ''
  };
}
