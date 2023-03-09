import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Table } from 'src/app/interfaces/table.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class TablesService {

	constructor(private http: HttpClient) {
	}

	getAll(): Observable<Table[]> {
		 return this.http.get<Table[]>(`${environment.serverUrl}/tables`);
		
	}
}
