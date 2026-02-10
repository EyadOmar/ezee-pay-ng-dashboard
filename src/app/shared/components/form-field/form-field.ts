import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  template: `
    <div class="flex flex-col gap-2">
      <label [attr.for]="for()" class="text-sm font-medium text-surface-700 dark:white">
        {{ label() }}
        @if (required()) {
          <span class="text-red-500 ms-0.5">*</span>
        }
      </label>
      <div class="flex flex-col gap-1">
        <ng-content />
      </div>
    </div>
  `,
})
export class FormField {
  label = input.required<string>();
  for = input<string>();
  required = input(false);
}
