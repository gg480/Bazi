'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ZiweiResult {
  basic_info?: {
    bazi_info?: {
      complete_chart: string;
      day_master: string;
    };
    lunar_info?: {
      lunar_date: string;
    };
  };
  ziwei_analysis?: string | Record<string, string | undefined>;
  detailed_analysis?: string | Record<string, string | undefined>;
}

export default function ZiweiPage() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birth_date: '',
    birth_time: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ZiweiResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/divination/ziwei', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '分析失败');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
      
      <main className="container mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
            紫微斗数
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            根据出生时间排盘，分析十二宫位与人生运势
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* 输入表单 */}
          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-900 dark:text-purple-100">输入出生信息</CardTitle>
              <CardDescription>紫微斗数需要精确的出生时间进行分析</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    placeholder="请输入姓名"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">性别 *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择性别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男</SelectItem>
                      <SelectItem value="female">女</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date">出生日期 *</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_time">出生时间 *</Label>
                  <Input
                    id="birth_time"
                    type="time"
                    value={formData.birth_time}
                    onChange={(e) => setFormData({ ...formData, birth_time: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">紫微斗数需要准确时间来确定命盘</p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6"
                  disabled={loading}
                >
                  {loading ? '排盘中...' : '开始排盘'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 结果展示 */}
          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-900 dark:text-purple-100">命盘结果</CardTitle>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="text-center py-12 text-gray-500">
                  <p>请先填写出生信息并开始排盘</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 基本信息 */}
                  {result.basic_info && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h3 className="font-semibold mb-2">基本信息</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {result.basic_info.bazi_info && (
                          <>
                            <p>八字：{result.basic_info.bazi_info.complete_chart}</p>
                            <p>日主：{result.basic_info.bazi_info.day_master}</p>
                          </>
                        )}
                        {result.basic_info.lunar_info && (
                          <p>农历：{result.basic_info.lunar_info.lunar_date}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 紫微分析 */}
                  {result.ziwei_analysis && (
                    <div className="space-y-3">
                      <h3 className="font-semibold">紫微斗数分析</h3>
                      <div className="prose dark:prose-invert max-w-none text-sm">
                        {typeof result.ziwei_analysis === 'string' ? (
                          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                            {result.ziwei_analysis}
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {Object.entries(result.ziwei_analysis).map(([key, value]) => (
                              <div key={key} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                                <span className="font-semibold text-purple-700 dark:text-purple-300">
                                  {key}：
                                </span>
                                <span className="text-gray-600 dark:text-gray-400 ml-2">
                                  {value || ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 详细分析 */}
                  {result.detailed_analysis && (
                    <div className="space-y-3">
                      <h3 className="font-semibold">详细分析</h3>
                      <div className="prose dark:prose-invert max-w-none text-sm">
                        {typeof result.detailed_analysis === 'string' ? (
                          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                            {result.detailed_analysis}
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {Object.entries(result.detailed_analysis).map(([key, value]) => (
                              <div key={key}>
                                <Badge variant="outline" className="mb-1">
                                  {key}
                                </Badge>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                  {value || ''}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
