import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePicker } from 'primeng/datepicker';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-stock-categories',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    TranslocoDirective,
    Breadcrumb,
    Button,
    ConfirmDialog,
    DatePicker,
    IconField,
    InputIcon,
    InputText,
    TableModule,
    Tag,
    Tooltip,
  ],
  providers: [ConfirmationService],
  templateUrl: './stock-categories.html',
})
export default class StockCategories {
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);
  readonly categoryService = inject(CategoryService);

  readonly isAr = this.categoryService.isAr;
  readonly parentCategories = this.categoryService.parentCategories;

  readonly homeItem = computed<MenuItem>(() => ({
    icon: 'pi pi-home',
    label: this.transloco.translate('nav.overview'),
    routerLink: '/dashboard',
  }));

  readonly breadcrumbItems = computed<MenuItem[]>(() => [
    { label: this.transloco.translate('categories.breadcrumb.list') },
  ]);

  // Trigger signal for reactive filter recomputation
  private readonly filterTrigger = signal(0);

  // Filter form
  readonly filterForm = new FormGroup({
    searchTerm: new FormControl('', { nonNullable: true }),
    parentFilter: new FormControl<string | null>(null),
    dateFrom: new FormControl<Date | null>(null),
    dateTo: new FormControl<Date | null>(null),
  });

  // Flat list: parents first, then children — all in one level
  readonly displayCategories = computed(() => {
    this.filterTrigger();
    let categories = this.categoryService.categories();
    const filters = this.filterForm.getRawValue();
    const search = filters.searchTerm.toLowerCase().trim();
    const parentFilter = filters.parentFilter;
    const dateFrom = filters.dateFrom;
    const dateTo = filters.dateTo;

    // Apply parent filter
    if (parentFilter) {
      categories = categories.filter((c) => c.id === parentFilter || c.parentId === parentFilter);
    }

    // Apply search filter
    if (search) {
      categories = categories.filter(
        (c) => c.nameEn.toLowerCase().includes(search) || c.nameAr.includes(search),
      );
    }

    // Apply date filter
    if (dateFrom) {
      categories = categories.filter((c) => c.createdAt >= dateFrom);
    }
    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      categories = categories.filter((c) => c.createdAt <= endOfDay);
    }

    return categories;
  });

  constructor() {
    // Re-compute display categories when filters change
    this.filterForm.valueChanges.subscribe(() => {
      this.filterTrigger.update((v) => v + 1);
    });
  }

  onCreateNew(): void {
    this.router.navigate(['/stock-categories', 'create']);
  }

  onEdit(category: Category): void {
    this.router.navigate(['/stock-categories', category.id, 'edit']);
  }

  onView(category: Category): void {
    this.router.navigate(['/stock-categories', category.id]);
  }

  onDelete(event: Event, category: Category): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.transloco.translate('categories.deleteConfirmHeader'),
      message: this.transloco.translate('categories.deleteConfirmMessage'),
      acceptButtonProps: {
        severity: 'danger',
        label: this.transloco.translate('categories.actions.delete'),
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true,
        label: this.transloco.translate('categories.cancel'),
      },
      accept: () => {
        this.categoryService.delete(category.id);
        this.messageService.add({
          severity: 'success',
          summary: this.transloco.translate('categories.success'),
          detail: this.transloco.translate('categories.deleted'),
          life: 3000,
        });
      },
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  getPricingLabel(value: string): string {
    return this.categoryService.getPricingLabel(value);
  }

  getSalesLabel(value: string): string {
    return this.categoryService.getSalesLabel(value);
  }

  getParentName(parentId: string | null): string {
    return this.categoryService.getParentName(parentId);
  }
}
