import { Component , OnInit } from '@angular/core';
import { Order } from 'src/app/interfaces/orders.interface';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  isPayClicked = false;
  selectedOrderId!: string;
  displayedColumns: string[] = ['OrderID','total', 'details', 'pay'];
  constructor(private orderService:OrderService ) { }
  orders: Order[] = [];

  ngOnInit(): void {
    this.orderService.getAll()
      .subscribe((orders: Order[]) => {
        this.orders = orders;
        console.log(this.orders)
      });
  }
   
  goToPayments(orderId: string) {
    this.selectedOrderId = orderId;
    this.isPayClicked = !this.isPayClicked;
  }
}
