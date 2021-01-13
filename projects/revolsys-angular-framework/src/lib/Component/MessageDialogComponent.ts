import {
  Component,
  Inject
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'raf-message-dialog',
  template: `
<h1 mat-dialog-title>{{title}}</h1>
<div mat-dialog-content>
<p>{{message}}<p>
<pre>{{body}}</pre>
</div>
<div mat-dialog-actions>
  <button mat-raised-button (click)="dialogRef.close()" color="primary">Close</button>
</div>
  `,
})
export class MessageDialogComponent {
  title: string = this.data['title'];

  message: string = this.data['message'];

  body: string = this.data['body'];

  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }
}
