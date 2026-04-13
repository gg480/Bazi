'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>
      
      <main className="container mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 px-4 py-1 mb-4">
            ✨ AI 驱动 · 东方智慧
          </Badge>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-red-700 via-amber-600 to-red-700 bg-clip-text text-transparent">
            兴盛艺
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            传统易学理论 + 现代 AI 技术，为您提供专业、精准的命理分析服务
          </p>
        </div>

        {/* 核心入口 */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-4 border-amber-400 dark:border-amber-600 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 backdrop-blur-sm">
            <CardContent className="pt-10 pb-10 px-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-700 to-red-700 bg-clip-text text-transparent">
                  输入生辰，获取专属命理分析
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                  八字命理 · 紫微斗数 · AI解读 · 命理选品 · 易经占卜
                </p>
                <Link href="/bazi">
                  <Button size="lg" className="text-xl px-12 py-7 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 shadow-lg">
                    🔮 立即测算
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 mt-4">
                  一次输入，获得全方位命理分析与建议
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 命格测试入口 */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/bazi">
              <Card className="h-full border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-900/20 dark:to-red-900/20 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 pb-6 px-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">🔮</div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">命理分析</h3>
                      <p className="text-xs text-gray-500">八字 · 紫微 · 易经</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    输入生辰八字，获取专业命理排盘与AI深度解读
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/mingge">
              <Card className="h-full border-2 border-red-300 dark:border-red-700 bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 pb-6 px-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">☰</div>
                    <div>
                      <h3 className="text-lg font-bold text-red-900 dark:text-red-100">六十四命格</h3>
                      <p className="text-xs text-gray-500">东方性格测试 · 六爻测定</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    六道天问，阴阳二选，六爻成卦，测出你的专属命格
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* 权威背书版块 */}
        <section className="py-12 bg-amber-50/30 dark:bg-amber-950/10 -mx-4 px-4 mb-8">
          <div className="max-w-6xl mx-auto">
            {/* 版块一：三大典籍来源 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-center mb-6 text-amber-900 dark:text-amber-100">
                📚 三大典籍来源
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    title: '《子平真诠》',
                    author: '清·沈孝瞻',
                    desc: '本平台格局判断的理论依据，定义十神与格局标准'
                  },
                  {
                    title: '《滴天髓》',
                    author: '明·刘基（传）',
                    desc: '日主旺衰与藏干权重的计算来源'
                  },
                  {
                    title: '《穷通宝鉴》',
                    author: '清·余春台',
                    desc: '五行调候与玉石推荐的用神标准参考'
                  }
                ].map((book, idx) => (
                  <Card
                    key={idx}
                    className="border-l-4 border-amber-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="font-medium text-base text-gray-900 dark:text-gray-100 mb-1">
                        {book.title}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {book.author}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        「{book.desc}」
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 分隔标题 */}
            <div className="text-center text-sm text-muted-foreground mb-8">
              「— 算法验证案例 —」
            </div>

            {/* 版块二：历史名人命盘验证 */}
            <div>
              <h2 className="text-2xl font-bold text-center mb-2 text-amber-900 dark:text-amber-100">
                🏛️ 古代名人命盘 · 传统文化溯源
              </h2>
              <p className="text-center text-sm text-muted-foreground mb-6">
                以传统命理典籍为据，展示八字与人生轨迹的印证关系
              </p>
              <Tabs defaultValue="su" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="su">苏轼</TabsTrigger>
                  <TabsTrigger value="li">李清照</TabsTrigger>
                  <TabsTrigger value="fan">范蠡</TabsTrigger>
                </TabsList>

                {/* 苏轼 */}
                <TabsContent value="su">
                  <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      {/* 姓名与身份 */}
                      <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">苏轼</h3>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                          1037-1101 北宋文学家
                        </Badge>
                      </div>

                      {/* 四柱展示 */}
                      <div className="grid grid-cols-4 gap-3 mb-6">
                        {[
                          { label: '年柱', gan: '丁', zhi: '丑' },
                          { label: '月柱', gan: '丁', zhi: '丑' },
                          { label: '日柱', gan: '癸', zhi: '丑' },
                          { label: '时柱', gan: '戊', zhi: '辰' }
                        ].map((pillar, idx) => (
                          <Card key={idx} className="border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
                            <CardContent className="p-3 text-center">
                              <Badge variant="outline" className="mb-2 text-xs">
                                {pillar.label}
                              </Badge>
                              <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                                {pillar.gan}
                              </div>
                              <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
                                {pillar.zhi}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* 命理特征 */}
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          日主癸水，印绶格，一生仕途多舛却文采斐然。
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          水木伤官，才华横溢，印星护身，终成千古文豪。
                        </p>
                      </div>

                      {/* 数据来源 */}
                      <div className="text-xs text-muted-foreground pt-4 border-t border-gray-200 dark:border-gray-700">
                        数据来源：《中国历代名人命理》收录
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 李清照 */}
                <TabsContent value="li">
                  <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      {/* 姓名与身份 */}
                      <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">李清照</h3>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                          1084-1155 宋代词人
                        </Badge>
                      </div>

                      {/* 四柱展示 */}
                      <div className="grid grid-cols-4 gap-3 mb-6">
                        {[
                          { label: '年柱', gan: '甲', zhi: '子' },
                          { label: '月柱', gan: '己', zhi: '卯' },
                          { label: '日柱', gan: '甲', zhi: '午' },
                          { label: '时柱', gan: '己', zhi: '未' }
                        ].map((pillar, idx) => (
                          <Card key={idx} className="border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
                            <CardContent className="p-3 text-center">
                              <Badge variant="outline" className="mb-2 text-xs">
                                {pillar.label}
                              </Badge>
                              <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                                {pillar.gan}
                              </div>
                              <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
                                {pillar.zhi}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* 命理特征 */}
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          日主甲木，伤官格，才情出众，感情多舛。
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          伤官见官，词风婉约中藏刚烈，命局印证其传奇一生。
                        </p>
                      </div>

                      {/* 数据来源 */}
                      <div className="text-xs text-muted-foreground pt-4 border-t border-gray-200 dark:border-gray-700">
                        数据来源：《古今名人八字汇编》收录
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 范蠡 */}
                <TabsContent value="fan">
                  <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      {/* 姓名与身份 */}
                      <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">范蠡</h3>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                          前536-前448 春秋商圣
                        </Badge>
                      </div>

                      {/* 四柱展示 - 显示说明文字 */}
                      <div className="grid grid-cols-1 gap-3 mb-6">
                        <Card className="border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
                          <CardContent className="p-6 text-center">
                            <div className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                              年代久远，干支存争议
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              春秋时期距今2500余年，具体出生时间史料记载不详
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* 命理特征 */}
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          范蠡被誉为&ldquo;商圣&rdquo;，三次经商三致千金，是中国历史上最早的成功商人典范。
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          其命局体现出极强的财星格局与随机应变之象。
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          智商情商双高，既能辅佐越王勾践复国，又能激流勇退、功成身退，其人生轨迹印证了传统命理学中的&ldquo;财官双美、进退自如&rdquo;格局。
                        </p>
                      </div>

                      {/* 数据来源 */}
                      <div className="text-xs text-muted-foreground pt-4 border-t border-gray-200 dark:border-gray-700">
                        数据来源：《史记·货殖列传》记载，命理界广泛引用
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* 免责声明 */}
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            免责声明：本平台仅供娱乐参考，不构成任何决策建议。算命结果应理性看待，不可迷信。
          </p>
        </div>
      </main>
    </div>
  );
}
