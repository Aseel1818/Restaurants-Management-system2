import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from 'src/app/interfaces/category.interface';
import { Item } from 'src/app/interfaces/item.interface';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ItemsService {
	constructor(private http: HttpClient) {
	}

	getAllCategories(): Observable<Category[]> {
		// return this.http.get<Category[]>(`${environment.serverUrl}/categories`);
		return new Observable<Category[]>((observer) => {
			observer.next([{
				id: 1,
				name: "Category1"
			},
				{
					id: 2,
					name: "Category2"
				}])
		})
	}

	getAllItems(): Observable<Item[]> {
		// return this.http.get<Item[]>(`${environment.serverUrl}/items`);
		return new Observable<Item[]>((observer) => {
			observer.next([{
				id: 1,
				name: "Item1",
				imageUrl: "https://images.pexels.com/photos/15859227/pexels-photo-15859227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
				price: 10
			},
				{
					id: 2,
					name: "Item2",
					imageUrl: "https://images.pexels.com/photos/15859227/pexels-photo-15859227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
					price: 15
				},
				{
					id: 3,
					name: "Item3",
					imageUrl: "https://images.pexels.com/photos/15859227/pexels-photo-15859227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
					price: 20
				},
				{
					id: 4,
					name: "Item4",
					imageUrl: "https://images.pexels.com/photos/15859227/pexels-photo-15859227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
					price: 25
				}])
		})
	}

	getItemsByCategoryId(categoryId: number): Observable<Item[]> {
		// return this.http.get<Item[]>(`${environment.serverUrl}/categories/${categoryId}/items`);
		return new Observable<Item[]>((observer) => {
			if (categoryId === 1) {
				observer.next([{
					id: 1,
					name: "Item1",
					imageUrl: "https://images.pexels.com/photos/15859227/pexels-photo-15859227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
					price: 10
				},
					{
						id: 4,
						name: "Item4",
						imageUrl: "https://images.pexels.com/photos/15859227/pexels-photo-15859227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
						price: 25
					}])
			} else {
				observer.next([
					{
						id: 2,
						name: "Item2",
						imageUrl: "https://images.pexels.com/photos/15859227/pexels-photo-15859227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
						price: 15
					},
					{
						id: 3,
						name: "Item3",
						imageUrl: "https://images.pexels.com/photos/15859227/pexels-photo-15859227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
						price: 20
					}])
			}
		})
	}
}
