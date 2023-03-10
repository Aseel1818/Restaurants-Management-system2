import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/classes/order.class';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  selectedOrderId!: any;
  displayedColumns: string[] = ['OrderID', 'total', 'details', 'pay'];
  orders: Order[] = [];

  constructor(private orderService: OrdersService, private router: Router ) {}

  ngOnInit(): void {
    this.orderService.getAll().subscribe((orders: Order[]) => {
      this.orders = orders;
    });
  }
  
  
  createNewOrder() {
    // create new order
    this.orderService.createNewOrder().subscribe(() => {
      // navigate to menu page and pass the current order ID
      this.router.navigate(['/menu'], { state: { orderId: this.orderService.currentOrder.id } });
    });
  }
  
  

  goToPayments(orderId: Number) {
    this.selectedOrderId = orderId;
  }
}
