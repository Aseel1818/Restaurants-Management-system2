import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from 'src/app/classes/order.class';
import { Table } from 'src/app/interfaces/table.interface';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class OrdersService {
	private orders: Order[] = [];
	currentOrder!: Order;
	tables!: Table;

	constructor(private http: HttpClient) {
		const storedOrders = localStorage.getItem('orders');
		if (storedOrders) {
			this.orders = JSON.parse(storedOrders);
		}
	}

	getAll() {
		return this.orders;
	}

	add(order: Order) {
		if (!this.orders.includes(order)) {
			this.orders.push(order);
		}
		localStorage.setItem('orders', JSON.stringify(this.orders));
	}

	createNewOrder() {
		this.currentOrder = new Order();
		this.currentOrder.id = this.generateNewOrderId();
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

	addOrder(order:Order){
		const orderDetailArray:any[]= []
		order.orderDetails.forEach(orderDetail=>{
			const itemId = orderDetail.item.id;
			const quantity = orderDetail.quantity;
			orderDetailArray.push({
				itemId,
				quantity
			})
		})
		const newOrder = {
			note: order.notes ,
			total:order.total,
			tables:order.tableID,
			orderDetail:orderDetailArray
		}
		return this.http.post<Order>(`${environment.serverUrl}/addOrder`, newOrder);
	}


	deleteOrderById (orders: Order[] , idToDelete:number ) : void {
		console.log(idToDelete);

		const indexToDelete = orders.findIndex(order => order.id === idToDelete);

		if ( indexToDelete !== -1){
			orders.splice(indexToDelete,1);
		}

	}
	
}
