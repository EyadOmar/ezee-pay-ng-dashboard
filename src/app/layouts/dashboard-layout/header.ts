import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { LayoutService } from '../../core/services/layout.service';
import { AuthService } from '../../core/services/auth.service';
import ThemeToggle from '../../components/theme-toggle/theme-toggle';
import LanguageSelector from '../../components/language-selector/language-selector';

@Component({
  selector: 'app-header',
  imports: [TranslocoDirective, Button, Popover, RouterLink, ThemeToggle, LanguageSelector],
  templateUrl: './header.html',
})
export class Header {
  readonly layout = inject(LayoutService);
  private readonly auth = inject(AuthService);

  readonly user = this.auth.currentUser;

  onLogout(): void {
    this.auth.logout();
  }
}
