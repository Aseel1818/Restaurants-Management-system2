import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  constructor(private toastr: ToastrService) { }
  showToaster(title: string, message: string, type: String) {
    if (type === 'success') {
      this.toastr.success(message, title);
    } else if (type === 'error') {
      this.toastr.error(message, title);
    } else if (type === 'info') {
      this.toastr.info(message, title);
    }
    else{
      console.warn(`invalid  message type ...  ${type}`)
    }
  }
}