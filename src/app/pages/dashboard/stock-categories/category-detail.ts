import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Tag } from 'primeng/tag';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-category-detail',
  imports: [DatePipe, TranslocoDirective, Breadcrumb, Button, Chip, ConfirmDialog, Tag],
  providers: [ConfirmationService],
  templateUrl: './category-detail.html',
})
export default class CategoryDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly transloco = inject(TranslocoService);
  readonly categoryService = inject(CategoryService);

  readonly isAr = this.categoryService.isAr;
  readonly category = signal<Category | null>(null);
  readonly parentCategory = signal<Category | null>(null);

  readonly homeItem = computed<MenuItem>(() => ({
    icon: 'pi pi-home',
    label: this.transloco.translate('nav.overview'),
    routerLink: '/dashboard',
  }));

  readonly breadcrumbItems = computed<MenuItem[]>(() => {
    const cat = this.category();
    const name = cat ? (this.isAr() ? cat.nameAr : cat.nameEn) : '';
    return [
      { label: this.transloco.translate('categories.breadcrumb.list'), routerLink: '/stock-categories' },
      { label: name || this.transloco.translate('categories.breadcrumb.detail') },
    ];
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const cat = this.categoryService.getById(id);
      if (cat) {
        this.category.set(cat);
        this.parentCategory.set(this.categoryService.getParent(cat));
      } else {
        this.router.navigate(['/stock-categories']);
      }
    } else {
      this.router.navigate(['/stock-categories']);
    }
  }

  onEdit(): void {
    const cat = this.category();
    if (cat) {
      this.router.navigate(['/stock-categories', cat.id, 'edit']);
    }
  }

  onDelete(event: Event): void {
    const cat = this.category();
    if (!cat) return;

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.transloco.translate('categories.deleteConfirmHeader'),
      message: this.transloco.translate('categories.deleteConfirmMessage'),
      icon: 'pi pi-exclamation-triangle',
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
        this.categoryService.delete(cat.id);
        this.router.navigate(['/stock-categories']);
      },
    });
  }

  getPricingLabel(value: string): string {
    return this.categoryService.getPricingLabel(value);
  }

  getSalesLabel(value: string): string {
    return this.categoryService.getSalesLabel(value);
  }
}
