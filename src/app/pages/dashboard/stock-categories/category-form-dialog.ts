import { Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { LanguageService } from '../../../core/services/language.service';
import {
  Category,
  IMAGE_DESTINATIONS,
  PRICING_METHODS,
  SALES_STRATEGIES,
} from '../../../core/models';

@Component({
  selector: 'app-category-form-dialog',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    Button,
    Dialog,
    FloatLabel,
    InputText,
    Message,
    Select,
    Textarea,
    ToggleSwitch,
  ],
  templateUrl: './category-form-dialog.html',
})
export class CategoryFormDialog {
  private readonly langService = inject(LanguageService);

  readonly visible = model(false);
  readonly category = input<Category | null>(null);
  readonly isEditMode = input(false);
  readonly parentCategories = input<Category[]>([]);
  readonly saved = output<Category>();

  readonly isAr = computed(() => this.langService.currentLang() === 'ar');
  readonly pricingMethods = PRICING_METHODS;
  readonly salesStrategies = SALES_STRATEGIES;
  readonly imageDestinations = IMAGE_DESTINATIONS;
  readonly isInherited = signal(false);

  readonly form = new FormGroup({
    nameEn: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    nameAr: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descEn: new FormControl('', { nonNullable: true }),
    descAr: new FormControl('', { nonNullable: true }),
    parentId: new FormControl<string | null>(null),
    pricingMethod: new FormControl<string>('fixed', { nonNullable: true, validators: [Validators.required] }),
    salesStrategy: new FormControl<string>('fifo', { nonNullable: true, validators: [Validators.required] }),
    inactive: new FormControl(false, { nonNullable: true }),
  });

  constructor() {
    // Watch category input to populate form on edit
    effect(() => {
      const cat = this.category();
      if (cat && this.isEditMode()) {
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
      } else if (!this.isEditMode()) {
        this.form.reset({
          nameEn: '',
          nameAr: '',
          descEn: '',
          descAr: '',
          parentId: null,
          pricingMethod: 'fixed',
          salesStrategy: 'fifo',
          inactive: false,
        });
        this.isInherited.set(false);
        this.form.controls.pricingMethod.enable();
        this.form.controls.salesStrategy.enable();
      }
    });

    // Watch parentId changes
    this.form.controls.parentId.valueChanges.subscribe((parentId) => {
      this.applyInheritance(parentId ?? null);
    });
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
    const existing = this.category();

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

    this.saved.emit(result);
    this.visible.set(false);
  }

  onHide(): void {
    this.visible.set(false);
  }
}
