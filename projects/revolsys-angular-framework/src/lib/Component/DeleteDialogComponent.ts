import {
  Component,
  Inject
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'raf-delete-dialog',
  template: `
<h1 mat-dialog-title>Delete {{typeTitle}}?</h1>
<div mat-dialog-content>
  <p>Are you sure you want to delete {{typeTitle}}:</p>
  <p><b>{{objectLabel}}</b>?</p>
</div>
<div mat-dialog-actions>
  <button mat-raised-button (click)="dialogRef.close('Cancel')">Cancel</button>
  <button mat-raised-button (click)="dialogRef.close('Delete')" color="warn" style="margin-left: 10px;">Delete</button>
</div>
  `,
})
export class DeleteDialogComponent {
  typeTitle: string = this.data['typeTitle'];

  objectLabel: string = this.data['objectLabel'];

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }
}
