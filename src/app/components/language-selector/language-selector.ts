import { Component, inject } from '@angular/core';
import { Popover } from 'primeng/popover';
import { LanguageService } from '../../core/services/language.service';

interface LangOption {
  label: string;
  value: 'en' | 'ar';
}

@Component({
  selector: 'language-selector',
  imports: [Popover],
  template: `
    <button
      class="size-10 bg-primary relative text-primary-contrast hover:dark:bg-white hover:dark:text-black rounded-full hover:bg-[#222] hover:text-white transition-all duration-300 ease-in-out"
      ariaLabel="Change language"
      (click)="op.toggle($event)"
    >
      <i class="pi pi-globe size-5"></i>
    </button>
    <p-popover #op>
      <div class="flex flex-col min-w-50">
        @for (lang of languages; track lang.value) {
          <button
            class="px-4 py-2 text-start rounded-md hover:bg-primary/10 transition-colors"
            [class.font-bold]="langService.currentLang() === lang.value"
            [class.text-primary]="langService.currentLang() === lang.value"
            (click)="selectLang(lang.value); op.hide()"
          >
            {{ lang.label }}
          </button>
        }
      </div>
    </p-popover>
  `,
})
export default class LanguageSelector {
  readonly langService = inject(LanguageService);

  readonly languages: LangOption[] = [
    { label: 'English', value: 'en' },
    { label: 'العربية', value: 'ar' },
  ];

  selectLang(value: 'en' | 'ar'): void {
    this.langService.setLanguage(value);
  }
}
