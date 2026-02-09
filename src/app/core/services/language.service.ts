import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { PrimeNG } from 'primeng/config';

const LANG_KEY = 'app_lang';

type SupportedLang = 'en' | 'ar';

const AR_LOCALE = {
  dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  dayNamesShort: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  monthNames: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
  monthNamesShort: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
  today: 'اليوم',
  clear: 'مسح',
  weekHeader: 'أسبوع',
  firstDayOfWeek: 6,
  dateFormat: 'dd/mm/yy',
  accept: 'نعم',
  reject: 'لا',
  emptyMessage: 'لا توجد نتائج',
  emptyFilterMessage: 'لا توجد نتائج',
};

const EN_LOCALE = {
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  today: 'Today',
  clear: 'Clear',
  weekHeader: 'Wk',
  firstDayOfWeek: 0,
  dateFormat: 'mm/dd/yy',
  accept: 'Yes',
  reject: 'No',
  emptyMessage: 'No results found',
  emptyFilterMessage: 'No results found',
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly primeng = inject(PrimeNG);

  readonly currentLang = signal<SupportedLang>(this.getInitialLang());
  readonly currentDir = computed(() => (this.currentLang() === 'ar' ? 'rtl' : 'ltr'));

  constructor() {
    effect(() => {
      const lang = this.currentLang();
      const dir = this.currentDir();

      this.transloco.setActiveLang(lang);

      const html = document.documentElement;
      html.setAttribute('lang', lang);
      html.setAttribute('dir', dir);
      html.style.fontFamily = lang === 'ar' ? "'Rubik', sans-serif" : "'Inter', sans-serif";

      this.primeng.setTranslation(lang === 'ar' ? AR_LOCALE : EN_LOCALE);

      localStorage.setItem(LANG_KEY, lang);
    });
  }

  setLanguage(lang: SupportedLang): void {
    this.currentLang.set(lang);
  }

  private getInitialLang(): SupportedLang {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === 'ar' || stored === 'en') return stored;
    return 'en';
  }
}
