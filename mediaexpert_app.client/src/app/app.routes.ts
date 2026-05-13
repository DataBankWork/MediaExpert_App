import { Routes } from "@angular/router";
import { ProductListPaginationComponent } from "./components/product-list-pagination/product-list-pagination.component";
import { ProductComponent } from "./components/product/product.component";
import { authGuardWithDialog } from "./guards/authGuard";

export const routes: Routes = [
  { path: 'products', component: ProductListPaginationComponent },
  {
    path: 'product/:id', component: ProductComponent,
    canActivate: [authGuardWithDialog]
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' }
];
