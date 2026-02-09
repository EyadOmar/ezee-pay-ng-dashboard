import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { Tooltip } from 'primeng/tooltip';
import { LayoutService } from '../../core/services/layout.service';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  route: string;
  icon: string;
  labelKey: string;
  exact: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, TranslocoDirective, Tooltip],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly layout = inject(LayoutService);
  private readonly auth = inject(AuthService);

  readonly menuItems: MenuItem[] = [
    { route: '/dashboard', icon: 'pi pi-home', labelKey: 'nav.overview', exact: true },
    { route: '/products', icon: 'pi pi-box', labelKey: 'nav.products', exact: false },
    { route: '/orders', icon: 'pi pi-shopping-cart', labelKey: 'nav.orders', exact: false },
    { route: '/customers', icon: 'pi pi-users', labelKey: 'nav.customers', exact: false },
    { route: '/inventory', icon: 'pi pi-warehouse', labelKey: 'nav.inventory', exact: false },
    { route: '/reports', icon: 'pi pi-chart-bar', labelKey: 'nav.reports', exact: false },
  ];

  onLogout(): void {
    this.auth.logout();
  }
}
