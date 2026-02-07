import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import ThemeToggle from '../../components/theme-toggle/theme-toggle';
import LanguageSelector from '../../components/language-selector/language-selector';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, NgOptimizedImage, ThemeToggle, TranslocoDirective, LanguageSelector],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {}
