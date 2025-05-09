import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { OrderTableComponent } from './app/order-table/order-table.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), 
    provideRouter([
      { path: '', component: OrderTableComponent }, 
    ]),
  ],
}).catch((err) => console.error(err));