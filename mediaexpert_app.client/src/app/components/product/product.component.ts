import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseComponent } from '../base-component/base-component.component';

export interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent extends BaseComponent implements OnInit {

  constructor(private route: ActivatedRoute, private productService: ProductService) {
    super(); 
  }

  product?: Product;
  loading = true;

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.productService.getById(id).subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  onBack(): void {
    window.history.back();
  }
}
