import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/classes/order.class';
import { OrdersService } from 'src/app/services/orders/orders.service';

@Component({
	selector: 'app-orders',
	templateUrl: './orders.component.html',
	styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
	selectedOrderId!: any;
	displayedColumns: string[] = ['OrderID', 'total', 'details', 'pay'];
	orders: Order[] = [];

	constructor(private orderService: OrdersService) {
	}

	ngOnInit(): void {
		this.orders = this.orderService.getAll()
		console.log(this.orders);
	}

	goToPayments(orderId: Number) {
		this.selectedOrderId = orderId;
		console.log(this.selectedOrderId);
	
	}
}