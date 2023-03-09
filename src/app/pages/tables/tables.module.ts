import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesRoutingModule } from './tables-routing.module';
import { TablesListComponent } from './tables-list/tables-list.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './table/table.component';


@NgModule({
	declarations: [
		TablesListComponent,
		TableComponent
	],
	imports: [
		CommonModule,
		TablesRoutingModule,
		FormsModule,
		CommonModule,
		MatCardModule

	]
})
export class TablesModule {
}
