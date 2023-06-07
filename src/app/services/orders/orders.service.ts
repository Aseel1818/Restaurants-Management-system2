import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/classes/order.class';
import { Table } from 'src/app/interfaces/table.interface';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class OrdersService {
	private orders: Order[] = [];
	currentOrder: Order | null = null;
	tables!: Table;
	tableIds: number[] = [];


	constructor(
		private http: HttpClient,
		private router: Router) {
		const storedOrders = localStorage.getItem('orders');
		if (storedOrders) {
			this.orders = JSON.parse(storedOrders);
		}
	}

	getAll() {
		return this.orders;
	}

	add(order: Order) {
		const existingOrderIndex = this.orders.findIndex(o => o.id === order.id);
		if (existingOrderIndex !== -1) {
			this.orders[existingOrderIndex] = order;
		} else {
			order.id = this.generateNewOrderId();
			this.orders.push(order);
		}
		localStorage.setItem('orders', JSON.stringify(this.orders));
	}

	createNewOrder() {
		this.currentOrder = new Order();
		this.currentOrder.id = this.generateNewOrderId();
		this.currentOrder.total = 0;
		this.currentOrder.notes = null;
		this.currentOrder.orderDetail = [];

	}

	generateNewOrderId(): number {
		return this.orders.length + 1
	}

	getOrderByID(orderID: number): Order | null {
		let foundOrder: Order | null = null
		this.orders.forEach(order => {
			if (order.id == orderID) {
				foundOrder = order
			}
		})
		return foundOrder
	}

	addOrder(order: Order) {
		const orderDetailArray: any[] = []
		order.orderDetail.forEach(orderDetails => {
			const itemId = orderDetails.item.id;
			const quantity = orderDetails.quantity;
			orderDetailArray.push({
				itemId,
				quantity
			})
		})
		const newOrder = {
			note: order.notes,
			total: order.total,
			tables: order.tableID,
			orderDetails: orderDetailArray
		}
		return this.http.post<Order>(`${environment.serverUrl}/rest/order/addOrder`, newOrder);
	}

	editOrder(order: Order) {
		this.currentOrder = order;
		console.log(order);
		this.router.navigate(['/menu']);
	}

	deleteOrder(order: Order) {
		if (order.orderDetail.length === 0) {
			const index = this.orders.indexOf(order);
			if (index > -1) {
				this.orders.splice(index, 1);
			}
		}
	}
}