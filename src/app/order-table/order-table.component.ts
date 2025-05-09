import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { OrderService } from '../order.service';
import { MatDialog } from '@angular/material/dialog';
import { EditOrderDialogComponent } from '../edit-order-dialog/edit-order-dialog.component';

interface Order {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  status: string;
  data: string; 
}

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginator,
    MatMenuModule
  ],
})
export class OrderTableComponent implements OnInit 
{
  baseColumns = ['id', 'customer', 'date', 'status', 'actions'];
  extraColumns = ['email', 'address'];
  allColumns = [...this.baseColumns, ...this.extraColumns];
  displayedColumns: string[] = [...this.baseColumns];
  dataSource = new MatTableDataSource<Order>();
  totalOrders: number = 0;
  isLoading = true;
  showExtraColumns = false;
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private orderService: OrderService, private dialog: MatDialog) {}
  ngOnInit(): void 
  {
    this.loadOrders();
  }
  ngAfterViewInit() 
  {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // кастомная сортировка
    this.dataSource.sortingDataAccessor = (item: Order, property: string) => 
    {
      switch (property) 
      {
        case 'customer':
          return `${item.first_name} ${item.last_name}`.toLowerCase();
        case 'date':
          return this.parseCustomDate(item.data);
        default:
          // @ts-ignore
          return item[property];
      }
    };
  }
  onRowClick(event: MouseEvent, order: Order): void 
  {
    if (event.target === event.currentTarget || (event.target as HTMLElement).tagName === 'TD') 
    {
      if (order.status !== 'archive') 
      {
        this.editOrder(event, order);
      }
    }
  }



  editOrder(event: MouseEvent, order: Order): void 
  {
    event.stopPropagation();
    if (order.status === 'archive') return;
    const dialogRef = this.dialog.open(EditOrderDialogComponent, 
    {
      width: '600px',
      height: '550px',
      data: { order: { ...order }, isNew: false }
    });

    dialogRef.afterClosed().subscribe(result => 
    {
      if (result) 
      {
        const index = this.dataSource.data.findIndex(o => o.id === result.id);
        if (index !== -1)
        {
          this.dataSource.data[index] = result;
          this.dataSource.data = [...this.dataSource.data]; // триггер изменения
        }
      }
    });
  }
  private formatDate(date: Date): string 
  {
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear(); 
    return `${day}.${month}.${year}`; 
  }

  addNewOrder(): void 
  {
    const today = new Date(); 
    const formattedDate = this.formatDate(today); 
    const newOrder: Order = {
      id: this.generateNewId(),
      first_name: '',
      last_name: '',
      email: '',
      address: '',
      status: 'pending',
      data: formattedDate 
    };

    const dialogRef = this.dialog.open(EditOrderDialogComponent, 
    {
      width: '600px',
      height: '550px',
      data: { order: newOrder, isNew: true }
    });

    dialogRef.afterClosed().subscribe(result => 
    {
      if (result) 
      {
        this.dataSource.data = [result, ...this.dataSource.data];
        this.totalOrders = this.dataSource.data.length;
      }
    });
  }

  private generateNewId(): number 
  {
    const ids = this.dataSource.data.map(order => order.id);
    return Math.max(...ids, 0) + 1;
  }

  private parseCustomDate(dateString: string): number 
  {
    if (!dateString) return 0;
    const parts = dateString.split('.');
    if (parts.length === 3) 
    {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day).getTime();
    }
    
    return 0;
  }

  loadOrders(): void 
  {
    this.isLoading = true;
    this.orderService.getOrders().subscribe(
      (data) => 
      {
        this.dataSource.data = data;
        this.totalOrders = data.length;
        this.isLoading = false;
      },
      (error) => 
      {
        console.error('Error loading data:', error);
        this.isLoading = false;
      }
    );
  }

  toggleExtraColumns(): void 
  {
    this.showExtraColumns = !this.showExtraColumns;
    this.displayedColumns = this.showExtraColumns 
      ? [...this.baseColumns, ...this.extraColumns]
      : [...this.baseColumns];
  }


  
}