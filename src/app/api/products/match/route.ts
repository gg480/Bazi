import { NextRequest, NextResponse } from 'next/server';

// 五行与玉石映射知识库
const WUXING_JADE_MAPPING = {
  '木': {
    colors: ['绿色', '青色'],
    items: [
      { category: '翡翠（阳绿、黄阳绿）', reason: '翡翠属木，色泽青翠，可补木气助运', priority: 'first' },
      { category: '碧玉', reason: '碧玉色绿质润，木气充沛，适合缺木之人', priority: 'second' },
      { category: '绿玛瑙', reason: '绿色玛瑙清新自然，木气温和', priority: 'third' },
      { category: '绿发晶', reason: '发晶能量强劲，绿色对应木行', priority: 'third' }
    ],
    avoid: ['墨翠', '黑曜石'],
    avoidReason: '深色水系玉石可能泄耗木气'
  },
  '火': {
    colors: ['红色', '紫色', '橙色'],
    items: [
      { category: '南红玛瑙', reason: '南红色红如火，火气旺盛，可增强运势', priority: 'first' },
      { category: '红宝石', reason: '红宝石色泽艳丽，火能量强大', priority: 'second' },
      { category: '紫牙乌（石榴石）', reason: '石榴石紫红相间，火气柔和', priority: 'second' },
      { category: '红珊瑚', reason: '珊瑚生于海而色红，火水相济', priority: 'third' }
    ],
    avoid: ['墨玉', '青金石'],
    avoidReason: '深蓝黑色水系玉石可能克制火气'
  },
  '土': {
    colors: ['黄色', '棕色', '米色'],
    items: [
      { category: '田黄', reason: '田黄色黄质润，土气纯正，最为珍贵', priority: 'first' },
      { category: '黄玉', reason: '黄玉色泽温润，土气厚重', priority: 'first' },
      { category: '虎眼石', reason: '虎眼石金光闪烁，土中带金', priority: 'second' },
      { category: '蜜蜡', reason: '蜜蜡温润如脂，土气温和', priority: 'second' }
    ],
    avoid: ['翡翠', '碧玉'],
    avoidReason: '绿色木系玉石可能克制土气'
  },
  '金': {
    colors: ['白色', '金色', '银色'],
    items: [
      { category: '和田白玉', reason: '白玉温润如脂，金气纯正', priority: 'first' },
      { category: '羊脂玉', reason: '羊脂玉质地细腻，金气充沛', priority: 'first' },
      { category: '白水晶', reason: '白水晶清澈通透，金气明亮', priority: 'second' },
      { category: '黄金饰品', reason: '黄金为金之本源，能量最强', priority: 'third' }
    ],
    avoid: ['红宝石', '南红'],
    avoidReason: '红色火系玉石可能克制金气'
  },
  '水': {
    colors: ['黑色', '蓝色', '深灰色'],
    items: [
      { category: '墨翠', reason: '墨翠色黑如墨，水气深厚', priority: 'first' },
      { category: '青金石', reason: '青金石深蓝如海，水气充沛', priority: 'first' },
      { category: '黑玛瑙', reason: '黑玛瑙色泽深沉，水气内敛', priority: 'second' },
      { category: '海蓝宝', reason: '海蓝宝如海水般清澈', priority: 'second' }
    ],
    avoid: ['黄玉', '田黄'],
    avoidReason: '黄色土系玉石可能克制水气'
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { yongShen = [], dayMasterElement } = body;

    // 确定主要推荐的五行
    let primaryElement = dayMasterElement || '木';
    
    // 如果有用神，优先使用用神
    if (yongShen && yongShen.length > 0) {
      primaryElement = yongShen[0];
    }

    const mapping = WUXING_JADE_MAPPING[primaryElement as keyof typeof WUXING_JADE_MAPPING];
    
    if (!mapping) {
      return NextResponse.json({
        success: false,
        error: '未找到对应的五行映射'
      });
    }

    // 构建推荐结果
    const recommended = mapping.items.map(item => ({
      category: item.category,
      reason: `日主${dayMasterElement || primaryElement}${yongShen && yongShen.length > 0 ? '，用神为' + yongShen.join('、') : ''}。${item.reason}`,
      priority: item.priority
    }));

    // 构建忌讳物品
    const avoid = mapping.avoid.map(item => ({
      category: item,
      reason: mapping.avoidReason
    }));

    // 五行调候建议
    const stylingTip = `建议佩戴${mapping.colors.join('或')}的饰品，可增强${primaryElement}气。` +
      `${primaryElement === '木' || primaryElement === '火' ? '建议佩戴于左手腕，配合木质手串效果更佳。' : ''}` +
      `${primaryElement === '金' || primaryElement === '水' ? '建议佩戴于右手腕，配合银饰效果更佳。' : ''}` +
      `${primaryElement === '土' ? '建议佩戴于手腕或颈部，配合黄色系服饰效果更佳。' : ''}`;

    return NextResponse.json({
      success: true,
      data: {
        primary_element: primaryElement,
        recommended_colors: mapping.colors,
        recommended,
        avoid,
        styling_tip: stylingTip,
        wuxing_mapping: {
          木: ['翡翠', '碧玉', '绿玛瑙', '绿发晶'],
          火: ['南红玛瑙', '红宝石', '紫牙乌', '红珊瑚'],
          土: ['田黄', '黄玉', '虎眼石', '蜜蜡'],
          金: ['和田白玉', '羊脂玉', '白水晶', '黄金'],
          水: ['墨翠', '青金石', '黑玛瑙', '海蓝宝']
        }
      }
    });

  } catch (error) {
    console.error('命理选品推荐错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '推荐生成失败' },
      { status: 500 }
    );
  }
}
