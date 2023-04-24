import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/classes/order.class';
import { OrdersService } from 'src/app/services/orders/orders.service';

@Component({
	selector: 'app-orders',
	templateUrl: './orders.component.html',
	styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {
	selectedOrderId!: number;
	displayedColumns: string[] = ['OrderID', 'total', 'details', 'table', 'isPaid', 'pay'];
	orders: Order[] = [];
	statusOptions = ['paid', 'not paid'];

	constructor(private orderService: OrdersService) { }

	ngOnInit(): void {
		this.orders = this.orderService.getAll()
		console.log(this.orders);
	}

	goToPayments(orderID: number) {
		this.selectedOrderId = orderID
	}

	isOrderPaid(order: Order): boolean {
		return order.orderDetails.every(obj => obj.isPaid === true);
	}

	paidOrders(orderStatus: string) {
		if (orderStatus === "all") {
			this.orders = this.orderService.getAll();
		} else {
			this.orders = this.orderService.getAll().filter(order => {
				if (orderStatus === "paid") {
					return this.isOrderPaid(order);
				} else {
					return !this.isOrderPaid(order);
				}
			});
		}
	}

	editOrder(order: Order): void {
		this.orderService.editOrder(order);
	}
}