import { Component, OnInit } from '@angular/core';
import { Table } from 'src/app/interfaces/table.interface';
import { TablesService } from 'src/app/services/tables/tables.service';

@Component({
	selector: 'app-tables-list',
	templateUrl: './tables-list.component.html',
	styleUrls: ['./tables-list.component.css']
})
export class TablesListComponent implements OnInit {

	tables: Table[] = [];

	constructor(private tableService: TablesService) {
	}

	ngOnInit(): void {
		this.tableService.getAll()
		.subscribe((tables: Table[]) => {
			this.tables = tables;
			console.log(this.tables);
		});
	}
}
