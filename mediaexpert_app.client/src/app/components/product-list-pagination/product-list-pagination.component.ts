import { Component, DestroyRef, ViewChild} from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { ProductService } from '../../services/product.service';
import { Product, ProductWithType } from '../../interfaces/Product';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { AddEditProductDialogComponent } from './add-edit-product-dialog/add-edit-product-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { Subject, catchError, debounceTime, filter, map, of, retry, switchMap, timer } from 'rxjs';
import { BaseComponent } from '../base-component/base-component.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ActionType } from '../../enums/ProductEnums';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list-pagination',
  styleUrl: './product-list-pagination.component.css',
  templateUrl: './product-list-pagination.component.html',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule,
    MatToolbarModule, MatCheckboxModule, MatButtonModule, MatTooltipModule, MatBadgeModule, CommonModule],
})
export class ProductListPaginationComponent extends BaseComponent {

  displayedColumns: string[] = ['action', 'name', 'code', 'price', 'id', 'select'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource();
  selection = new SelectionModel<Product>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator
  ActionType = ActionType;
  private searchSubject = new Subject<string>();
  
  totalItems = 0;
  pageSize = 3;
  pageNumber = 1;
  filterValue = "";

  constructor(private productService: ProductService, public dialog: MatDialog,
    private destroyRef: DestroyRef, private router: Router) {
    super();

    this.searchSubject.pipe(
      debounceTime(300),
      map(value => (value ? value.trim() : '')),
      switchMap((value: string) => {
        return this.productService.getPagedSearch(this.pageNumber, this.pageSize, value).pipe(
          retry({
            count: 3,
            delay: (error, retryCount) => {
              this.snackBarWarning(`Attempt ${retryCount} unsuccessful. Trying again...`);
              console.warn(`Attempt ${retryCount} unsuccessful. Trying again...`);
              return timer(retryCount * 1000);
            }
          }),
          catchError(err => {
            this.snackBarError("Error downloading products after several attempts.");
            //todo: add error log
            return of({ items: [], totalCount: 0 });
          })
        );
      }),
      takeUntilDestroyed()
    ).subscribe({
      next: (result) => {
        this.dataSource.data = result.items;
        this.totalItems = result.totalCount;
      },
      error: (err) => {
        this.snackBarError("Error during searching for product");
        //todo: add error log
      }
    });
    this.loadProducts();
  }

  applyFilter(event: Event) {
    const newValue = (event.target as HTMLInputElement).value.trim();

    if ((newValue ?? '') === this.filterValue) 
      return;

    if (this.paginator) {
      this.paginator.firstPage();
    }
          
    this.filterValue = newValue;
    this.selection.clear();
    this.loadProducts();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.selection.clear();
    this.loadProducts();
  }

  openDialog(action?: ActionType, id?: number) {
    const dialogRef = this.dialog.open(AddEditProductDialogComponent, {
      data: {
        ...this.dataSource.data.find(p => p.id === id),
        type: action
      } as ProductWithType
    });

    switch (action) {
      case ActionType.Create:
        this.createProduct(dialogRef);
        break;

      case ActionType.Edit:
        this.editProduct(dialogRef);
        break;

      case ActionType.Copy:
        this.createProduct(dialogRef)
        break;

      default:
        this.snackBarWarning("No appropriate action")
    }    
  }

  productInfo(id: number) {
    this.router.navigate(['/product', id]);
  }

  delete() {
    if (this.selection.isEmpty()) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().pipe(
      filter(result => !!result),
      switchMap(() => {
        const ids = this.selection.selected.map(product => product.id);
        return this.productService.deleteRange(ids);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (result) => {
        this.snackBarSuccess("The item was deleted successfully");
        this.loadProducts();
        this.selection.clear();
      },
      error: (err) => {
        this.snackBarError("An error occurred while deleting");
        //todo: add error log

      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }


  //--------------------------TOOLS-----------------------------------

  private loadProducts() {
    this.searchSubject.next(this.filterValue);
  }

  private createProduct(dialogRef: MatDialogRef<AddEditProductDialogComponent, ProductWithType>) {
    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(newProduct => !!newProduct && !!newProduct),
      switchMap(newProduct => this.productService.create(newProduct!))
    ).subscribe({
      next: (result) => {
        this.snackBarSuccess("Dodano poprawnie element");
        this.loadProducts();
      },
      error: (err) => {
        this.snackBarError("Błąd podczas tworzenia produktu");
        //todo: add error log
      }
    });
  }

  private editProduct(dialogRef: MatDialogRef<AddEditProductDialogComponent, ProductWithType>) {
    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(editProduct => !!editProduct && !!editProduct),
      switchMap(editProduct => this.productService.update(editProduct!))
    ).subscribe({
      next: (result) => {
        this.snackBarSuccess("Edytowano poprawnie element");
        this.loadProducts();
      },
      error: (err) => {
        this.snackBarError("Błąd podczas edycji produktu");
        //todo: add error log
      }
    });
  }

}

