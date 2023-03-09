import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/classes/order.class';

@Injectable({
	providedIn: 'root'
})
export class OrdersService {
	orders: Order[] = [];
	currentOrder!: Order;

	constructor(private http: HttpClient) {
	}

	createNewOrder() {
		this.currentOrder = new Order();
	}

	getAll(): Observable<Order[]> {
		// return this.http.get<Order[]>(`${environment.serverUrl}/orders`);
		return new Observable<Order[]>(observer => {
			observer.next(this.orders);
		});
	}

	add(order: Order): Observable<Order> {
		// return this.http.post<Order>(`${environment.serverUrl}/addOrder`, order);
		return new Observable<Order>(observer => {
			this.orders.push(order);
			observer.next(order);
		});
	}
}
