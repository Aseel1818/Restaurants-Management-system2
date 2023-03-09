import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Table } from 'src/app/interfaces/table.interface';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TablesService {

	constructor(private http: HttpClient) {
	}

	getAll(): Observable<Table[]> {
		// return this.http.get<Table[]>(`${environment.serverUrl}/tables`);
		return new Observable<Table[]>(observer => {
			observer.next([{
				id: 1,
				name: 'table1',
				status: false
			},
				{
					id: 2,
					name: 'table2',
					status: false
				},
				{
					id: 3,
					name: 'table3',
					status: false
				},
				{
					id: 4,
					name: 'table4',
					status: false
				},
				{
					id: 5,
					name: 'table5',
					status: false
				}])
		})
	}
}
