import { Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from 'primeng/button';
import { LayoutService } from '../../core/services/layout.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [TranslocoDirective, Button],
  templateUrl: './header.html',
})
export class Header {
  readonly layout = inject(LayoutService);
  private readonly auth = inject(AuthService);

  onLogout(): void {
    this.auth.logout();
  }
}
