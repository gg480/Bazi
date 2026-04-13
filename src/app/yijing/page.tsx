'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface YijingResult {
  basic_info?: {
    hexagram?: {
      name: string;
      symbol: string;
    };
    changed_hexagram?: {
      name: string;
      symbol: string;
    };
  };
  detailed_analysis?: string | Record<string, string>;
  divination_wisdom?: string;
}

export default function YijingPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<YijingResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/divination/yijing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '占卜失败');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '占卜失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600"></div>
      
      <main className="container mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
            易经占卜
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            梅花易数起卦，为您解答人生疑惑
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 输入表单 */}
          <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">输入您的问题</CardTitle>
              <CardDescription>
                请虔诚地思考您的问题，然后点击占卜按钮
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">您的问题 *</Label>
                  <Input
                    id="question"
                    placeholder="例如：我最近的运势如何？这个项目能否成功？"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="text-base"
                  />
                  <p className="text-xs text-gray-500">
                    请用简洁的语言描述您的问题，建议控制在50字以内
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6 text-lg"
                  disabled={loading || !question.trim()}
                >
                  {loading ? '占卜中...' : '🔮 开始占卜'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 结果展示 */}
          {result && (
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center text-blue-900 dark:text-blue-100">
                  占卜结果
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 基本信息 */}
                  {result.basic_info && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                          本卦
                        </h3>
                        <div className="text-4xl mb-2">{result.basic_info.hexagram?.symbol || '☰'}</div>
                        <p className="font-bold text-blue-700 dark:text-blue-300">
                          {result.basic_info.hexagram?.name || '未知'}
                        </p>
                      </div>
                      {result.basic_info.changed_hexagram && (
                        <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            变卦
                          </h3>
                          <div className="text-4xl mb-2">{result.basic_info.changed_hexagram.symbol}</div>
                          <p className="font-bold text-cyan-700 dark:text-cyan-300">
                            {result.basic_info.changed_hexagram.name}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 详细分析 */}
                  {result.detailed_analysis && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">详细解读</h3>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {typeof result.detailed_analysis === 'string' 
                            ? result.detailed_analysis 
                            : JSON.stringify(result.detailed_analysis, null, 2)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 人生智慧 */}
                  {result.divination_wisdom && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                      <h3 className="font-semibold mb-2">人生智慧</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {result.divination_wisdom}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
