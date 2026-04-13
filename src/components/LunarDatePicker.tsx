'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface LunarDatePickerProps {
  value: string; // 格式: YYYY-MM-DD
  onChange: (date: string) => void;
  placeholder?: string;
}

interface CalendarDay {
  solarDate: number;
  lunarDate: string;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  solarTerm?: string;
  festival?: string;
  lunarYear?: number;
  lunarMonth?: number;
  lunarDay?: number;
}

export default function LunarDatePicker({ value, onChange, placeholder = '选择日期' }: LunarDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState(value);
  const [lunarDateText, setLunarDateText] = useState('');

  // 农历数据（简化版，实际应该从后端获取）
  const lunarMonthNames = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
  const lunarDayNames = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                         '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                         '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

  // 节气数据
  const solarTerms = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
                      '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑',
                      '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];

  // 获取农历日期（调用后端API）
  const getLunarDate = async (date: Date): Promise<{
    lunarDate: string;
    lunarYear?: number;
    lunarMonth?: number;
    lunarDay?: number;
    solarTerm?: string;
    festival?: string;
  }> => {
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      const response = await fetch('/api/divination/lunar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, month, day })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return {
            lunarDate: data.data.lunar_date_text || '',
            lunarYear: data.data.lunar_year,
            lunarMonth: data.data.lunar_month,
            lunarDay: data.data.lunar_day,
            solarTerm: data.data.solar_term,
            festival: data.data.festival
          };
        }
      }
    } catch (error) {
      console.error('获取农历日期失败:', error);
    }

    // 如果API调用失败，返回简化的显示
    return { lunarDate: '' };
  };

  // 生成日历数据
  const generateCalendar = useCallback(async () => {
    const days: CalendarDay[] = [];
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    const startDay = firstDay.getDay() || 7; // 周日转为7

    // 上个月的最后几天
    const prevMonth = new Date(currentYear, currentMonth - 1, 0);
    for (let i = startDay - 1; i > 0; i--) {
      const day = prevMonth.getDate() - i + 1;
      const date = new Date(currentYear, currentMonth - 2, day);
      const lunarInfo = await getLunarDate(date);
      days.push({
        solarDate: day,
        lunarDate: lunarInfo.lunarDate,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        lunarYear: lunarInfo.lunarYear,
        lunarMonth: lunarInfo.lunarMonth,
        lunarDay: lunarInfo.lunarDay
      });
    }

    // 当前月的天数
    const today = new Date();
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth - 1, day);
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const lunarInfo = await getLunarDate(date);

      days.push({
        solarDate: day,
        lunarDate: lunarInfo.lunarDate,
        isCurrentMonth: true,
        isSelected: dateStr === selectedDate,
        isToday: date.toDateString() === today.toDateString(),
        solarTerm: lunarInfo.solarTerm,
        festival: lunarInfo.festival,
        lunarYear: lunarInfo.lunarYear,
        lunarMonth: lunarInfo.lunarMonth,
        lunarDay: lunarInfo.lunarDay
      });
    }

    // 下个月的前几天（补满6行）
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const lunarInfo = await getLunarDate(date);
      days.push({
        solarDate: day,
        lunarDate: lunarInfo.lunarDate,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        lunarYear: lunarInfo.lunarYear,
        lunarMonth: lunarInfo.lunarMonth,
        lunarDay: lunarInfo.lunarDay
      });
    }

    setCalendarData(days);
  }, [currentYear, currentMonth, selectedDate]);

  // 生成日历
  useEffect(() => {
    generateCalendar();
  }, [generateCalendar]);

  // 更新选中日期的农历文本
  useEffect(() => {
    if (selectedDate) {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      getLunarDate(date).then(info => {
        setLunarDateText(info.lunarDate);
      });
    }
  }, [selectedDate]);

  // 选择日期
  const handleSelectDate = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return;

    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day.solarDate).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    onChange(dateStr);
    setIsOpen(false);
  };

  // 上个月
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  // 下个月
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // 上一年
  const handlePrevYear = () => {
    setCurrentYear(prev => prev - 1);
  };

  // 下一年
  const handleNextYear = () => {
    setCurrentYear(prev => prev + 1);
  };

  return (
    <div className="relative">
      {/* 输入框 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="text-gray-900 dark:text-gray-100">
              {selectedDate || placeholder}
            </span>
          </div>
          {lunarDateText && (
            <span className="text-sm text-amber-600 dark:text-amber-400">
              {lunarDateText}
            </span>
          )}
        </div>
      </button>

      {/* 日历面板 */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
          {/* 头部导航 */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevYear}
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
                <ChevronLeft className="w-4 h-4 -ml-2" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevMonth}
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {currentYear}年{currentMonth}月
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextMonth}
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextYear}
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="w-4 h-4" />
                <ChevronRight className="w-4 h-4 -ml-2" />
              </Button>
            </div>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {['一', '二', '三', '四', '五', '六', '日'].map(day => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>

          {/* 日期网格 */}
          <div className="grid grid-cols-7 gap-1 p-2 pt-0">
            {calendarData.map((day, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectDate(day)}
                disabled={!day.isCurrentMonth}
                className={`
                  relative p-1 h-12 text-center rounded-md transition-colors
                  ${day.isCurrentMonth 
                    ? 'hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer' 
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}
                  ${day.isSelected 
                    ? 'bg-gradient-to-br from-amber-500 to-red-500 text-white hover:from-amber-600 hover:to-red-600' 
                    : ''}
                  ${day.isToday && !day.isSelected 
                    ? 'border-2 border-amber-500' 
                    : ''}
                `}
              >
                <div className={`text-sm font-medium ${day.isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                  {day.solarDate}
                </div>
                <div className={`text-xs mt-0.5 ${
                  day.isSelected 
                    ? 'text-white/90' 
                    : day.solarTerm || day.festival 
                      ? 'text-red-500 dark:text-red-400' 
                      : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {day.solarTerm || day.festival || day.lunarDate}
                </div>
              </button>
            ))}
          </div>

          {/* 底部信息 */}
          {selectedDate && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(selectedDate).toLocaleDateString('zh-CN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              {lunarDateText && (
                <div className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  {lunarDateText}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
