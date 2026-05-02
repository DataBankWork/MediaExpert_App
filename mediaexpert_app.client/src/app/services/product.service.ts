import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/Product';
import { PagedResult } from '../interfaces/PagedResult';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl:string = 'api/product/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl)
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(this.apiUrl+`${id}`);
  }

  create(product: Product): Observable<Product> {
    const productToSave = { ...product, id: 0 };
    return this.http.post<Product>(this.apiUrl, productToSave);
  }

  update(product: Product): Observable<void> {
    return this.http.put<void>(this.apiUrl, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl+`${id}`);
  }

  deleteRange(ids: number[]): Observable<void> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: ids
    };

    return this.http.delete<void>(this.apiUrl+`delete_range`, options);
  }

  getPagedSearch(pageNumber: number = 1, pageSize: number = 3, searchTerm: string): Observable<PagedResult<Product>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('searchTerm', searchTerm);

    return this.http.get<PagedResult<Product>>(this.apiUrl+`get_paged_search`, { params });
  }
}
