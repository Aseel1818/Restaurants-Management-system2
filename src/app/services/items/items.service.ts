import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from 'src/app/interfaces/category.interface';
import { Item } from 'src/app/interfaces/item.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})

export class ItemsService {
	constructor(private http: HttpClient) {
	}

	getAllCategories(): Observable<Category[]> {
		return this.http.get<Category[]>(`${environment.serverUrl}/rest/category`);
	}

	getAllItems(): Observable<Item[]> {
		return this.http.get<Item[]>(`${environment.serverUrl}/rest/item/items`);	
	}

	getItemsByCategoryId(categoryID: number): Observable<Item[]> {
		return this.http.get<Item[]>(`${environment.serverUrl}/rest/category/${categoryID}/items`);
	}
}
