import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['./select-table.component.css']
})
export class SelectTableComponent {
  selectedTableId: number | null = null;
  constructor(
    public dialogRef: MatDialogRef<SelectTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number[],
  ) {}
  selectTable(tableId: number) {
    this.selectedTableId = tableId;
    setTimeout(() => {
      this.dialogRef.close(tableId);
    }, 500);
  }
  isTableSelected(tableId: number): boolean {
    return this.selectedTableId === tableId;
  }
}