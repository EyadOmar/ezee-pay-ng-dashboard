import { computed, inject, Injectable, signal } from '@angular/core';
import { Category, PRICING_METHODS, SALES_STRATEGIES } from '../models';
import { LanguageService } from './language.service';
import { MOCK_CATEGORIES } from '../../pages/dashboard/stock-categories/mock-categories';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly langService = inject(LanguageService);

  readonly categories = signal<Category[]>([...MOCK_CATEGORIES]);
  readonly parentCategories = computed(() => this.categories().filter((c) => c.parentId === null));
  readonly isAr = computed(() => this.langService.currentLang() === 'ar');

  getById(id: string): Category | undefined {
    return this.categories().find((c) => c.id === id);
  }

  getParent(category: Category): Category | null {
    if (!category.parentId) return null;
    return this.categories().find((c) => c.id === category.parentId) ?? null;
  }

  save(category: Category): void {
    this.categories.update((cats) => {
      const idx = cats.findIndex((c) => c.id === category.id);
      if (idx >= 0) {
        const updated = [...cats];
        updated[idx] = category;

        // If this is a parent, cascade pricing/strategy to children
        if (category.parentId === null) {
          for (let i = 0; i < updated.length; i++) {
            if (updated[i].parentId === category.id) {
              updated[i] = {
                ...updated[i],
                pricingMethod: category.pricingMethod,
                salesStrategy: category.salesStrategy,
                updatedAt: new Date(),
              };
            }
          }
        }
        return updated;
      }
      return [...cats, category];
    });
  }

  delete(id: string): void {
    this.categories.update((cats) => cats.filter((c) => c.id !== id && c.parentId !== id));
  }

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

  getParentName(parentId: string | null): string {
    if (!parentId) return '—';
    const parent = this.categories().find((c) => c.id === parentId);
    return parent ? (this.isAr() ? parent.nameAr : parent.nameEn) : '—';
  }
}
