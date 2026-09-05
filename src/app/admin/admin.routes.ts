import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'products', loadComponent: () => import('./pages/products/admin-products.component').then(m => m.AdminProductsComponent) },
      { path: 'products/new', loadComponent: () => import('./pages/products/product-form.component').then(m => m.ProductFormComponent) },
      { path: 'products/:id/edit', loadComponent: () => import('./pages/products/product-form.component').then(m => m.ProductFormComponent) },
      { path: 'brands', loadComponent: () => import('./pages/brands/admin-brands.component').then(m => m.AdminBrandsComponent) },
      { path: 'types', loadComponent: () => import('./pages/types/admin-types.component').then(m => m.AdminTypesComponent) },
      { path: 'orders', loadComponent: () => import('./pages/orders/admin-orders.component').then(m => m.AdminOrdersComponent) },
      { path: 'users', loadComponent: () => import('./pages/users/admin-users.component').then(m => m.AdminUsersComponent) }
    ]
  }
];