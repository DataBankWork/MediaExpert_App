import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddEditProductDialogComponent } from './add-edit-product-dialog/add-edit-product-dialog/add-edit-product-dialog.component';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../interfaces/Product';
import { ProductService } from '../../services/product.service';



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatDividerModule, MatToolbarModule, MatButtonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  constructor(public dialog: MatDialog, private http: HttpClient, private productService: ProductService) { }

  ngOnInit() {
    this.getProducts();
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddEditProductDialogComponent);
  }
 
  getProducts() {
    this.productService.getAll().subscribe(
      (result) => {
        this.products = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

}
