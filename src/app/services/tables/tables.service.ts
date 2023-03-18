import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Table } from 'src/app/interfaces/table.interface';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})

export class TablesService {

	constructor(private http: HttpClient) {}

	getTableById(id: number): Observable<Table> {
		return this.http.get<Table>(`${environment.serverUrl}/findTable/${id}`);
	}

	getAll(): Observable<Table[]> {
		return this.http.get<Table[]>(`${environment.serverUrl}/tables`);
	}

	updateTable(table: Table): Observable<Table> {
		return this.http.put<Table>(`${environment.serverUrl}/updateTable/${table.id}`, table).pipe(
			map((table: any) => {
				return table;
			})
		);
	}
}
