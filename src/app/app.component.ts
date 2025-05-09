import { Component } from '@angular/core';
import { OrderTableComponent } from './order-table/order-table.component'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    OrderTableComponent, 
  ],
})
export class AppComponent {
  title = 'orders-app';
}