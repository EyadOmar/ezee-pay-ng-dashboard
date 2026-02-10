import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Button } from 'primeng/button';
import { FormField } from '../../../shared/components/form-field/form-field';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CategoryService } from '../../../core/services/category.service';
import { Category, PRICING_METHODS, SALES_STRATEGIES } from '../../../core/models';

@Component({
  selector: 'app-category-form',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    Breadcrumb,
    Button,
    FormField,
    InputText,
    Message,
    Select,
    Textarea,
    ToggleSwitch,
  ],
  templateUrl: './category-form.html',
})
export default class CategoryForm implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);
  readonly categoryService = inject(CategoryService);

  readonly isAr = this.categoryService.isAr;
  readonly parentCategories = this.categoryService.parentCategories;
  readonly pricingMethods = PRICING_METHODS;
  readonly salesStrategies = SALES_STRATEGIES;
  readonly isInherited = signal(false);

  readonly isEditMode = signal(false);
  readonly existingCategory = signal<Category | null>(null);

  readonly pageTitle = computed(() => (this.isEditMode() ? 'categories.editTitle' : 'categories.createTitle'));

  readonly homeItem = computed<MenuItem>(() => ({
    icon: 'pi pi-home',
    label: this.transloco.translate('nav.overview'),
    routerLink: '/dashboard',
  }));

  readonly breadcrumbItems = computed<MenuItem[]>(() => {
    const items: MenuItem[] = [
      { label: this.transloco.translate('categories.breadcrumb.list'), routerLink: '/stock-categories' },
    ];
    const cat = this.existingCategory();
    if (this.isEditMode() && cat) {
      const name = this.isAr() ? cat.nameAr : cat.nameEn;
      items.push({ label: name, routerLink: `/stock-categories/${cat.id}` });
      items.push({ label: this.transloco.translate('categories.breadcrumb.edit') });
    } else {
      items.push({ label: this.transloco.translate('categories.breadcrumb.create') });
    }
    return items;
  });

  readonly form = new FormGroup({
    nameEn: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    nameAr: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descEn: new FormControl('', { nonNullable: true }),
    descAr: new FormControl('', { nonNullable: true }),
    parentId: new FormControl<string | null>(null),
    pricingMethod: new FormControl<string>('fixed', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    salesStrategy: new FormControl<string>('fifo', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    inactive: new FormControl(false, { nonNullable: true }),
  });

  constructor() {
    this.form.controls.parentId.valueChanges.subscribe((parentId) => {
      this.applyInheritance(parentId ?? null);
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const cat = this.categoryService.getById(id);
      if (cat) {
        this.isEditMode.set(true);
        this.existingCategory.set(cat);
        this.form.patchValue({
          nameEn: cat.nameEn,
          nameAr: cat.nameAr,
          descEn: cat.descEn,
          descAr: cat.descAr,
          parentId: cat.parentId,
          pricingMethod: cat.pricingMethod,
          salesStrategy: cat.salesStrategy,
          inactive: cat.inactive,
        });
        this.applyInheritance(cat.parentId);
      } else {
        this.router.navigate(['/stock-categories']);
      }
    }
  }

  private applyInheritance(parentId: string | null): void {
    if (parentId) {
      const parent = this.parentCategories().find((p) => p.id === parentId);
      if (parent) {
        this.form.controls.pricingMethod.setValue(parent.pricingMethod);
        this.form.controls.salesStrategy.setValue(parent.salesStrategy);
        this.form.controls.pricingMethod.disable();
        this.form.controls.salesStrategy.disable();
        this.isInherited.set(true);
        return;
      }
    }
    this.form.controls.pricingMethod.enable();
    this.form.controls.salesStrategy.enable();
    this.isInherited.set(false);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const now = new Date();
    const existing = this.existingCategory();

    const result: Category = {
      id: existing?.id ?? `cat-${Date.now()}`,
      nameEn: raw.nameEn,
      nameAr: raw.nameAr,
      descEn: raw.descEn,
      descAr: raw.descAr,
      parentId: raw.parentId,
      pricingMethod: raw.pricingMethod as Category['pricingMethod'],
      salesStrategy: raw.salesStrategy as Category['salesStrategy'],
      inactive: raw.inactive,
      images: existing?.images ?? [],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.categoryService.save(result);
    const msgKey = this.isEditMode() ? 'categories.updated' : 'categories.created';
    this.messageService.add({
      severity: 'success',
      summary: this.transloco.translate('categories.success'),
      detail: this.transloco.translate(msgKey),
      life: 3000,
    });
    this.router.navigate(['/stock-categories']);
  }

  onCancel(): void {
    this.router.navigate(['/stock-categories']);
  }
}
