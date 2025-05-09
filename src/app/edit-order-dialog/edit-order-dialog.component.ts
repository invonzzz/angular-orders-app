import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, ValidationErrors } from '@angular/forms';

interface Order 
{
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  status: string;
  data: string;
}

@Component({
  selector: 'app-edit-order-dialog',
  templateUrl: './edit-order-dialog.component.html',
  styleUrls: ['./edit-order-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
  ]
})
export class EditOrderDialogComponent 
{
  orderForm: FormGroup;
  isNewOrder: boolean = false;
  statusOptions: string[] = ['pending', 'archive', 'active', 'inactive'];

  constructor(
    public dialogRef: MatDialogRef<EditOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: Order, isNew: boolean },
    private fb: FormBuilder
  ) {
    this.isNewOrder = data.isNew;
    this.orderForm = this.fb.group({
      id: [data.order.id],
      first_name: [data.order.first_name, [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Zа-яА-ЯёЁ'\s-]+$/)
      ]],
      last_name: [data.order.last_name, [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Zа-яА-ЯёЁ'\s-]+$/)
      ]],
      email: [data.order.email, [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      address: [data.order.address, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      status: [data.order.status, Validators.required],
      data: [data.order.data, [
        Validators.required,
        Validators.pattern(/^\d{2}\.\d{2}\.\d{4}$/),
        this.dateValidator
      ]],
    });
  }

  private dateValidator(control: AbstractControl): ValidationErrors | null 
  {
    const value = control.value;
    if (!value) return null;
    const parts = value.split('.');
    if (parts.length !== 3) return {invalidDate: true};
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return {invalidDate: true};
    if (day < 1 || day > 31) return {invalidDay: true};
    if (month < 1 || month > 12) return {invalidMonth: true};
    if (year < 1950 || year > 2050) return {invalidYear: true};
    return null;
  }

  onSave(): void 
  {
    if (this.orderForm.valid) this.dialogRef.close(this.orderForm.value);
  }

  onCancel(): void 
  {
    this.dialogRef.close();
  }
}