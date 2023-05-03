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
     accessToken = localStorage.getItem('accessToken');
	getTableById(id: number): Observable<Table> {
		return this.http.get<Table>(`${environment.serverUrl}/rest/table/findTable/${id}`);
	}

	getAll(): Observable<Table[]> {
		return this.http.get<Table[]>(`${environment.serverUrl}/rest/table/tables`);
	}

	updateTable(tableIDs: number[]): Observable<Table> {
		console.log("tableIDs",tableIDs);
		return this.http.put<Table>(`${environment.serverUrl}/rest/table/updateTable`, {tableIDs}).pipe(
			map((table: any) => {
				return table;
			})
		);
	}
}
