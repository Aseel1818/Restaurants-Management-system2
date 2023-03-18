import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Table } from 'src/app/interfaces/table.interface';
import { map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})

export class TablesService {

	getTableById(id: number): Observable<Table> {
		return this.http.get<Table>(`${environment.serverUrl}/findTable/${id}`);
	}

	constructor(private http: HttpClient) {
	}

	getAll(): Observable<Table[]> {
		return this.http.get<Table[]>(`${environment.serverUrl}/tables`);
	}

	updateTable(table: Table): Observable<Table> {
		return this.http.put<Table>(`${environment.serverUrl}/updateTable/${table.id}`, table).pipe(
			map((updatedTable: any) => {
				return updatedTable;
			})
		);
	}
}
