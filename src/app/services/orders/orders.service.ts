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

	generateNewOrderId(): number {
		return this.orders.length + 1
	}

	getOrderByID(orderID: number): Order | null {
		return this.orders.find(order => order.id === orderID) || null;
	}

	addOrder(order: Order) {
		const orderDetailArray: any[] = []
		order.orderDetails.forEach(orderDetail => {
			const itemId = orderDetail.item.id;
			const quantity = orderDetail.quantity;
			orderDetailArray.push({
				itemId,
				quantity
			})
		})
		const newOrder = {
			note: order.notes,
			total: order.total,
			tables: order.tableID,
			orderDetail: orderDetailArray
		}
		return this.http.post<Order>(`${environment.serverUrl}/addOrder`, newOrder);
	}

	createNewOrder() {
		this.currentOrder = new Order();
		this.currentOrder.id = this.generateNewOrderId();
	}

	editOrder(order: Order) {
		this.currentOrder = order;
		console.log(order);
		this.router.navigate(['/menu']);
	}
}	