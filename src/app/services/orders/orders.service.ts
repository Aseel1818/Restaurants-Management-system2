import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Order } from 'src/app/classes/order.class';

@Injectable({
	providedIn: 'root'
})
export class OrdersService {
	orders: Order[] = [];
	currentOrder!: Order;

	constructor(private http: HttpClient) {
	}
createNewOrder(): Observable<Order> {
  const newOrder = new Order();
  newOrder.id = this.generateNewOrderId();
  this.orders.push(newOrder);
  this.currentOrder = newOrder; // set currentOrder to the new order
  return of(newOrder).pipe(
    tap(() => {
      console.log('New order created');
    })
  );
}

  generateNewOrderId(): number {
    const maxOrderId = this.orders.reduce((max, order) => Math.max(max, order.id), 0);
    return maxOrderId +1;

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
