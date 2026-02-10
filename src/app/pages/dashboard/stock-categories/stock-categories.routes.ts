import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadComponent: () => import('./stock-categories') },
  { path: 'create', loadComponent: () => import('./category-form') },
  { path: ':id', loadComponent: () => import('./category-detail') },
  { path: ':id/edit', loadComponent: () => import('./category-form') },
];

export default routes;
