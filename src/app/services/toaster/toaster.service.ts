import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toastr: ToastrService) { }

  showToaster(message: string, title: string, type: String) {

    if (type === 'success') {

      this.toastr.success(title, message);

    } else if (type === 'error') {

      this.toastr.error(title, message);

    } else if (type === 'info') {

      this.toastr.info(title, message);
    }
    else{
      console.warn(`invalid  message type ...  ${type}`)
    }
  }
}
