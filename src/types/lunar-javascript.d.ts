declare module 'lunar-javascript' {
  export class Solar {
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar;
    toString(): string;
    getLunar(): Lunar;
  }

  export class Lunar {
    getEightChar(): EightChar;
    getJieQi(): string | null;
    getCurrentJieQi(): { getName(): string } | null;
    getNextJieQi(): { getName(): string; getSolar(): Solar } | null;
    getYearShengXiao(): string;
    toString(): string;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
  }

  export class EightChar {
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
    getYearGan(): string;
    getYearZhi(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getTimeGan(): string;
    getTimeZhi(): string;
    getYearXun(): string;
    getMonthXun(): string;
    getDayXun(): string;
    getTimeXun(): string;
    getYun(gender: number): Yun;
    getTianDe(): string | null;
    getYueDe(): string | null;
  }

  export class Yun {
    getDaYun(): DaYun[];
  }

  export class DaYun {
    getStartAge(): number;
    getEndAge(): number;
    getGanZhi(): string;
  }

  export class Luck {
    // Luck class methods
  }
}
