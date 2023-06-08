import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from 'src/app/classes/order.class';
import { Item } from 'src/app/interfaces/item.interface';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { Table } from 'src/app/interfaces/table.interface';
import { TablesService } from 'src/app/services/tables/tables.service';
import { OrderDetail } from 'src/app/interfaces/orderDetail.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectTableComponent } from '../select-table/select-table.component';
@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
    selectedOrderId!: number;
    selectedRow: Order | null = null;
    displayedColumns: string[] = ['select', 'OrderID', 'total', 'details', 'table', 'isPaid', 'pay'];
    orders: Order[] = [];
    statusOptions = ['paid', 'not paid'];
    allSelected: any;
    selectedItems: Item[] = [];
    isSelectingItems: boolean = false;
    @ViewChild(MatCheckbox) checkbox!: MatCheckbox;
    selection = new SelectionModel<any>(true, []);
    showCheckboxes = false;
    selectedOrders: any[] = [];
    selectedOrdersTotal: number = 0;
    tables: Table[] = [];
    tables2: number[] = [];
    tableId: Table | null = null;
    selectedTable!: number;
    selectedItemsDetails: OrderDetail[] = [];
    dbOrders: Order[] = [];
    allOrders: Order[] = [];
    selectedTables: number[] = [];
    constructor(private orderService: OrdersService,
        private tableService: TablesService,
        private router: Router,
        private toastr: ToasterService,
        private route: ActivatedRoute,
        private dialog: MatDialog
    ) { }
    ngOnInit(): void {
        this.orders = this.orderService.getAll()
        this.orders.forEach(order => {
            this.orderService.deleteOrder(order);
        })
        this.tableService.getAll()
            .subscribe((tables: Table[]) => {
                this.tables = tables.filter(table => table.status === false);
            });
        this.orders = this.orders.filter(order => order.orderDetail.length > 0);
        this.dbOrders = this.route.snapshot.data['orders'];
        this.dbOrders.forEach(order => {
            if (order.orderDetail) {
                order.orderDetail.forEach(orderDetail => {
                    orderDetail.isPaid = true;
                });
            }
        });
        this.allOrders = this.orders.concat(this.dbOrders);
    }
    goToPayments(orderID: number) {
        this.selectedOrderId = orderID
    }
    isOrderPaid(order: Order): boolean {
        if (order.orderDetail) {
            return order.orderDetail.every(object => object.isPaid === true);
        } else {
            return false;
        }
    }
    paidOrders(orderStatus: string) {
        if (orderStatus === "all") {
            this.orders = this.allOrders;
            console.log(this.allOrders)
        } else {
            this.orders = this.allOrders.filter(order => {
                if (orderStatus === "paid") {
                    return this.isOrderPaid(order);
                } else {
                    return !this.isOrderPaid(order);
                }
            });
        }
    }
    selectAll() {
        for (const order of this.orders) {
            order.isSelected = this.allSelected;
        }
    }
    showNewButton = false;
    buttons = [{ label: 'Join Order', action: 'join' }];
    handleAction(action: string) {
        switch (action) {
            case 'join':
                this.paidOrders('notPaid');
                this.joinSelectedOrders();
                break;
            case 'split':
                break;
            case 'edit':
                break;
            default:
                console.log('Invalid action');
                break;
        }
    }
    joinSelectedOrders() {
        this.showNewButton = true;
        this.showCheckboxes = true;
    }
    joinOrders(selectedTable: number | null = null) {
        const selectedOrders = this.selection.selected;
        if (selectedOrders.length < 2) {
            this.toastr.showToaster('warning', 'Select 2 orders or more to join', 'error');
            return;
        }
        selectedOrders.forEach(order=>{
            if(order.tableID!=undefined){
                this.tables2.push(order.tableID)
            }
        })
        console.log("TABLES2 ",this.tables2)
        if(this.tables2) {
            if(this.tables2.length >= 2) {
                const dialogRef = this.dialog.open(SelectTableComponent, {data : this.tables2});
                dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
                selectedTable = result
                this.makeJoin(selectedTable, selectedOrders)
                const tablesToUpdate:number[] = []
                this.tables2.forEach(tableId => {
                    if(tableId !== result) {
                        tablesToUpdate.push(tableId)
                    }
                })
                this.tableService.updateTable(tablesToUpdate).subscribe(res => {
                });
                });
            } else {
                selectedTable = this.tables2[0]
                this.makeJoin(selectedTable, selectedOrders)
            }
        } else {
            this.makeJoin(null, selectedOrders)
        }
    }
    makeJoin(selectedTable: number | null, selectedOrders: Order[]){
        this.orderService.createNewOrder();
        const newOrder = this.orderService.currentOrder!;
        newOrder.tableID = selectedTable;
        this.orderService.add(newOrder);
        this.orders = this.orderService.getAll();
        this.orders = this.orders.filter(order => !selectedOrders.includes(order));
        this.selectedOrders = selectedOrders;
        this.selectedItemsDetails = [];
        let selectedOrdersNotes = "";
        for (let order of this.selectedOrders) {
            if (order.notes) {
                if (selectedOrdersNotes === "") {
                    selectedOrdersNotes = order.notes;
                } else {
                    selectedOrdersNotes += ", " + order.notes;
                }
            }
            this.selectedItemsDetails.push(...order.orderDetail);
        }
        let lastOrder = this.orders[this.orders.length - 1];
        for (let orderDetail of this.selectedItemsDetails) {
            let foundItem = lastOrder.orderDetail.find(
                od => od.item.name === orderDetail.item.name
            );
            if (foundItem) {
                foundItem.quantity += orderDetail.quantity;
            } else {
                lastOrder.orderDetail.push({ ...orderDetail });
            }
        }
        lastOrder.notes = selectedOrdersNotes;
        lastOrder.total = this.selectedOrders.reduce((total, order) => total + order.total, 0);
        const tableIDs: number[] = [];
        if (this.selectedTable) {
            tableIDs.push(this.selectedTable);
        }
        this.tableService.updateTable(tableIDs).subscribe(res => {
        }
        );
        localStorage.setItem('orders', JSON.stringify(this.orders));
        this.selection.clear();
        this.toastr.showToaster('success', 'The selected orders were joined successfully', 'success');
        location.reload();
    }
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.orders.forEach(row => this.selection.select(row));
    }
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.orders.length;
        return numSelected === numRows;
    }
    editOrder(order: Order): void {
        this.orderService.editOrder(order);
    }
    goToSplitOrder(orderID: number) {
        this.selectedOrderId = orderID;
        this.router.navigate(['/split'], { queryParams: { orderId: this.selectedOrderId } });
    }
}