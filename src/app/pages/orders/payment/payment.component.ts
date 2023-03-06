import { Component } from '@angular/core';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  total: number = 50;
  amount!: string;
  remainingValue!: number;
  dollarConvert!: number;
  constructor(/*public dialogRef: MatDialogRef<PaymentComponentComponent>*/) { }
  onClose() {
    //this.dialogRef.close();
  }
  remaining() {
    if (this.amount !== undefined) {
      this.remainingValue = parseFloat(this.amount) - (this.total);
    }
  }
  dollarRemaining() {
    if (this.amount !== undefined) {
      this.dollarConvert = parseFloat(this.amount) * 3.67;
      this.remainingValue = this.dollarConvert - (this.total);
    }

  }

}

