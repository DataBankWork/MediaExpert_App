import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Product, ProductWithType } from '../../../interfaces/Product';

@Component({
  selector: 'app-add-edit-product-dialog',
  standalone: true,
  templateUrl: './add-edit-product-dialog.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TitleCasePipe
  ]
})
export class AddEditProductDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductWithType | null
  ) {
    this.form = this.fb.group({
      id: [data?.id ?? null],
      code: [data?.code ?? '', Validators.required],
      name: [data?.name ?? '', Validators.required],
      price: [data?.price ?? 0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value as Product);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
