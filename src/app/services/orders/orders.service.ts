import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from 'src/app/classes/order.class';

@Injectable({
	providedIn: 'root'
})
export class OrdersService {
	private orders: Order[] = [];
	currentOrder!: Order;

	constructor(private http: HttpClient) {
	}

	getAll() {
		return this.orders;
	}

	add(order: Order) {
		this.orders.push(order);
	}

	createNewOrder() {
		this.currentOrder = new Order();
		this.currentOrder.id = this.generateNewOrderId();
	}

	generateNewOrderId(): number {
		return this.orders.length + 1
	}
}