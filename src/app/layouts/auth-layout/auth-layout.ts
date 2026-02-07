import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import ThemeToggle from '../../components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, NgOptimizedImage, ThemeToggle],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {}
