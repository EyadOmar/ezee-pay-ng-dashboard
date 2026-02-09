import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePicker } from 'primeng/datepicker';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Toolbar } from 'primeng/toolbar';
import { Tooltip } from 'primeng/tooltip';
import { LanguageService } from '../../../core/services/language.service';
import { Category, PRICING_METHODS, SALES_STRATEGIES } from '../../../core/models';
import { MOCK_CATEGORIES } from './mock-categories';
import { CategoryFormDialog } from './category-form-dialog';
import { CategoryDetailDialog } from './category-detail-dialog';

@Component({
  selector: 'app-stock-categories',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    TranslocoDirective,
    Button,
    ConfirmDialog,
    DatePicker,
    IconField,
    InputIcon,
    InputText,
    Select,
    TableModule,
    Tag,
    Toolbar,
    Tooltip,
    CategoryFormDialog,
    CategoryDetailDialog,
  ],
  providers: [ConfirmationService],
  templateUrl: './stock-categories.html',
})
export default class StockCategories {
  private readonly langService = inject(LanguageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly transloco = inject(TranslocoService);

  readonly isAr = computed(() => this.langService.currentLang() === 'ar');
  readonly categories = signal<Category[]>([...MOCK_CATEGORIES]);

  readonly parentCategories = computed(() =>
    this.categories().filter((c) => c.parentId === null),
  );

  readonly pricingMethods = PRICING_METHODS;
  readonly salesStrategies = SALES_STRATEGIES;

  // Filter form
  readonly filterForm = new FormGroup({
    searchTerm: new FormControl('', { nonNullable: true }),
    parentFilter: new FormControl<string | null>(null),
    dateFrom: new FormControl<Date | null>(null),
    dateTo: new FormControl<Date | null>(null),
  });

  // Build hierarchical view: parent rows with children nested
  readonly displayCategories = computed(() => {
    const all = this.categories();
    const filters = this.filterForm.getRawValue();
    const search = filters.searchTerm.toLowerCase().trim();
    const parentFilter = filters.parentFilter;
    const dateFrom = filters.dateFrom;
    const dateTo = filters.dateTo;

    // Get parents
    let parents = all.filter((c) => c.parentId === null);

    // Apply parent filter
    if (parentFilter) {
      parents = parents.filter((p) => p.id === parentFilter);
    }

    // Build parent-child tree
    const result: Category[] = [];
    for (const parent of parents) {
      const children = all.filter((c) => c.parentId === parent.id);

      // Apply search filter
      if (search) {
        const parentMatches =
          parent.nameEn.toLowerCase().includes(search) ||
          parent.nameAr.includes(search);
        const childMatches = children.some(
          (c) => c.nameEn.toLowerCase().includes(search) || c.nameAr.includes(search),
        );
        if (!parentMatches && !childMatches) continue;
      }

      // Apply date filter
      if (dateFrom && parent.createdAt < dateFrom) continue;
      if (dateTo) {
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (parent.createdAt > endOfDay) continue;
      }

      result.push({ ...parent, children });
    }

    return result;
  });

  // Dialog state
  readonly formDialogVisible = signal(false);
  readonly detailDialogVisible = signal(false);
  readonly selectedCategory = signal<Category | null>(null);
  readonly detailParent = signal<Category | null>(null);
  readonly isEditMode = signal(false);

  // Expanded rows for table
  expandedRows: Record<string, boolean> = {};

  constructor() {
    // Re-compute display categories when filters change
    this.filterForm.valueChanges.subscribe(() => {
      // Trigger signal recomputation by touching categories signal
      this.categories.update((c) => [...c]);
    });
  }

  onCreateNew(): void {
    this.selectedCategory.set(null);
    this.isEditMode.set(false);
    this.formDialogVisible.set(true);
  }

  onEdit(category: Category): void {
    this.selectedCategory.set(category);
    this.isEditMode.set(true);
    this.formDialogVisible.set(true);
  }

  onView(category: Category): void {
    this.selectedCategory.set(category);
    const parent = category.parentId
      ? this.categories().find((c) => c.id === category.parentId) ?? null
      : null;
    this.detailParent.set(parent);
    this.detailDialogVisible.set(true);
  }

  onDelete(event: Event, category: Category): void {
    const name = this.isAr() ? category.nameAr : category.nameEn;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.transloco.translate('categories.deleteConfirmHeader'),
      message: this.transloco.translate('categories.deleteConfirmMessage'),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: { severity: 'danger', label: this.transloco.translate('categories.actions.delete') },
      rejectButtonProps: { severity: 'secondary', outlined: true, label: this.transloco.translate('categories.cancel') },
      accept: () => {
        this.categories.update((cats) =>
          cats.filter((c) => c.id !== category.id && c.parentId !== category.id),
        );
      },
    });
  }

  onSave(saved: Category): void {
    this.categories.update((cats) => {
      const idx = cats.findIndex((c) => c.id === saved.id);
      if (idx >= 0) {
        // Update existing
        const updated = [...cats];
        updated[idx] = saved;

        // If this is a parent, cascade pricing/strategy to children
        if (saved.parentId === null) {
          for (let i = 0; i < updated.length; i++) {
            if (updated[i].parentId === saved.id) {
              updated[i] = {
                ...updated[i],
                pricingMethod: saved.pricingMethod,
                salesStrategy: saved.salesStrategy,
                updatedAt: new Date(),
              };
            }
          }
        }
        return updated;
      }
      // New category
      return [...cats, saved];
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
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
