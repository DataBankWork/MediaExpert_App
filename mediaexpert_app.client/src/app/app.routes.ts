import { Routes } from "@angular/router";
import { ProductListPaginationComponent } from "./components/product-list-pagination/product-list-pagination.component";
import { ProductComponent } from "./components/product/product.component";

export const routes: Routes = [
  { path: 'products', component: ProductListPaginationComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' }
];
