import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/classes/order.class';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { Item } from 'src/app/interfaces/item.interface';

@Component({
	selector: 'app-orders',
	templateUrl: './orders.component.html',
	styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
	selectedOrderId!: any;
	displayedColumns: string[] = ['OrderID', 'total', 'details', 'pay'];
	orders: Order[] = [];
	isPayClicked = true;

	constructor(private orderService: OrdersService) {
	}

	ngOnInit(): void {
		this.orderService.getAll()
			.subscribe((orders: Order[]) => {
				this.orders = orders;
				console.log(this.orders);
			});
	}

	goToPayments(orderId: Number) {
		this.selectedOrderId = orderId;
		this.isPayClicked = !this.isPayClicked;
		console.log(this.selectedOrderId);
	}
}