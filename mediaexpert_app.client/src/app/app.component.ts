import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ProductListComponent } from './components/product-list/product-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { ProductListPaginationComponent } from './components/product-list-pagination/product-list-pagination.component';
import { RouterOutlet } from '@angular/router';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: true,
  imports: [MatListModule, MatCardModule, MatToolbarModule, ProductListComponent, NgIf, NgFor,
    ProductListPaginationComponent, RouterOutlet]
})
export class AppComponent {
 

}
