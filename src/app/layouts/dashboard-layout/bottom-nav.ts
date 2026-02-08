import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

interface BottomNavItem {
  route: string;
  icon: string;
  labelKey: string;
  exact: boolean;
}

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive, TranslocoDirective],
  templateUrl: './bottom-nav.html',
})
export class BottomNav {
  readonly navItems: BottomNavItem[] = [
    { route: '/dashboard', icon: 'pi pi-home', labelKey: 'nav.overview', exact: true },
    { route: '/products', icon: 'pi pi-box', labelKey: 'nav.products', exact: false },
    { route: '/orders', icon: 'pi pi-shopping-cart', labelKey: 'nav.orders', exact: false },
    { route: '/customers', icon: 'pi pi-users', labelKey: 'nav.customers', exact: false },
    { route: '/settings', icon: 'pi pi-cog', labelKey: 'nav.settings', exact: false },
  ];
}
