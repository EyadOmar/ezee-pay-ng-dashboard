import { Component, computed, inject, input, model } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { Dialog } from 'primeng/dialog';
import { Tag } from 'primeng/tag';
import { LanguageService } from '../../../core/services/language.service';
import { Category, PRICING_METHODS, SALES_STRATEGIES } from '../../../core/models';

@Component({
  selector: 'app-category-detail-dialog',
  imports: [DatePipe, TranslocoDirective, Button, Chip, Dialog, Tag],
  templateUrl: './category-detail-dialog.html',
})
export class CategoryDetailDialog {
  private readonly langService = inject(LanguageService);

  readonly visible = model(false);
  readonly category = input<Category | null>(null);
  readonly parentCategory = input<Category | null>(null);

  readonly isAr = computed(() => this.langService.currentLang() === 'ar');

  getPricingLabel(value: string): string {
    const isAr = this.isAr();
    const found = PRICING_METHODS.find((m) => m.value === value);
    return found ? (isAr ? found.labelAr : found.label) : value;
  }

  getSalesLabel(value: string): string {
    const isAr = this.isAr();
    const found = SALES_STRATEGIES.find((s) => s.value === value);
    return found ? (isAr ? found.labelAr : found.label) : value;
  }

  onHide(): void {
    this.visible.set(false);
  }
}
