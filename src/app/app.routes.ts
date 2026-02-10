import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', loadComponent: () => import('./pages/auth/login/login') },
      { path: 'register', loadComponent: () => import('./pages/auth/register/register') },
    ],
  },
  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/overview/overview') },
      { path: 'products', loadComponent: () => import('./pages/dashboard/products/products') },
      { path: 'orders', loadComponent: () => import('./pages/dashboard/orders/orders') },
      { path: 'customers', loadComponent: () => import('./pages/dashboard/customers/customers') },
      { path: 'inventory', loadComponent: () => import('./pages/dashboard/inventory/inventory') },
      { path: 'stock-categories', loadChildren: () => import('./pages/dashboard/stock-categories/stock-categories.routes') },
      { path: 'reports', loadComponent: () => import('./pages/dashboard/reports/reports') },
      { path: 'settings', loadComponent: () => import('./pages/dashboard/settings/settings') },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
