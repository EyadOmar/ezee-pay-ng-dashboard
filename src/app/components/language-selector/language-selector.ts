import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { LanguageService } from '../../core/services/language.service';

interface LangOption {
  label: string;
  value: 'en' | 'ar';
}

@Component({
  selector: 'language-selector',
  imports: [FormsModule, Select],
  template: `
    <p-select
      [options]="languages"
      [ngModel]="langService.currentLang()"
      (ngModelChange)="langService.setLanguage($event)"
      optionLabel="label"
      optionValue="value"
      class="w-28"
    />
  `,
})
export default class LanguageSelector {
  readonly langService = inject(LanguageService);

  readonly languages: LangOption[] = [
    { label: 'English', value: 'en' },
    { label: 'العربية', value: 'ar' },
  ];
}
