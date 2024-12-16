import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root', // Singleton service
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  open(component:any, config?: MatDialogConfig): MatDialogRef<any> {

    return this.dialog.open(component, config);
  }


  closeAll(): void {
    this.dialog.closeAll();
  }
}
