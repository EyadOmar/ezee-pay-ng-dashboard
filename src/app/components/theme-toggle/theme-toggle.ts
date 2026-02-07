import { Component } from '@angular/core';

@Component({
  selector: 'theme-toggle',
  templateUrl: './theme-toggle.html',
})
export default class ThemeToggle {
  toggleDarkMode() {
    const element = document.querySelector('html');
    if (!element) return;
    element.classList.toggle('my-app-dark');
    const isDark = element.classList.contains('my-app-dark');
    document.cookie = `theme=${isDark ? 'dark' : 'light'}; path=/; max-age=31536000`;
  }
}
