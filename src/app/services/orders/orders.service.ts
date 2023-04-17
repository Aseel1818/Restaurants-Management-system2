import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
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

	private orderSubject = new BehaviorSubject<Order>(new Order());
	
	constructor(private http: HttpClient, private router: Router) {
		const storedOrders = localStorage.getItem('orders');
		if (storedOrders) {
			this.orders = JSON.parse(storedOrders);
		}
	}
 

	getAll() {
		return this.orders;
	}

	/*add(order: Order) {
		if (!this.orders.includes(order)) {
			order.id = this.generateNewOrderId();
			this.orders.push(order);
		}
		localStorage.setItem('orders', JSON.stringify(this.orders));
	}*/

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

	/*getOrderByID(orderID: number): Order | null {
		let foundOrder: Order | null = null
		this.orders.forEach(order => {
			if (order.id == orderID) {
				foundOrder = order
			}
		})
		console.log(foundOrder);
		return foundOrder
	}*/

	getOrderByID(orderID: number): Order | null {
		return this.orders.find(order => order.id === orderID) || null;
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
	  getOrderObservable(): Observable<Order> {
		return this.orderSubject.asObservable();
	  }

	  updateOrderSubject(orderToUpdate: Order): void {
		this.currentOrder = orderToUpdate;
		this.orderSubject.next(orderToUpdate);
	  }

	  editOrder(orderId: number) {
		const orderToUpdate = this.getOrderByID(orderId);
		if (orderToUpdate) {
			this.updateOrderSubject(orderToUpdate); // update the current order subject
			this.currentOrder = orderToUpdate; // set the currentOrder to the order to be edited
			console.log(orderToUpdate);
			this.router.navigate(['/menu', { id: orderToUpdate.id }]);
		} else {
			console.log(`Order with ID ${orderId} not found`);
		}
	}
	
	  
	}	